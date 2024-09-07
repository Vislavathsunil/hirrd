import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Boxes, Briefcase, Download, School } from 'lucide-react'
import { UpdataApplication } from '@/data/apiApplication';
import useFetch from '@/hooks/use-fetch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarLoader } from 'react-spinners';

function ApplicationCard({ job, application, isCandidate = false }) {

  

  function handleDownload() {
    const ele = document.createElement("a");
    ele.href = application?.resume;
    ele.target = "_blank";
    ele.click();
  }

  console.log("application :", application)
  console.log("job :", job);



  const { loading: loadingUpdateStatus, fn: fnUpdateHiringStatus } = useFetch(UpdataApplication, { job_id: application.job_id });

  function handleStatusChage(status) {
    fnUpdateHiringStatus(status).then(() => {
      const JobStatus = {

        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        companyName: job?.company?.name,
        companyImage: `${job?.company?.logo_url}`,
        location: job?.location,
        applyTitle: `Applied for ${job?.title} at ${job?.company?.name}`,
        experience: data.experience,
        skills: data.skills,
        education: data.education,
        status: status,
      }



      emailjs.send(
        "service_0jlnazo",
        "template_pwi79tv",
        EmailData,
        "rbLde6NDZEcWcxx_Z",
      ).then((response) => {
        toast.success("Message send successfully");
      }).catch((error) => {
        toString.error("Something error to send email..")
      })
    });
  }

  return (
    <Card>
      {loadingUpdateStatus && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className='flex items-center justify-between   ' >
          <h2 className='font-bold text-lg sm:text-xl capitalize'>
            {
              isCandidate ? `${application?.job?.title} at ${application?.job?.company?.name}` : `${application?.name}`
            }
          </h2>
          <Download
            size={15}
            className='bg-white text-black h-8 w-8 rounded-full p-2 cursor-pointer  '
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:flex-row justify-between ">

        <div className='flex items-center gap-2'>
          <Briefcase size={18} /> {application?.experience} years of experince
        </div>

        <div className='flex items-center gap-2'>
          <School size={18} /> {application?.education}
        </div>

        <div className='flex items-center gap-2'>
          <Boxes size={18} /> Skills: {application?.skills}
        </div>

      </CardContent>

      <CardFooter className="flex flex-col gap-4 items-start  md:flex-row md:justify-between md:items-center   text-sm md:text-base  ">
        <span className="w-full md:w-auto" >{new Date(application?.created_at).toLocaleString()}</span>

        {

          isCandidate ? <span className='font-bold capitalize w-full md:w-auto'>Status : {application.status}</span> :
            <div className="w-full md:w-auto" >
              <Select onValueChange={handleStatusChage} value={application.status} >
                <SelectTrigger className="w-full md:w-52" >
                  <SelectValue placeholder="Application Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied"  >Applied </SelectItem>
                  <SelectItem value="interviewing"  > Interviewing </SelectItem>
                  <SelectItem value="hired"  > Hired</SelectItem>
                  <SelectItem value="rejected"  >Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
        }

      </CardFooter>

    </Card>
  )
}

export default ApplicationCard
