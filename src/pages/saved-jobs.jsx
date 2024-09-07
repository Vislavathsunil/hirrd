import { GetSavedJobs } from '@/data/APIJobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import JobCard from './job-card';

function SavedJobs() {

    const { isLoaded, user } = useUser();

    const { loading: loadingSavedJobs, data: SavedJobs, fn: fnSavedJobs } = useFetch(GetSavedJobs);

    useEffect(() => {
        if (isLoaded) fnSavedJobs();
    }, [isLoaded])

    // console.log(SavedJobs);


    if (!isLoaded || loadingSavedJobs) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    }

    return (
        <div>
            <h1 className='text-center text-4xl md:text-5xl font-bold py-8' >Saved Jobs</h1>

            {loadingSavedJobs === false && <div>

                {
                    SavedJobs?.length ? <div className='mt-4 grid  md:grid-cols-2 lg:grid-cols-3 gap-4  mb-8'>
                        {
                            SavedJobs.map((saved) => (
                                <JobCard key={saved.id} job={saved.job} savedInit={true} onJobSaved={fnSavedJobs} />
                            ))
                        }

                    </div> : <div className='flex justify-center items-center mt-20 text-2xl text-blue-500'>You don't any favourite jobs</div>
                }
            </div>
            }

        </div>

    )
}

export default SavedJobs;