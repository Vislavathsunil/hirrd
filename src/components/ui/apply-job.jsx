import React, { useState } from 'react'

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z, } from 'zod'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Button } from "./button"
import { Input } from './input';
import { ApplyJob } from '@/data/apiApplication';
import useFetch from '@/hooks/use-fetch';
import { BarLoader } from 'react-spinners';

// Email JS
import emailjs from "@emailjs/browser"
import toast, { Toaster } from 'react-hot-toast'

const schema = z.object({
    experience: z.number().min(1, { message: "Experience minimum 0" }).int(),
    skills: z.string().min(1, { mesage: "Skills atleast one " }),
    education: z.enum(["Intermediate", "Gradutate", "Post Gradutate"], { messages: "Education is required" }),
    resume: z.any().refine((file) => file[0] && (file[0].type == "application/pdf" || file[0].type == 'application/msword' || file[0].type == "application/ppt"),
        { message: "Only PDF, PPT or Word documents are allowed" })
})

function ApplyJobDrawer({ job, user, fnJob, applied = false }) {

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm({ resolver: zodResolver(schema) });

    const { loading: loadingApply, data: ApplyData, error: errorApply, fn: fnApply } = useFetch(ApplyJob);

    console.log("user :", user)
    // console.log("user :", user.primaryEmailAddress.emailAddress);
    console.log("job details :", job)

    function onSubmit(data) {
        console.log("I am applying data :", data);


        fnApply({
            ...data,
            job_id: job.id,
            candidate_id: user.id,
            name: user.fullName,
            status: "applied",
            resume: data.resume[0],
        }).then((result) => {
            fnJob();

            const EmailData = {
                name: user.fullName,
                email: user.primaryEmailAddress.emailAddress,
                companyName: job?.company?.name,
                companyImage: `${job?.company?.logo_url}`,
                location: job?.location,
                applyTitle: `Applied for ${job?.title} at ${job?.company?.name}`,
                experience: data.experience,
                skills: data.skills,
                education: data.education,
                status: "Applied",
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


            console.log("Final Email Data : ", EmailData);


            reset();
        })
    }



    return (
        <Drawer open={applied ? false : undefined}>
            <DrawerTrigger  >
                <Button
                    size="lg"
                    className="text-xl"
                    variant={job?.isOpen && !applied ? "blue" : "destructive    "}
                    disabled={!job?.isOpen || applied} >{
                        job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"
                    }</Button>

            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Apply for {job?.title} for {job?.company?.name}</DrawerTitle>
                    <DrawerDescription>Please fill the below form.</DrawerDescription>
                </DrawerHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col px-4 gap-4' >
                    <Input type="text" placeholder="Years of experience" className="flex-1" {...register("experience", { valueAsNumber: true })} ></Input>
                    {errors.experience && <p>{errors.experience.message}</p>}
                    <Input type="text" placeholder="Skills with commas" className="flex-1" {...register("skills")} ></Input>
                    {errors.skills && <p>{errors.skills.message}</p>}


                    <Controller
                        name="education"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} {...field}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Intermediate" id="Intermediate" />
                                    <Label htmlFor="option-one">Intermediate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Gradutate" id="Gradutate" />
                                    <Label htmlFor="option-two">Gradutate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Post Gradutate" id="Post Gradutate" />
                                    <Label htmlFor="option-two">Post Gradutate</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    {errors.education && <p>{errors.education.message}</p>}


                    <Input type="file" accept=".pdf,.doc,.docx, .ppt" className="flex-1 file:text-gray-500" {...register("resume")} ></Input>
                    {errors.resume && <p>{errors.resume.message}</p>}

                    {errorApply?.message &&
                        <p>{errorApply?.message}</p>}

                    {loadingApply && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
                    <Button type="submit" className="flex-1" variant="blue">Apply Now</Button>

                </form>


                <DrawerFooter>
                    <DrawerClose asChild >
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default ApplyJobDrawer;