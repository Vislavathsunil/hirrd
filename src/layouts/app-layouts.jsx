import Header from '@/components/Header';
import React from 'react'
import { Outlet } from 'react-router-dom';

function Applayouts() {
    return (
        <div>
            <div className='grid-background' ></div>

            {/* All routes will be shown here */}
            <main className='min-h-screen container mx-auto'>
                <Header />
                <Outlet />
            </main>
        </div>
    )
}

export default Applayouts;