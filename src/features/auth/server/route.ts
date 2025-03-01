import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signInSchema } from "../schema";

const app = new Hono().post(
  "/login",
  zValidator(
    "json", signInSchema),
  (c) => {
    const {email , password } = c.req.valid("json");
    console.log({email,password});

    return c.json({ email,password });
  }
);

export default app;
