import { DATABASE_ID, IMAGES_BUCKED_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import getMember from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schema";
import { Project } from "../types";
import { endOfMonth,startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
.post("/",
  sessionMiddleware,
  zValidator("form", createProjectSchema),
  async (c) => {
     try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        if (!user) {
          return c.json({ message: "User not authenticated" }, 400);
        }

        const { name, image , workspaceId } = c.req.valid("form");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id
        });

        if(!member) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        let uploadImgaeUrl: string | undefined;

        if (image instanceof File) {
          const file = await storage.createFile(
            IMAGES_BUCKED_ID,
            ID.unique(),
            image
          );

          const arrayBuffer = await storage.getFileView(
            IMAGES_BUCKED_ID,
            file.$id
          );

          uploadImgaeUrl = `data:image/png;base64,${Buffer.from(
            arrayBuffer
          ).toString("base64")}`;
        }

        //create project
        const project = await databases.createDocument(
          DATABASE_ID,
          PROJECTS_ID,
          ID.unique(),
          {
            name: name,
            imageUrl: uploadImgaeUrl,
            workspaceId: workspaceId
          }
        );


        return c.json({ data: project });
      } catch (error) {
        return c.json({ message: `Internal Server Error ${error}` }, 500);
      }
  }
)
.get(
  "/",
  sessionMiddleware,
  zValidator(
    "query",
    z.object({
      workspaceId: z.string(),
    })
  ),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.valid("query");

    if(!workspaceId) {
        return c.json({error: "Missing workspaceId"}, 400);
    }

    const  member  = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ message: "Unauthorized member" }, 401);
    }

    const projects = await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({
      data: projects,   
    });


  }
)
.get(
  "/:projectId",
  sessionMiddleware,
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const projectId = c.req.param("projectId");

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
          databases,
          workspaceId: project.workspaceId,
          userId: user.$id,
    });

    if (!member) {
          return c.json({ message: "Unauthorized" }, 401);
    }

    return c.json({data : project});


  }
)
.patch(
    "/:projectId",
    zValidator("form", updateProjectSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        if (!user) {
          return c.json({ message: "User not authenticated" }, 400);
        }

        const { projectId } = c.req.param();
        const { name, image } = c.req.valid("form");

        const existinProject =  await databases.getDocument<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          projectId
        );


        const member = await getMember({
          databases,
          workspaceId: existinProject.workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        let uploadImgaeUrl: string | undefined;

        if (image instanceof File) {
          const file = await storage.createFile(
            IMAGES_BUCKED_ID,
            ID.unique(),
            image
          );

          const arrayBuffer = await storage.getFileView(
            IMAGES_BUCKED_ID,
            file.$id
          );

          uploadImgaeUrl = `data:image/png;base64,${Buffer.from(
            arrayBuffer
          ).toString("base64")}`;
        } else {
          uploadImgaeUrl = image;
        }

        const project = await databases.updateDocument(
          DATABASE_ID,
          PROJECTS_ID,
          projectId,
          {
            name,
            imageUrl: uploadImgaeUrl,
          }
        );

        return c.json({ data: project });
        
      } catch (error) {
        return c.json({ message: `Internal Server Error ${error}` }, 500);
      }
    }
)
.delete(
    "/:projectId",
    sessionMiddleware,
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");

        if (!user) {
          return c.json({ message: "User not authenticated" }, 400);
        }

        const { projectId } = c.req.param();

        const existinProject =  await databases.getDocument<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          projectId
        );

        const member = await getMember({
          databases,
          workspaceId: existinProject.workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

        return c.json({ data: { $id : existinProject.$id } });
      } catch (error) {
        return c.json({ message: `Internal Server Error ${error}` }, 500);
      }
    }
)
.get(
  "/:projectId/analytics",
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const projectId = c.req.param("projectId");

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
          databases,
          workspaceId: project.workspaceId,
          userId: user.$id,
    });

    if (!member) {
          return c.json({ message: "Unauthorized" }, 401);
    }

    const now = new Date()
    const thisMonthStart = startOfMonth(now);
    const thisMonthend =  endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const  thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthend.toISOString()),
      ]
    )

    const  lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    )

    const taskCount = thisMonthTasks.total;
    const taskDifference = taskCount - lastMonthTasks.total

    // end tasks

    const  thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthend.toISOString()),
      ]
    )

    const  lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    )

    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.total

    // end assigneed

    const  thisMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthend.toISOString()),
      ]
    )

    const  lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    )

    const incompleteTaskCount = thisMonthIncompleteTasks.total;
    const incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks.total;

    //incomplete end

    const  thisMonthCompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthend.toISOString()),
      ]
    )

    const  lastMonthCompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    )

    const completeTaskCount = thisMonthCompleteTasks.total;
    const completeTaskDifference = completeTaskCount - lastMonthCompleteTasks.total
    //complete end

    const  thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthend.toISOString()),
      ]
    )

    const  lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    )

    const overdueTaskCount = thisMonthOverdueTasks.total;
    const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total

    return c.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        completeTaskCount,
        completeTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        overdueTaskCount,
        overdueTaskDifference

      }
    })

  }
) 
;

export default app;
