import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function landingNav() {
  return (
    <div>
            <nav className="w-full ">
                <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8 border-b-0.5 border-slate-200">
                    <div>
                        <div className="flex items-center justify-between py-3 md:py-5 md:block">
                            {/* LOGO */}
                            <Link href="/">
                                <h2 className="text-2xl text-black-600 font-bold ">
                                    CLownz
                                </h2>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
  )
}
