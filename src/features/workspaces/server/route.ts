import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkSpaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono()
.post(
  "/",
  zValidator("json", createWorkSpaceSchema),
  sessionMiddleware,
  async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");

      if (!user) {
        return c.json({ message: "User not authenticated" }, 400);
      }

      const { name } = c.req.valid("json");

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name: name,
          userId: user.$id
        }
      );

      return c.json({ data: workspace });
    } catch (error) {
      return c.json({ message: `Internal Server Error ${error}` }, 500);
    }
  }
);

export default app;
