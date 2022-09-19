import React, { useState } from "react";
import Link from 'next/link';

export default function Navbar() {
    const [navbarOpen, setNavbarOpen] = useState(false);
    return (
        <>
            <nav className="w-full fixed flex flex-wrap items-center justify-between px-2 py-3 bg-slate-900">
                <div className="container-fluid px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <Link href="/" >
                            <a
                                className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
                            >
                                {process.env.NEXT_PUBLIC_APPNAME}
                            </a>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}