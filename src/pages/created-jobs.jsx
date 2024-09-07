import { GetMyJobs } from '@/data/APIJobs';
import useFetch from '@/hooks/use-fetch';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import JobCard from './job-card';
import { useUser } from '@clerk/clerk-react';

function CreatedJobs() {
    const { isLoaded, user } = useUser();

    const { loading: loadingMyJobs, data: createdJobs, fn: fnMyJobs } = useFetch(GetMyJobs, { recruiter_id: user.id });

    useEffect(() => {
        if (isLoaded) fnMyJobs();
    }, [isLoaded])


    if (!isLoaded || loadingMyJobs) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    }

    return (
        <div>
            {
                createdJobs?.length ? <div className=' grid  md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 mb-4'>
                    {
                        createdJobs.map((job) => (
                            <JobCard key={job.id} job={job} isMyJob onJobSaved={fnMyJobs} />
                        ))
                    }

                </div> : <div className='flex justify-center items-center mt-20 text-2xl'>No jobs</div>
            }
        </div>
    )
}

export default CreatedJobs