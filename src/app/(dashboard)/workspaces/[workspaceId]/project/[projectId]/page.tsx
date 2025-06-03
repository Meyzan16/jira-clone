import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrent } from '@/features/auth/queries'
import { getProject } from '@/features/projects/queries';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';

interface ProjectIdPageProps {
  params: { 
    projectId: string;
  };    
}

const ProjectIdPage = async ( {params} : ProjectIdPageProps) => {
    const user = await getCurrent();

    if(!user) {
        redirect('/sign-in');
    }

    const initialValues = await getProject({
      projectId: params.projectId,
    })

    if(!initialValues) {
        throw new Error('Project not found');
    }

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2 bg-gray-200 text-dark hover:bg-gray-300 px-4 py-2 rounded-lg'>
          <ProjectAvatar 
              name={initialValues.name}
              image={initialValues.imageUrl}
              className='size-10'
          />
          <p className='text-md font-semibold'>{initialValues.name}</p>
        </div>

        <div>
          <Button variant='secondary' size='sm' className='text-sm'>
            <Link href={`/workspaces/${initialValues.workspaceId}/project/${initialValues.$id}/settings`} 
              className='flex items-center gap-2 py-2 px-4'>
              <PencilIcon />
                edit project
            </Link>
          </Button>
        </div>

      </div>
    </div>
  )
}

export default ProjectIdPage