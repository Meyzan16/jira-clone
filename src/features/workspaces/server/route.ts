import "server-only";

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkSpaceSchema, updateWorkSpaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKED_ID,
  MEMBERS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { endOfMonth,startOfMonth, subMonths } from "date-fns";
import { generateInviteCode } from "@/lib/utils";
import getMember from "@/features/members/utils";
import { z } from "zod";
import { Workspace } from "../types";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })
  .get("/:workspaceId",
    sessionMiddleware,
    async (c) => {
      const user  = c.get("user");
      const databases = c.get("databases")
      const workspaceId = c.req.param("workspaceId");

       const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

      if(!member) {
        return c.json ({error : "Unauthorized"}, 401)
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      )

      return c.json ({data : workspace});
    }
  )
  .get("/:workspaceId/info",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases")
      const workspaceId = c.req.param("workspaceId");

      

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      )

      return c.json ({data : {
        $id: workspace.$id , 
        name:workspace.name , 
        imageUrl : workspace.imageUrl} });
    }
  )
  .post(
    "/",
    zValidator("form", createWorkSpaceSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        if (!user) {
          return c.json({ message: "User not authenticated" }, 400);
        }

        const { name, image } = c.req.valid("form");

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

        //create workspace
        const workspace = await databases.createDocument(
          DATABASE_ID,
          WORKSPACES_ID,
          ID.unique(),
          {
            name: name,
            userId: user.$id,
            imageUrl: uploadImgaeUrl,
            inviteCode: generateInviteCode(6),
          }
        );

        //create document punya members nya
        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRole.ADMIN,
        });

        return c.json({ data: workspace });
      } catch (error) {
        return c.json({ message: `Internal Server Error ${error}` }, 500);
      }
    }
  )
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkSpaceSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        if (!user) {
          return c.json({ message: "User not authenticated" }, 400);
        }

        const { workspaceId } = c.req.param();
        const { name, image } = c.req.valid("form");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member || member.role !== MemberRole.ADMIN) {
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

        const workspace = await databases.updateDocument(
          DATABASE_ID,
          WORKSPACES_ID,
          workspaceId,
          {
            name,

            imageUrl: uploadImgaeUrl,
          }
        );

        return c.json({ data: workspace });
      } catch (error) {
        return c.json({ message: `Internal Server Error ${error}` }, 500);
      }
    }
  )
  .delete(
    "/:workspaceId",
    sessionMiddleware,
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");

        if (!user) {
          return c.json({ message: "User not authenticated" }, 400);
        }

        const { workspaceId } = c.req.param();

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member || member.role !== MemberRole.ADMIN) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        //TODO :  Delete members , projects and tasks

        await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

        return c.json({ data: { $id :workspaceId } });
      } catch (error) {
        return c.json({ message: `Internal Server Error ${error}` }, 500);
      }
    }
  ) 
  .post(
    "/:workspaceId/reset-invite-code",
    sessionMiddleware,
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");

        if (!user) {
          return c.json({ message: "User not authenticated" }, 400);
        }

        const { workspaceId } = c.req.param();

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member || member.role !== MemberRole.ADMIN) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
          inviteCode: generateInviteCode(6),
        });

        return c.json({ data: workspace });
        
      } catch (error) {
        return c.json({ message: `Internal Server Error ${error}` }, 500);
      }
    }
  )
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      try {
        const { workspaceId } = c.req.param();
        const { code } = c.req.valid("json");

        const databases = c.get("databases");
        const user = c.get("user");

        if (!user) {
          return c.json({ message: "User not authenticated" }, 400);
        }

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (member) {
          return c.json({ message: "alredy a member" }, 400);
        }

        const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

        if (workspace.inviteCode !== code) {
          return c.json({ message: "Invalid invite code" }, 400);
        }

        const newMember = await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
          workspaceId: workspaceId,
          userId: user.$id,
          role: MemberRole.MEMBER,
        });

        return c.json({ data: newMember });
        
      } catch (error) {
        return c.json({ message: `Internal Server Error ${error}` }, 500);
      }
    }
  )
  .get(
  "/:workspaceId/analytics",
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const workspaceId = c.req.param("workspaceId");

    const member = await getMember({
          databases,
          workspaceId,
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
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthend.toISOString()),
      ]
    )

    const  lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthend.toISOString()),
      ]
    )

    const  lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthend.toISOString()),
      ]
    )

    const  lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthend.toISOString()),
      ]
    )

    const  lastMonthCompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
