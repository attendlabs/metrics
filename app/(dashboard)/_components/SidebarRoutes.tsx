"use client";

import React from 'react'
import SidebarItem from './SidebarItem';
import { Layout, Compass, List, BarChart } from 'lucide-react';
import { usePathname } from 'next/navigation';

// TODO: verificar user + routes

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    }
];

const teacherRoutes = [
    {
        icon: List,
        label: "Empresas",
        href: "/admin/companies",
    },
    {
        icon: BarChart,
        label: "Análises",
        href: "/admin/analytics",
    }
]

const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/teacher");

    const routes = teacherRoutes;
    return (
        <div className='flex flex-col w-full'>
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}

export default SidebarRoutes