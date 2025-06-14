// utils/task-options.ts

import { TaskStatus, TaskPriority } from "@/features/tasks/types";

export const taskStatusOptions = Object.entries(TaskStatus).map(
  ([key, value]) => ({
    id: value,
    name: key.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
  })
);

export const taskPriorityOptions = Object.entries(TaskPriority).map(
  ([key, value]) => ({
    id: value,
    name: key.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
  })
);
