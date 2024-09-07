import { AddNewComapany } from '@/data/apiCompanies';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

import { z } from "zod"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import useFetch from '@/hooks/use-fetch';
import { BarLoader } from 'react-spinners';

const schema = z.object({
    name: z.string().min(1, { message: "Company name is required" }),
    logo: z.any().refine((file) => file[0] && (file[0].type === "image/png" || file[0].type === "image/jpeg" || file[0].type === "image/jpg"),
        { message: "Only png, jpg or jpeg documents are allowed" })
})

function AddCompanyDrawer({ fnCompanies }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    const { fn: fnAddcompany, data: dataAddCompanies, loading: loadingAddCompany, error: errorAddCompany } = useFetch(AddNewComapany);



    function onsubmit(data) {
        fnAddcompany({
            ...data,
            logo: data.logo[0],
        }).then(() => {
            reset({
                name: "",
                logo: "",
            })
        })
        setIsDrawerOpen(false);
        

    }

    useEffect(() => {
        if (dataAddCompanies?.length > 0) fnCompanies();
    }, [loadingAddCompany])

    return (
        <Drawer isOpen={isDrawerOpen}   >
            <DrawerTrigger>
                <Button type="button" size="lg" variant="secondary"   onClick={() => setIsDrawerOpen(true)} >Add Company</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add your comapany</DrawerTitle>
                </DrawerHeader>

                <form className='flex flex-col gap-4 px-4'>
                    <Input type="text" placeholder="Company name"  {...register("name")} />
                    {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                    <label htmlFor="logo">Upload your logo:</label>
                    <Input type="file" accept="image/*" className="flex-1 file:text-gray-500" {...register("logo")} placeholder="your logo" />
                    {errors?.logo && <p className='text-red-500'>{errors?.logo.message}</p>}

                    <Button type="button" variant="blue" onClick={handleSubmit(onsubmit)}>Add</Button>
                </form>

                {
                    errorAddCompany?.message && <p className='text-red-500'>{errorAddCompany.message}</p>
                }

                {
                    loadingAddCompany && <BarLoader className="my-4  " width={"100%"} color="#36d7b7" />
                }


                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    )
}

export default AddCompanyDrawer; 