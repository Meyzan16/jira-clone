"use client";

import Image from "next/image"
import Link from "next/link"
import DottedSeparator from "./ui/dotted-separator"
import { Navigation } from "./navigation"
import { WorkSpaceSwitcher } from "./workspace-switcher"
import Projects from "./projects";
export const Sidebar = () => {
    return (
        <aside className="h-full bg-neutral-100 p-4 w-full">
            <Link href="/">
                <Image src="/logo.svg" alt="logo" width={164} height={48} />
            </Link>
            <DottedSeparator className="my-4" />
            <WorkSpaceSwitcher />
            <DottedSeparator className="my-4" />
            <Navigation />
            <DottedSeparator className="my-4" />
            <Projects />


        </aside>
    )
}