import React from 'react'
import { Task } from '../types'
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import DottedSeparator from '@/components/ui/dotted-separator';
import OverviewProperty from './overview-property';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { TaskDate } from './task-date';
import { Badge } from '@/components/ui/badge';
import { snakeCaseToTitleCase } from '@/lib/utils';
import { useEditTaskModal } from '../hooks/use-edit-tasks-modal';

interface TaskOverviewProps {
    task : Task;
}

const TaskOverview = ({task} : TaskOverviewProps) => {

    const {open , close} =  useEditTaskModal();


  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
        <div className='bg-muted rounded-lg p-4'>
            <div className='flex  items-center justify-between'>
                <p className='text-lg font-semibold'> Overview </p>
                <Button onClick={() => open(task.$id) } size='sm' variant='secondary'>
                    <PencilIcon className='size-4 mr-2' />
                    Edit
                </Button>
            </div>
            <DottedSeparator className='my-4' />
            <div className='flex flex-col gap-y-4'>
                <OverviewProperty label="assignee">
                    <MemberAvatar 
                        name={task.assignee.name}
                        className='size-6'
                    />
                    <p className='text-sm font-medium '>{task.assignee.name}</p>
                </OverviewProperty>

                <OverviewProperty label="Due Date">
                    <TaskDate 
                        value={task.dueDate}
                        className='text-sm font-medium'
                    />|
                </OverviewProperty>

                <OverviewProperty label="Status">
                    <Badge variant={task.status}>
                        {snakeCaseToTitleCase(task.status)}
                    </Badge>
                </OverviewProperty>
                

            </div>
        </div>
    </div>
  )
}

export default TaskOverview