import ApplicationCard from '@/components/application-card';
import { GetApplications } from '@/data/apiApplication';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';

function CreateApplication() {
    const { isLoaded, user } = useUser();

    const { loading: loadingApplications, data: applications, fn: fnApplications } = useFetch(GetApplications, { user_id: user.id });

    useEffect(() => {
        if (isLoaded) fnApplications();
    }, [isLoaded])

    console.log(applications)

    if (!isLoaded || loadingApplications) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    }

    return (
        <div>
            {applications && <div className='flex flex-col gap-4'>
                {
                    applications.map((application) => (
                        <ApplicationCard key={application} application={application} isCandidate={true} />
                    ))
                }
            </div>}

        </div>
    )
}

export default CreateApplication