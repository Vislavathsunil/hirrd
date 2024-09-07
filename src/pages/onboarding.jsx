import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';  //using condition we can navigate
import { BarLoader } from 'react-spinners';

function Onboarding() {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();

    useEffect(()=>{
        if(user?.unsafeMetadata?.role){
            navigate(user?.unsafeMetadata?.role === 'Candidate' ? "/jobs" : '/post-job')
        }
    },[user])  

    async function handleUser(role) {
        await user.update({
            unsafeMetadata: { role },
        }).then(() => {
            navigate(role === 'Candidate' ? "/jobs" : '/post-job')
        }).catch((error) => {
            console.log(error)
        })
    }

    if (!isLoaded) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      }

    return (
        <section className='flex flex-col justify-center items-center gap-6 mt-36'>

            <h1 className='text-7xl md:text-8xl font-extrabold tracking-tighter'>I am a...</h1>
            <div className='grid grid-cols-2 gap-4 w-full md:px-40 mt-10'>
                <Button variant='blue' className="h-24 text-2xl" onClick={() => handleUser('Candidate')} >Candidate</Button>
                <Button variant='destructive' className="h-24 text-2xl" onClick={() => handleUser('Recruiter')}>Recruiter</Button>
            </div>

        </section>
    )
}

export default Onboarding;