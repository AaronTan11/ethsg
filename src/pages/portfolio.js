import Image from "next/image";
import NavBar from "@/components/navBar";
import dynamic from "next/dynamic";

const CustomPieChart = dynamic(() => import("@/components/CustomPieChart"), {
    ssr: false,
});

export default function Home() {
    return (
        <>
            <NavBar />

            <main className="ml-28 space-y-6 py-6">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Portfolio
                </h1>

                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    $850
                </h3>

                <div className="flex space-x-11 max-w-5xl">
                    <CustomPieChart />
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        Your Portfolio is up/down XXX % today dsfsdfsdf
                        sfsdfsdfsf sdfsdfsdfsdf sdfsdfsdfsdfsd sadasdassdfddgdfg
                        dgdfgdfgdfgdfgdfgdfgd fdgdfgdgdfgdfgdgdfgdggg
                    </p>
                </div>
            </main>
        </>
    );
}
