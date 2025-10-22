"use client";

import {ReactNode, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Header from "@/containers/main/Header";
import {FormProvider} from "@/context/FormContext";
import FooterLogo from "@/components/common/FooterLogo";
import Image from "next/image";

const LayoutContent = ({children}: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // newapplication path'i dışındaki route'larda session storage'ı temizle
    useEffect(() => {
        if (typeof window !== "undefined" && pathname) {
            // newapplication veya payment ile başlamayan path'lerde session storage'ı temizle
            if (
                !pathname.startsWith("/newapplication") &&
                !pathname.startsWith("/payment")
            ) {
                // currentFormData ve currentApplicationNo'yu temizle
                sessionStorage.removeItem("currentFormData");
                sessionStorage.removeItem("currentApplicationNo");

                // Console'da bilgi ver (development için)
                if (process.env.NODE_ENV === "development") {
                }
            }
        }
    }, [pathname]);

    return (
        <FormProvider>
            <main
                className={
                    darkMode
                        ? "dark bg-gray-900 text-white min-h-screen flex flex-col"
                        : "bg-white text-black min-h-screen flex flex-col"
                }
            >
                {/* Navbar */}
                <Header
                    setDarkMode={setDarkMode}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    darkMode={darkMode}
                />

                {children}
                {/* Footer */}
                <footer
                    className="bg-gray-100 dark:bg-gray-900 text-center text-sm text-gray-500 dark:text-gray-400 py-6 mt-auto">
                    <div className="flex flex-row items-center justify-center mb-4 space-x-8">
                        <FooterLogo width={171} height={70}/>
                        <Image
                            src="/gsignip.png"
                            alt="G Sign IP"
                            width="512"
                            height="512"
                        />
                    </div>
                    © {new Date().getFullYear()} Türksat Bilişim | All rights reserved.
                </footer>
            </main>
        </FormProvider>
    );
};

export default LayoutContent;
