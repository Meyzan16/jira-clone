import Button from '@/components/button';
import Image from 'next/image';
import React from 'react'

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({children}: AuthLayoutProps) => {
  return (
    <main className='bg-neutral-100 min-h-screen '>
        <div className='mx-auto max-w-screen-2xl p-6'>
            <nav className='flex justify-between items-center'>
                <Image src="/logo.svg" height={60} width={152} alt='logo' />
                <div className='flex items-center gap-2'>
                    <Button variant='secondary'>
                        Sign Up
                    </Button>
                </div>
            </nav>
            <div className='flex flex-col items-center justify-center pt-4 md:pt-14 font-sans'>
                {children}
            </div>
        </div>
    </main>
  )
}

export default AuthLayout