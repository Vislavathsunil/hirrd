import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import logo from '../../public/logo.png'
import { Button } from "../components/ui/button"
import { RedirectToOrganizationProfile, RedirectToUserProfile, SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { BriefcaseBusiness, ClipboardPaste, Heart, Pen, PenBox } from 'lucide-react';

function Header() {
    const [showSignIn, setShowSignIn] = useState(false);

    const [search, setSearch] = useSearchParams();
    const { user } = useUser();

    useEffect(() => {
        // if in url is there is 'sign-in' query present then sign in popup will show to user to signin 
        if (search.get("sign-in")) {
            setShowSignIn(true);
        }
    }, [search])

    function handleOutOfSignin(e) {
        //  checking is click on the same element or outermost container
        // if it is outermost container the condition will trigger
        if (e.target === e.currentTarget) {
            setShowSignIn(false);
            setSearch({});
        }
    }

    return (
        <nav>
            <div className='py-4 flex justify-between items-center'>
                <Link>
                    <img src={logo} alt="brand-logo" className='w-20' />
                </Link>
                {/* <Button variant="outline" className="text-lg">Login</Button> */}
                <div className='flex justify-center gap-4' >
                    <SignedOut>
                        <Button variant="outline" onClick={() => setShowSignIn(true)} >Login</Button>
                    </SignedOut>
                    <SignedIn className='text-center' >
                        <RedirectToOrganizationProfile />
                        {/* Show only when user is recruiter */}
                        {
                            user?.unsafeMetadata?.role === 'Recruiter' &&
                            <Link to="/post-job">
                                <Button variant="destructive" className="rounded-full"  >
                                    <PenBox size={20} className='mr-2' />
                                    Post Job
                                </Button>
                            </Link>
                        }
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10"
                                }
                            }}
                        >
                            <UserButton.MenuItems>
                                <UserButton.Link label='My Jobs' labelIcon={<BriefcaseBusiness size={15} />} href="/my-job" />
                                <UserButton.Link label='Saved Jobs' labelIcon={<Heart size={15} />} href='/saved-jobs' />
                                <UserButton.Link label="On Boarding" labelIcon={<ClipboardPaste size={15} />} href="/onboarding" />
                            </UserButton.MenuItems>
                        </UserButton>
                    </SignedIn>
                </div>
                {
                    // it popup when user clicks on the login button
                    showSignIn && <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 container mx-auto '
                        onClick={handleOutOfSignin}>
                        <SignIn signUpFallbackRedirectUrl='/onboarding'
                            fallbackRedirectUrl='/onboarding' />
                    </div>
                }

            </div>
        </nav>
    )
}

export default Header