import { PencilIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react'
import { Task } from '../types'
import { Button } from '@/components/ui/button';
import DottedSeparator from '@/components/ui/dotted-separator';

import { useUpdateTask } from '../api/use-update-tasks';
import { Textarea } from '@/components/ui/textarea';

interface TaskDescriptionProps {
    task : Task;
}

const TaskDescription = ({task} : TaskDescriptionProps) => {

    const [isEditing , setIsEditing] = useState(false)
    const [value, setValue] = useState(task.description)

    const {mutate , isPending} = useUpdateTask();

    const handleSave = () => {
        mutate ({
            json: {description : value},
            param: {taskId : task.$id}
        },{
            onSuccess: () => {
                setIsEditing(false);
            }
        })
    }

  return (
    <div className='p-4 border rounded-lg'>
        <div className='flex items-center justify-between'>
            <p className='text-lg font-semibold'>Overview</p>
            <Button onClick={() => setIsEditing((prev) =>  !prev)} className='sm' variant='secondary'>
                {isEditing  ? (
                    <XIcon className='size-4 mr-2' />
                ) : (
                    <PencilIcon className='size-4 mr-2' />
                )}

                {isEditing ? "cancel" : "edit"}
            </Button>
        </div>
        <DottedSeparator className='my-4'/>

        {
            isEditing ? (
                <div className='flex flex-col gap-y-4'>
                    <Textarea 
                        placeholder="Add a description"
                        value={value}
                        rows={4}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={isPending}
                    />
                    <Button
                        size='sm'
                        className='w-fit ml-auto'
                        onClick={handleSave}
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            ) : (
                <div>
                    {task.description || (
                        <span className='text-muted-foreground'>
                            No Description set
                        </span>
                    )}
                </div>

            )
        }

    </div>
  )
}

export default TaskDescription