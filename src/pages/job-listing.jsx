import { useSession, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'

// barloader 
import { BarLoader } from "react-spinners";



// API for jobs
import { GetJobs } from "../data/APIJobs"
import useFetch from '@/hooks/use-fetch.jsx';
import JobCard from './job-card';
import { GetCompanies } from '@/data/apiCompanies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { State } from 'country-state-city';

function JobList() {
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [search_query, setSearch_query] = useState("");

  // States for Paginations
  const [pageNo, setPageNo] = useState(1);
  const [totalLength, setTotalLength] = useState(0);


  const { session } = useSession();
  const { isLoaded } = useUser();

  const { fn: fnJobs, data: JobData, error, loading } = useFetch(GetJobs, { location, company_id, search_query });

  const { fn: fnCompanies, data: companies } = useFetch(GetCompanies);
  console.log(companies);



  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, company_id, search_query])


  // Getting Comapanies
  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded])
 
  function handleSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search-query")
    if (query) setSearch_query(query);
  }
  function handleClear() {
    setLocation("");
    setCompany_id("");
    setSearch_query("");
  }

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  // Pagination handling


  return (

    <section>
      <h1 className='text-center font-extrabold text-5xl sm:text-6xl py-8 '>Latest Jobs</h1>

      {/* Filter by searching title  */}
      <form onSubmit={handleSearch} className='flex justify-center items-center gap-4 h-10 w-full mt-4'>
        <Input type="text" placeholder="Serach by job title..." name="search-query" className="h-full flex-1 px-4 text-lg" />
        <Button type="submit" variant="blue" className="h-full  text-lg">Search</Button>
      </form>



      <div className='mt-5 flex flex-col sm:flex-row gap-4  '>

        {/* Filter by  State */}
        <Select value={location} onValueChange={(value) => setLocation(value)} >
          <SelectTrigger >
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>States</SelectLabel>
              {
                State.getStatesOfCountry("IN").map(({ name }) => {
                  return <SelectItem key={name} value={name}>{name}</SelectItem>
                })
              }
            </SelectGroup>
          </SelectContent>
        </Select>


        {/* Filter by Companies name */}
        <Select value={company_id} onValueChange={(value) => setCompany_id(value)} >
          <SelectTrigger >
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent>
            {
              companies && <SelectGroup>
                {
                  companies.map(({ name, id,length }) => {
                    return (
                      <SelectItem key={name} value={id}>{name}{length}</SelectItem>
                    )
                  })
                }
              </SelectGroup>
            }
          </SelectContent>
        </Select>

        <Button variant="destructive" className="sm:w-1/2" onClick={handleClear}>Clear </Button>

      </div>


      {
        loading && <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      }

      <div  >
        {loading === false && <div>

          {
            JobData?.length ? <div className='mt-8 grid  md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 mb-4'>
              {
                JobData.map((job) => (
                  <JobCard key={job.id} job={job} savedInit={job?.savedJobs?.length > 0} />
                ))
              }

            </div> : <div className='flex justify-center items-center mt-20 text-2xl'>No jobs</div>
          }

          <div>
            {
              companies && <div>{
                
              }</div>
            }
          </div>

        </div>}
      </div>

      <div>



      </div>
    </section>
  )
}

export default JobList;