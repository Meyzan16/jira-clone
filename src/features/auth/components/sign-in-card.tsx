import React from 'react'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/card'

const SignInCard = () => {
  return (
    <Card className="md:w-[487px] lg:w-full lg:h-full w-full h-full  border-none shadow-none">
        <CardHeader className="flex items-center justify-center text-center p-7">
            <CardTitle className="text-2xl">
                    Welcome Back
            </CardTitle>
        </CardHeader>
        <div className='px-7 mb-2 '>
          <div className='border border-b-2'></div>
        </div>
    </Card>
  )
}

export default SignInCard