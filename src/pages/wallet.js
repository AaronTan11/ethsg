import React from 'react'
import Nav from 'components/navBar'

export default function wallet() {
    return (
        <>
        <Nav />
            <div className="flex justify-center items-center flex-col h-screen space-y-7">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Wallet
                </h1>
            </div>
        </>
    );
}
