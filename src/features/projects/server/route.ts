import { DATABASE_ID, IMAGES_BUCKED_ID, PROJECTS_ID } from "@/config";
import getMember from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { error } from "console";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema } from "../schema";

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

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({
      data: projects,   
    });


  }
);

export default app;
