import { getCurrent } from '@/features/auth/queries'
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { getWorkspaceInfo } from '@/features/workspaces/queries';
import { redirect, RedirectType } from 'next/navigation';
import React from 'react'

interface WorkspaceIdSettingPageProps {
  params : {
    workspaceId : string;
  }
}

const WorkspaceJoinPage = async ({params} : WorkspaceIdSettingPageProps) => {
  const user = await getCurrent();
  if(!user)  redirect("/sign-in");

  const initialValues = await getWorkspaceInfo({ workspaceId : params.workspaceId});

  if(!initialValues) {
    redirect ("/");
  }

  return (
    <div className='w-full lg:max-w-xl'>
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  )
}

export default WorkspaceJoinPage