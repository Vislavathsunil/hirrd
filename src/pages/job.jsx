
import ApplicationCard from '@/components/application-card';
import ApplyJobDrawer from '@/components/ui/apply-job';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetSingleJob, UpdateHireStatus } from '@/data/APIJobs';
// import { GetSingleJob } from '@/data/New';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import MDEditor from '@uiw/react-md-editor';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

function JobPage() {

  const { isLoaded, user } = useUser();
  const { id } = useParams();
  // this 'useFetch' for getting single job
  const { loading: loadingSingleJob, data: SingleJob, fn: fnSingleJob } = useFetch(GetSingleJob, { job_id: id });

  //this 'useFetch' for updating Hiring status
  const { loading: loadinghiringStatus, data, fn: fnHirestatus } = useFetch(UpdateHireStatus, { job_id: id });

  // Handle for updating hiring status
  function handleHirestatus(value) {
    const isOpen = value === "open";
    fnHirestatus(isOpen).then(() => {
      fnSingleJob();
    })
  }

  useEffect(() => {

    if (isLoaded) {
      fnSingleJob();

    }
  }, [isLoaded])

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div >
      {
        SingleJob &&
        <div className='flex flex-col gap-8 my-10 ' >
          <div className='flex flex-col-reverse gap-6  md:flex-row items-center md:justify-between'>
            <h1 className='text-3xl sm:text-5xl font-bold '>{SingleJob?.title}</h1>
            <img src={SingleJob?.company?.logo_url} alt={SingleJob?.company?.name} className='h-8' />
          </div>

          <div className=' flex justify-between items-center '>
            <div className='flex items-center gap-2' >
              <MapPinIcon /> {SingleJob.location}
            </div>

            <div className='flex items-center gap-2'>
              <Briefcase />{SingleJob?.applications?.length} Applicants
            </div>

            <div className='flex items-center gap-2'>
              {
                SingleJob?.isOpen ? (
                  <>
                    <DoorOpen />Open
                  </>
                ) : (
                  <>
                    <DoorClosed /> Closed
                  </>
                )
              }
            </div>
          </div>

          {/* hiring Status */}
          {loadinghiringStatus && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}

          {
            SingleJob?.recruiter_id === user?.id &&
            <div>
              <Select onValueChange={handleHirestatus} >
                <SelectTrigger className={`w-full ${SingleJob?.isOpen ? "bg-green-900" : "bg-red-900"}`} >
                  <SelectValue placeholder={
                    "Hiring status " + (SingleJob?.isOpen ? "( Open )" : "( Closed )")
                  } className='placeholder:text-lg' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"open"}  >Open </SelectItem>
                  <SelectItem value={"close"}  >Closed </SelectItem>
                </SelectContent>
              </Select>
            </div>
          }

          <h2 className='text-2xl md:text-3xl font-bold'>
            About the job
          </h2>
          <p>
            {SingleJob?.description}
          </p>

          <h2 className='text-2xl  md:text-3xl  font-bold'>
            What we are looking for
          </h2>
          <MDEditor.Markdown source={SingleJob?.requirements} className='bg-transparent sm:text-lg' />


          {/* Render application */}

          {
            SingleJob?.recruiter_id !== user?.id && <div className='flex justify-center items-center'>
              <ApplyJobDrawer job={SingleJob} user={user} fnJob={fnSingleJob} applied={SingleJob?.applications?.find((app) => app.candidate_id === user.id)} />
            </div>
          }

          {
            SingleJob?.applications?.length > 0 && SingleJob?.recruiter_id === user?.id &&
            (<div className='flex flex-col  gap-6'>

              <h2 className='text-2xl  md:text-3xl font-bold'>
                Applications
              </h2>
              {
                SingleJob?.applications?.map((application) => (
                  <ApplicationCard key={application} application={application} job={SingleJob}/>
                ))
              }

            </div>)
          }


        </div>
      }
    </div>
  )
}

export default JobPage