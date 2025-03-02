import "server-only";

import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signInSchema, signUpSchema } from "../schema";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    try {
      const user = c.get("user");

      if (!user) {
        return c.json({ message: "User not authenticated" }, 400);
      }

      return c.json({ data: user });
    } catch (error) {
      return c.json({ message: `Internal Server Error ${error}` }, 500);
    }
  })
  .post("/login", zValidator("json", signInSchema), async (c) => {
    try {
      const { email, password } = c.req.valid("json");

      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json({ success: true });
    } catch (error) {
      return c.json({ message: `Internal Server Error ${error}` }, 500);
    }
  })
  .post("/register", zValidator("json", signUpSchema), async (c) => {
    try {
      const { name, email, password } = c.req.valid("json");

      const { account } = await createAdminClient();
      await account.create(ID.unique(), email, password, name);

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json({ success: true });
    } catch (error) {
      return c.json({ message: `Internal Server Error ${error}` }, 500);
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    try {
      const account = c.get("account");

      deleteCookie(c, AUTH_COOKIE);
      await account.deleteSession("current");

      return c.json({ success: true });
    } catch (error) {
      return c.json({ message: `Internal Server Error ${error}` }, 500);
    }
  });

export default app;
