import "server-only";
import {
  Account,
  Databases,
  Models,
  Storage,
  Client,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { AUTH_COOKIE } from "@/features/auth/constants";

type AddtionalContext = {
  Variables: {
    account: AccountType,
    databases: DatabasesType,
    storage: StorageType,
    users: UsersType,
    user: Models.User<Models.Preferences>,
  },
};

export const sessionMiddleware = createMiddleware<AddtionalContext>
(async (c, next) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

  const session = getCookie(c, AUTH_COOKIE);

  if (!session) {
    return c.json({message: "Authenticated" }, 400);
  }

  client.setSession(session);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  const user = await account.get();

  c.set("account", account);
  c.set("databases", databases);
  c.set("storage", storage);
  c.set("user", user);

  await next();
});
