import  {z}  from "zod";
import { TaskPriority, TaskStatus } from "./types";

export const createTaskSchema = z.object({
    name: z.string().trim().min(1, "name task is required"),
    workspaceId: z.string().trim().min(1, "workspace ID is required"),
    dueDate: z.coerce.date().default(undefined as unknown as Date).refine((val) => !!val, {
        message: "Due date is required",
    }),
    assigneeId: z.string().trim().min(1, "Assigned ID is required"),
    status: z.nativeEnum(TaskStatus, {required_error : "Status is Required"}),
    priority: z.nativeEnum(TaskPriority, {required_error : "Priority is Required"}),
    projectId: z.string().trim().min(1, "Project ID is required"),
    // description: z.string().optional(),
    // position
});