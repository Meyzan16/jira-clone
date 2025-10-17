import React, {useCallback , useEffect , useState} from "react";
import  {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult
} from "@hello-pangea/dnd";

import { Task, TaskStatus } from "../types";
import { KanbanColumnHeaders } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_PREVIEW,
    TaskStatus.DONE
];

type TaskState = {
    [key in TaskStatus]: Task[];
}

interface DataKanbanProps {
    data: Task[],
    onChange: (tasks: {$id: string , status: TaskStatus, position: number}[]) => void;
};

export const DataKanban = ({data, onChange}: DataKanbanProps) => {
    const  [tasks, setTasks] = useState<TaskState>(() => {
        const initialTasks: TaskState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_PREVIEW]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach((task) => {
            initialTasks[task.status].push(task);
        });

        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
        });

        return initialTasks;
    });

    useEffect(() => {
        const newTasks: TaskState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_PREVIEW]: [],
            [TaskStatus.DONE]: [],
        };

         data.forEach((task) => {
            newTasks[task.status].push(task);
        });

         Object.keys(newTasks).forEach((status) => {
            newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
        });

        setTasks(newTasks);

    },[data])   ;


    const onDragEnd = useCallback((result: DropResult) => {
        if(!result.destination) return;

        const {source, destination} = result
        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus =  destination.droppableId as TaskStatus;

        let updatesPayload: {$id: string; status: TaskStatus; position: number} [] = [];

        setTasks((prevTasks) => {
            const newTasks = {...prevTasks};

            //safely remove the task from source column
            const  sourceColumn = [...newTasks[sourceStatus]];
            const [movedTask] = sourceColumn.splice(source.index,1);

            //if there's no moved task (shouldn't  happen, but just in case), return the previous state
            if(!movedTask) {
                console.error("no task found at the source index");
                return prevTasks;
            }

            // craate a new task object with potentially updated status
            const updatedMovedTask =  sourceStatus !== destStatus ? {...movedTask, status: destStatus} : movedTask;

            //updated source column
            newTasks[sourceStatus] = sourceColumn;

            //add the task to the destination column
            const destColumn = [...newTasks[destStatus]];
            destColumn.splice(destination.index,0, updatedMovedTask);
            newTasks[destStatus] = destColumn;

            //prepare the updates payload
            updatesPayload = [];

            //Always updated the move task
            updatesPayload.push({
                $id: updatedMovedTask.$id,
                status: destStatus,
                position: Math.min((destination.index + 1) * 1000, 1_000_000)
            });

            //updated position for affected tasks in the destination column
            newTasks[destStatus].forEach((task, index) => {
                if(task && task.$id !== updatedMovedTask.$id) {
                    const newPosition = Math.min((index +1) * 1000, 1_000_000);
                    if(task.position !== newPosition) {
                        updatesPayload.push({
                            $id: task.$id,
                            status: destStatus,
                            position: newPosition
                        });
                    }
                }
            })

            //if the task moved between columns, update the positions in the source column as well
            if(sourceStatus !== destStatus) {
                newTasks[sourceStatus].forEach((task, index) => {
                    if(task) {
                        const newPosition =  Math.min((index +1) * 1000, 1_000_000);
                        if(task.position !== newPosition) {
                            updatesPayload.push({
                                $id: task.$id,
                                status: sourceStatus,
                                position: newPosition
                            })
                        }
                    }
                })
            };

            return newTasks;

        });

        onChange(updatesPayload);

    },[onChange]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => {
                        return (
                            <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-lg min-w-[200px]">
                                <KanbanColumnHeaders 
                                    board={board}
                                    taskCount={tasks[board].length}
                                />
                                <Droppable droppableId={board}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="min-h-[200px] py-1.5"
                                        >
                                            {tasks[board].map((task,index)=> (
                                                    <Draggable key={task.$id} draggableId={task.$id} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <KanbanCard task={task}/>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                            ))}
                                            {provided.placeholder}

                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        )
                    }
                )}
            </div>
        </DragDropContext>
    )
}