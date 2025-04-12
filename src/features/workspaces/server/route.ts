import "server-only";

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkSpaceSchema, updateWorkSpaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKED_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import getMember from "@/features/members/utils";
import { z } from "zod";
import { Workspace } from "../types";

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
        const storage = c.get("storage");
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
        const storage = c.get("storage");
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
  );

export default app;
