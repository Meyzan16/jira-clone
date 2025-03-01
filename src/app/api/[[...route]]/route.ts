import {Hono} from 'hono';
import {handle} from 'hono/vercel';

import auth from '@/features/auth/server/route'; //untuk masukin route yang ada di auth

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth);

app.get("/test", (c) => {
    return c.json({message: "Hello World"});
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;