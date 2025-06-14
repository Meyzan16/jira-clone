"use client";

import { Button } from "@/components/ui/button";
import DottedSeparator from "@/components/ui/dotted-separator";
import { Tabs, TabsContent,TabsTrigger,TabsList } from "@/components/ui/Tabs";
import { PlusIcon } from "lucide-react";
import { useCreateTasksModal } from "../hooks/use-create-tasks-modal";

export const TaskViewSwitcher = () => {

  const { open } = useCreateTasksModal();

  return (
    <Tabs
      defaultValue="table"
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger 
            className="h-8 w-full lg:w-auto"
            value="table"
            >
              Table
            </TabsTrigger>

            <TabsTrigger 
            className="h-8 w-full lg:w-auto"
            value="kanban"
            >
              Kanban
            </TabsTrigger>

            <TabsTrigger 
            className="h-8 w-full lg:w-auto"
            value="calendar"
            >
              Calendar
            </TabsTrigger>

          </TabsList>
          <Button
            onClick={open}
            variant="primary"
            size="sm"
            className="w-full lg:w-auto"
          >
            <PlusIcon className="size-4  mr-2"/>
            New 
          </Button>
        </div>

        <DottedSeparator className="my-4" />
            Data filters
        <DottedSeparator className="my-4" />

        <>
          <TabsContent value="table" className="mt-0">
            Data Table View
            </TabsContent>

             <TabsContent value="kanban" className="mt-0">
            Data kanban View
            </TabsContent>

             <TabsContent value="calendar" className="mt-0">
            Data calendar View
            </TabsContent>

            
        </>

      </div>
    </Tabs>
  );
}