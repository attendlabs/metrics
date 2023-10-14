'use client';
import { UserButton, useAuth } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { isTeacher } from '@/lib/teacher';

import { SearchInput } from './SearchInput';

const NavbarRoutes = () => {
    const { userId } = useAuth();
    const pathname = usePathname();


    const isAdminPage = pathname?.startsWith("/admin");
    const isCompanyPage = pathname?.includes("/companies");
    const isSearchPage = pathname === "/search";

    return (
        <>
            {isSearchPage && (
                <div className='hidden md:block'>
                    <SearchInput />
                </div>
            )}
            <div className='flex gap-x-2 ml-auto'>
                {isAdminPage || isCompanyPage
                    ? (<Link href='/'>
                        <Button size={"sm"} variant="ghost">
                            <LogOut className='h-4 w-4 mr-2' />
                            Sair
                        </Button>
                    </Link>
                    )
                    : isTeacher(userId) ? (
                        <Link href='/admin/companies'>
                            <Button size={'sm'} variant="ghost">
                                Modo Admin
                            </Button>
                        </Link>
                    ) : null}
                <UserButton
                    afterSignOutUrl='/'
                />
            </div>
        </>
    )
}

export default NavbarRoutes