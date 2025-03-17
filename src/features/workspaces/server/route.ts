import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkSpaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKED_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono()
  .get("/", sessionMiddleware , async (c) => {
    const databases = c.get("databases");

    const workspace = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID
    );

    return c.json({data : workspace});
    
  })
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

        const arrayBuffer = await  storage.getFilePreview(
          IMAGES_BUCKED_ID,
          file.$id,
        )

        uploadImgaeUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;

      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name: name,
          userId: user.$id,
          imageUrl: uploadImgaeUrl
        }
      );

      return c.json({ data: workspace });
    } catch (error) {
      return c.json({ message: `Internal Server Error ${error}` }, 500);
    }
  }
);

export default app;
