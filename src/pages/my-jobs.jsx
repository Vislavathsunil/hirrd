import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import CreateApplication from './create-application';
import CreatedJobs from './created-jobs';

function MyJobs() {
    const { isLoaded, user } = useUser();



    useEffect(() => {
        console.log(user);
    }, [isLoaded])


    if (!isLoaded) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    }
    return (
        <div  className='mb-8'>
            <h1 className='text-center text-4xl md:text-5xl py-8 font-bold' >{user?.unsafeMetadata?.role === "Candidate" ? "My Applications" : "My Jobs"}</h1>

            {
                user?.unsafeMetadata?.role === "Candidate" ? <CreateApplication /> : <CreatedJobs />
            }

        </div>
    )
}

export default MyJobs;