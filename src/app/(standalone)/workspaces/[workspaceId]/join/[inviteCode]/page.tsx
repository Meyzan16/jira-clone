import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation';
import React from 'react'
import { WorkspaceJoinPageClient } from './client';

const WorkspaceJoinPage = async () => {
  const user = await getCurrent();
  if(!user)  redirect("/sign-in");

  return <WorkspaceJoinPageClient />
}

export default WorkspaceJoinPage