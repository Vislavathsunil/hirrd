import { useUser } from '@clerk/clerk-react';
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const { isSignedIn, user, isLoaded } = useUser();
    const { pathname } = useLocation();

    if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
        return <Navigate to="/?sign-in=true" />
    }

    // check onboarding when user loggedIn but role not defined and path is not '/onboarding'
    if (user !== undefined && !user?.unsafeMetadata?.role && pathname !== "/onboarding") return <Navigate to='/onboarding' />


    return children;


}

export default ProtectedRoute