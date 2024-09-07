import AddCompanyDrawer from '@/components/add-company-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GetCompanies } from '@/data/apiCompanies';
import { AddNewJob } from '@/data/APIJobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import MDEditor from '@uiw/react-md-editor';
import { State } from 'country-state-city';
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { z } from 'zod';

const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "description is required" }),
    location: z.string().min(1, { message: "Select comapny location" }),
    company_id: z.string().min(1, { message: "Select or Add new company" }),
    requirements: z.string().min(1, { message: "Requirements are required" }),
})

function PostJobs() {

    const { isLoaded, user } = useUser();
    const navigate = useNavigate();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            description: "",
            requirements: "",
            location: "",
            company_id: ""
        }
        , resolver: zodResolver(schema)
    })

    const { loading: loadingAddJob, error: errorAddJob, data: AddJobData, fn: fnAddJob } = useFetch(AddNewJob);
    const { fn: fnCompanies, data: companies, loading: loadingCompanies } = useFetch(GetCompanies);

    // console.log(user)

    // Getting Comapanies
    useEffect(() => {
        if (isLoaded) {
            fnCompanies();
        }
    }, [isLoaded])

    function onsubmit(data) {
        fnAddJob({
            ...data,
            recruiter_id: user.id,
            isOpen: true,
        }).then(() => {
            reset({
                title: "",
                description: "",
                requirements: "",
                location: "",
                company_id: ""
            })
        })
    }

    useEffect(() => {
        if (AddJobData?.length > 0) navigate("/jobs")
    }, [loadingAddJob])


    if (!isLoaded || loadingCompanies) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    }

    if (user?.unsafeMetadata?.role !== "Recruiter") {
        return <Navigate to="/jobs" />
    }

    return (
        <div>
            <h1 className='text-4xl md:text-5xl font-extrabold text-center py-8' >Post Job</h1>

            <form onSubmit={handleSubmit(onsubmit)} className='flex flex-col gap-6 py-6  ' >
                <Input type="text" placeholder="Job Title" {...register("title")} ></Input>
                {errors.title && <p className='text-red-500'>{errors.title.message}</p>}

                <Textarea placeholder="Job description with full stop at end" {...register("description")} />
                {errors.description && <p className='text-red-500'>{errors.description.message}</p>}

                <div className='flex flex-col sm:flex-row items-center gap-4'>
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
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
                        )}
                    />

                    <Controller
                        name="company_id"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger >
                                    <SelectValue placeholder="Select company" >
                                        {field.value
                                            ? companies.find((com) => com.id === Number(field.value))
                                                ?.name
                                            : "Company"}

                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        companies && <SelectGroup>
                                            {
                                                companies.map(({ name, id }) => {
                                                    return (
                                                        <SelectItem key={name} value={id}>{name}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    }
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {/* Add Company drawer */}
                    <AddCompanyDrawer fnCompanies={fnCompanies} />

                </div>

                {errors.location && <p className='text-red-500'>{errors.location.message}</p>}

                {errors.company_id && <p className='text-red-500'>{errors.company_id.message}</p>}


                <Controller
                    name="requirements"
                    control={control}
                    render={({ field }) => (
                        <MDEditor value={field.value} onChange={field.onChange} />
                    )}
                />

                {errors.requirements && <p className='text-red-500'>{errors.requirements.message}</p>}

                {errorAddJob?.message && <p className='text-red-500'>{errorAddJob?.message}</p>}
                {loadingAddJob && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}



                <Button type="submit" variant='blue' size="lg">Post Job</Button>

            </form>
        </div>
    )
}

export default PostJobs;