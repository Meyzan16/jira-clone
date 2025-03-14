import {z} from "zod";

export const createWorkSpaceSchema = z.object({
    name: z.string().trim().min(1, "Name work space is required"),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value),
    ]).optional(),
})