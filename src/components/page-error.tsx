"use client"

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface PageErrorProps {
    message : string;
}

export const PageError = ({message = "Something went wrong. Please try again later."} : PageErrorProps) => {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-y-4'>
        <AlertTriangle />
        <p className='text-sm text-muted-foreground'>
            {message}
        </p>
        <Button variant='secondary' size='md' className='text-sm'>
            <Link href={`/`}>
                Back to Home
            </Link>
        </Button>
    </div>
  )
}
