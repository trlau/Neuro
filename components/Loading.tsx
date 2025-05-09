'use client'

import LoadingThreeDotsJumping from "./motion/LoadingThreeDots";


function LoadingPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <LoadingThreeDotsJumping/>
        </div>
    )
}

export {LoadingPage};