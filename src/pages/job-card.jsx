import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteMyJobs, SavedJobs } from '@/data/APIJobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { Heart, MapPinIcon, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

function JobCard({ job, isMyJob = false, savedInit = false, onJobSaved = () => { } }) {

    const [saved, setSaved] = useState(savedInit)

    const { fn: fnSavedJobs, data: SavedJobData, loading: loadingSavedJobs } = useFetch(SavedJobs, { alreadySaved: saved });

    // delete job by rexruiter
    const { loading: loadingDeleteJob, fn: fnDeleJob } = useFetch(DeleteMyJobs, { job_id: job.id });


    const { user } = useUser();

    useEffect(() => {
        if (SavedJobData !== undefined) setSaved(SavedJobData?.length > 0);
    }, [SavedJobData])


    async function handleSavedJobs() {
        await fnSavedJobs({
            user_id: user.id,
            job_id: job.id,
        })
        onJobSaved();
    }

    // function calling to delete function
    async function handleDelete() {
        console.log("deleting");
        await fnDeleJob();
        onJobSaved();
    }

    return (
        <Card className="flex flex-col gap-1">
            {loadingDeleteJob && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}

            <CardHeader>
                <CardTitle className="flex justify-between ">
                    {job.title} {isMyJob && <Trash2 color="red" size={15} className='cursor-pointer' onClick={handleDelete} />}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 gap-4" >
                <div className='flex justify-between items-center '>
                    {job.company && <img src={job.company.logo_url} className='h-20 w-20 object-contain rounded-md' />}
                    <div className='flex items-center gap-2'>
                        <MapPinIcon size={15} /> {job.location}
                    </div>
                </div>
                <hr />
                <div>{job.description.substring(0, job.description.indexOf(".") + 1)}</div>
            </CardContent>
            <CardFooter className='flex gap-2'>
                <Link to={`/job/${job.id}`} className='flex-1'>
                    <Button variant="secondary" className="w-full"  >More details</Button>
                </Link>

                {
                    !isMyJob && <Button variant="outline" className="w-15" disabled={loadingSavedJobs} onClick={handleSavedJobs}>
                        {
                            saved ?
                                <Heart size={20} stroke='red' fill='red'></Heart> :
                                <Heart size={20} ></Heart>
                        }
                    </Button>
                }


            </CardFooter>

        </Card>
    )
}

export default JobCard;