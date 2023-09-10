import Image from "next/image";
import NavBar from '@/components/navBar'

export default function Home() {
    return (
        <>
            <NavBar />
            <div className="flex justify-center items-center flex-col h-screen space-y-7">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Portfolio
                </h1>
            </div>
        </>
    );
}
