
import {redirect} from "next/navigation";

import React from 'react'
import { getCurrent } from '@/features/auth/queries'
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

const TaskPage = async () => {
  const user = await getCurrent();
  
    if (!user) {
      redirect("/sign-in");
    }

  return (
    <div className="h-screen flex flex-col gap-y-4">
        <TaskViewSwitcher />
    </div>
  )
}

export default TaskPage