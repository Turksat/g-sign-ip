"use client"

import Image from "next/image";
import {motion} from "framer-motion";
import {section1} from "@/text/ContentTexts";

export default function LandingPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-8 py-20 gap-8">
                <motion.div
                    className="max-w-xl"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                >
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">G-SIGN-IP</h1>
                    <p className="mt-6 text-base text-gray-600 dark:text-gray-300">
                        NGI Sargasso is a European Commission-funded cascade funding program dedicated to fostering
                        innovation and strengthening collaboration between the European Union, the United States, and
                        Canada in the field of next-generation internet (NGI) technologies. The G-SIGN-IP (Global Smart
                        InterGovernment Network for Secure Data Exchange Piloting for Intellectual Property Service)
                        project, which has been accepted within the scope of this program, will create a blockchain and
                        artificial intelligence infrastructure to create a secure cross-border network for identity
                        verification, authorization and information sharing. The project is carried out by academic
                        institutions and private sector companies in accordance with mutual interaction and information
                        sharing.
                    </p>
                </motion.div>

                <motion.div
                    className="w-full max-w-2xl relative aspect-[3/2] overflow-hidden rounded-xl shadow-lg"
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.6}}
                >
                    <Image
                        src="/patent.jpg"
                        alt="Patent Application"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="px-8 py-20 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
                    {section1.map((feature, idx) => (
                        <div key={idx} className="p-6 rounded-lg bg-white dark:bg-gray-900 shadow-md">
                            <h3 className="text-lg font-semibold text-rose-500 dark:text-rose-400 mb-2">
                                {feature.title}
                            </h3>
                            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                {feature.text.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Disclaimer Section */}
            <section className="px-8 py-10 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Disclaimer</h2>
                    <p>
                        Funded by the European Union. Views and opinions expressed are however those of the author(s)
                        only and do not necessarily reflect those of the European Union or European Commission. Neither
                        the European Union nor the granting authority can be held responsible for them. Funded within
                        the framework of the NGI Sargasso project under grant agreement No 101092887.
                    </p>
                </div>
            </section>


            {/* Testimonials */}
            {/*<section className="px-8 py-20">*/}
            {/*    <div className="max-w-4xl mx-auto text-center">*/}
            {/*        <h2 className="text-2xl font-bold mb-6">What our users say</h2>*/}
            {/*        <div className="grid gap-6 md:grid-cols-2">*/}
            {/*            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">*/}
            {/*                <p className="text-gray-700 dark:text-gray-300">“This landing page template is amazing. Easy*/}
            {/*                    to use and looks professional!”</p>*/}
            {/*                <p className="mt-4 font-semibold text-rose-500 dark:text-rose-400">– Jane Doe</p>*/}
            {/*            </div>*/}
            {/*            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">*/}
            {/*                <p className="text-gray-700 dark:text-gray-300">“It helped me launch faster and attract more*/}
            {/*                    users. Highly recommended.”</p>*/}
            {/*                <p className="mt-4 font-semibold text-rose-500 dark:text-rose-400">– John Smith</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Video Promo Section */}
            {/*<section className="px-8 py-20 bg-white dark:bg-gray-900">*/}
            {/*    <div className="max-w-4xl mx-auto text-center">*/}
            {/*        <h2 className="text-2xl font-bold mb-6">Watch how it works</h2>*/}
            {/*        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">*/}
            {/*            <iframe width="100%" height="100%"*/}
            {/*                    src="https://www.youtube-nocookie.com/embed/Zq5fmkH0T78?si=WIphn483VWpmD7Ho"*/}
            {/*                    title="YouTube video player" frameBorder="0"*/}
            {/*                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"*/}
            {/*                    referrerPolicy="strict-origin-when-cross-origin"*/}
            {/*                    allowFullScreen></iframe>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Pricing Section */}
            {/*<section className="px-8 py-20 bg-gray-50 dark:bg-gray-800">*/}
            {/*    <div className="max-w-6xl mx-auto text-center">*/}
            {/*        <h2 className="text-2xl font-bold mb-6">Choose your plan</h2>*/}
            {/*        <div className="grid gap-8 md:grid-cols-3">*/}
            {/*            {[*/}
            {/*                {title: "Free", price: "$0", features: ["1 project", "Community support"]},*/}
            {/*                {title: "Pro", price: "$19", features: ["10 projects", "Priority support"]},*/}
            {/*                {title: "Enterprise", price: "$49", features: ["Unlimited projects", "Dedicated support"]}*/}
            {/*            ].map((plan, index) => (*/}
            {/*                <div key={index} className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">*/}
            {/*                    <h3 className="text-xl font-semibold mb-2 text-rose-500 dark:text-rose-400">{plan.title}</h3>*/}
            {/*                    <p className="text-3xl font-bold mb-4">{plan.price}</p>*/}
            {/*                    <ul className="mb-6 text-sm text-gray-600 dark:text-gray-300">*/}
            {/*                        {plan.features.map((f, i) => (*/}
            {/*                            <li key={i} className="mb-1">• {f}</li>*/}
            {/*                        ))}*/}
            {/*                    </ul>*/}
            {/*                    <button*/}
            {/*                        className="bg-rose-500 dark:bg-rose-400 text-white px-4 py-2 rounded-md hover:bg-rose-600 dark:hover:bg-rose-500 transition">*/}
            {/*                        Select*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
        </>
    );
}
