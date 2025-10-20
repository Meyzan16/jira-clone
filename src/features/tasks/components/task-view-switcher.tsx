"use client";

import { Button } from "@/components/ui/button";
import DottedSeparator from "@/components/ui/dotted-separator";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/Tabs";
import { useQueryState } from "nuqs";
import { PlusIcon } from "lucide-react";
import { useCreateTasksModal } from "../hooks/use-create-tasks-modal";
import { useGetTasks } from "../api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import CircleLoader from "@/components/ui/circleloader";
import { DataFilters } from "./data-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { DataKanban } from "./data-kanban";
import { useCallback } from "react";
import { TaskStatus } from "../types";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { DataCalendar } from "./data-calendar";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({hideProjectFilter} : TaskViewSwitcherProps) => {
  const [{
          status,
          priority,
          assigneeId,
          projectId,
          dueDate
      }] = useTaskFilters()

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId = useWorkspaceId();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId,
    assigneeId,
    status,
    priority,
    dueDate
  });
  const { open } = useCreateTasksModal();

  const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();

  const onKanbanChange = useCallback((
    tasks: {$id: string; status: TaskStatus; position: number}[]
  ) => {
     bulkUpdateTasks({ json: { tasks } });
  }, [bulkUpdateTasks]);

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1  border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            onClick={open}
            variant="primary"
            size="sm"
            className="w-full lg:w-auto"
          >
            <PlusIcon className="size-4  mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-5" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSeparator className="my-5" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <CircleLoader color={"#D3D3D3"} loading={true} />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>

            <TabsContent value="kanban" className="mt-0">
              <DataKanban onChange={onKanbanChange} data={tasks?.documents ?? []} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
