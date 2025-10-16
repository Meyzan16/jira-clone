import { Models } from "node-appwrite"

export enum TaskStatus {
    BACKLOG = "backlog",
    TODO = "todo",   
    IN_PROGRESS = "in-progress",
    IN_PREVIEW = "in-preview",
    DONE = "done",
}
export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export type Task = Models.Document & {
  name: string,
  status: TaskStatus,
  workspaceId: string,
  priority: TaskPriority,
  assigneeId: string,
  projectId: string,
  position: number,
  dueDate: string
}