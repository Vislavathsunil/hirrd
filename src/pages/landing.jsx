import React from 'react'

// data
import { LandingPagedata, CardDetails } from "../data/landingPageData"
import { CompaniesDetails } from "../data/CompaniesImages"
import Banner from "../../public/banner.jpeg"
import faqs from "../data/faq.json"

// libraries
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// carousel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser } from '@clerk/clerk-react'




function LandingPage() {
  const { user } = useUser();

  const plugin = React.useRef(
    Autoplay({ delay: 1000 })
  )

  return (
    <main className='flex flex-col gap-10 sm:gap-20 py-10 ' >

      {/* header Section */}
      <section className='text-center '>
        <h1 className='font-extrabold  flex flex-col justify-center items-center text-4xl md:text-5xl lg:text-7xl text-gray-300'>
          {LandingPagedata.header}
          <span className='flex justify-center items-center gap-2 sm:gap-6'> {LandingPagedata.below} <img src={LandingPagedata.logo} alt="Brand logo" className='h-14 sm:h-24 lg:h-32' /> </span>
        </h1>
        <p className='text-base sm:text-xl text-gray-400  mt-4' >{LandingPagedata.paragraph}</p>
      </section>

      {/* buttons */}
      <div className='w-full flex justify-center items-center gap-4 sm:gap-6'>
        <Link to='/jobs'>
          <Button variant="blue" size="xl">Find Jobs</Button>
        </Link>
        {user?.unsafeMetadata?.role === 'Recruiter' &&
          <Link to="/post-job">
            <Button variant="destructive" size='xl'>Post a Jobs</Button>
          </Link>
        }

      </div>

      {/* carousel */}
      <div>
        <Carousel
          plugins={[plugin.current]}
          className="w-full py-10"
        >
          <CarouselContent className="flex justify-center items-center gap-4 sm:gap-20" >
            {CompaniesDetails.map((company, index) => (
              <CarouselItem key={index} className="basis-1/3 lg:basis-1/6">
                <div className="">
                  <img src={company.src} alt={company.name} className='h-9 sm:h-14 object-contain' />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

        </Carousel>
      </div>

      {/* Banner */}
      <img src={Banner} alt="Banner" className='w-full' />

      {/* Cards */}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6' >
        {
          CardDetails.map((details, index) => (
            <Card key={index} className="">
              <CardHeader>
                <CardTitle>{details.title}</CardTitle>
              </CardHeader>
              <CardContent>{details.content} </CardContent>
            </Card>
          ))
        }
      </div>

      {/* Accordion */}


      <Accordion type="single" collapsible className="w-full">
        {
          faqs.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))
        }

      </Accordion>

      <div className='w-full flex justify-center items-center '>
        <p className='text-base text-stone-50/30'>&copy;sunil, All rights are reserved.</p>
      </div>

    </main>
  )
}

export default LandingPage;