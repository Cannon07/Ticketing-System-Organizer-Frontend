"use client"

import Accordion from "@/shortcodes/Accordion"
import { useEffect, useState } from "react";
import ImageFallback from "@/helpers/ImageFallback";
import OrganizerProfileSettings from "@/components/OrganizerProfileSettings";
import HostedEventsCard from "@/components/HostedEventsCard";
import PastHostingsCard from "@/components/PastHostingsCard";
import { useGlobalContext } from "@/app/context/globalContext";
import { GetOrganizerEvents } from "@/constants/endpoints/OrganizerEndpoints";

interface artistI {
    id: string,
    name: string,
    userName: string,
    email: string,
    govId: string,
    profileImg: string,
}

interface tiersI {
    id: string,
    name: string,
    capacity: number,
    price: number,
}

interface venueI{
    id: string,
    name: string,
    address: string,
    capacity: number,
    placeId: string,
}



interface eventsDataI {
    id: string,
    name: string,
    dateAndTime: string,
    description: string,
    eventDuration: string,
    imageUrls: string[],
    categoryList: string[],
    venueId: venueI,
    artists: artistI[],
    tiers: tiersI[],
    transactionId: string,
}


const OrganizerProfile = () => {

    const { organizerData } = useGlobalContext();
    const [tab, setTab] = useState('Hosted Events')
    const [image, setImage] = useState(organizerData?.profileImg);
    const [eventsData, setEventsData] = useState<eventsDataI[]>([])

    
    const getEventsByOrganzer = async () => {

        var requestOptions = {
            method: 'GET',
        };

        let response = await fetch(`${GetOrganizerEvents}${organizerData?.id}`, requestOptions)
        let result = await response.json()
        console.log(result)

        if (response.ok) {
            setEventsData(result);
        }
        else {
            console.log("error fetching events")
        }

    }



    useEffect(() => {
        setTab('Hosted Events');
        setImage(organizerData?.profileImg)
        getEventsByOrganzer();
    }, [organizerData])
 
    return (
        <div className="section-sm">
            <div className="container">
                <div className="row">
                    <div className="grid grid-cols-3">
                        <div className="lg:hidden flex col-span-3">
                            <Accordion title={tab} className="w-full">
                                <aside className="w-full px-3 relative">
                                    <div className="lg:sticky lg:top-28 h-fit w-full px-3 py-4 overflow-y-auto bg-theme-light dark:bg-darkmode-theme-light rounded-lg  lg:border lg:border-border lg:dark:border-darkmode-border">
                                        <ul className="space-y-2 font-medium">

                                            <li>
                                                <div className="flex flex-col items-center p-2 gap-2 text-gray-900 rounded-lg dark:text-white">

                                                    <div className="w-44 h-44 overflow-hidden rounded-full">

                                                        <ImageFallback
                                                            height={100}
                                                            width={100}
                                                            src={image}
                                                            alt="Profile image"
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>

                                                    <span >{organizerData?.name}</span>

                                                </div>
                                            </li>



                                            <div className="py-4">
                                                <hr className="h-px w-full dark:bg-gray-600 border-0 bg-gray-200" />
                                            </div>


                                            <li>
                                                <button onClick={() => setTab('Hosted Events')} className={`w-full flex items-center justify-between px-6 py-2 text-gray-900 rounded-lg dark:text-white ${tab === 'Hosted Events' ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-200 dark:hover:bg-gray-700 group`}>

                                                    <span className="">Hosted Events</span>
                                                    <span className="inline-flex items-center justify-center text-sm font-medium text-gray-800 rounded-full dark:text-gray-300">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </li>

                                            <li>
                                                <button onClick={() => setTab('Past Hostings')} className={`w-full flex items-center justify-between px-6 py-2 text-gray-900 rounded-lg dark:text-white ${tab === 'Past Hostings' ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-200 dark:hover:bg-gray-700 group`}>

                                                    <span className="">Past Hostings</span>
                                                    <span className="inline-flex items-center justify-center text-sm font-medium text-gray-800 rounded-full dark:text-gray-300">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </li>


                                            <li>
                                                <button onClick={() => setTab('Profile Settings')} className={`w-full flex items-center justify-between px-6 py-2 text-gray-900 rounded-lg dark:text-white ${tab === 'Profile Settings' ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-200 dark:hover:bg-gray-700 group`}>

                                                    <span className="">Profile Settings</span>
                                                    <span className="inline-flex items-center justify-center text-sm font-medium text-gray-800 rounded-full dark:text-gray-300">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </li>



                                        </ul>
                                    </div>
                                </aside>

                            </Accordion>
                        </div>
                        <div className="hidden lg:contents">

                            <aside className="w-full px-3 relative">
                                <div className="lg:sticky lg:top-28 h-fit w-full px-3 py-4 overflow-y-auto bg-theme-light dark:bg-darkmode-theme-light rounded-lg  lg:border lg:border-border lg:dark:border-darkmode-border">
                                    <ul className="space-y-2 font-medium">

                                        <li>
                                            <div className="flex flex-col items-center p-2 gap-2 text-gray-900 rounded-lg dark:text-white">

                                                <div className="w-44 h-44 overflow-hidden rounded-full">
                                                    <ImageFallback
                                                        height={100}
                                                        width={100}
                                                        src={image}
                                                        alt="Profile image"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>

                                                <span >{organizerData?.name}</span>

                                            </div>
                                        </li>



                                        <div className="py-4">
                                            <hr className="h-px w-full dark:bg-gray-600 border-0 bg-gray-200" />
                                        </div>


                                        <li>
                                            <button onClick={() => setTab('Hosted Events')} className={`w-full flex items-center justify-between px-6 py-2 text-gray-900 rounded-lg dark:text-white ${tab === 'Hosted Events' ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-200 dark:hover:bg-gray-700 group`}>

                                                <span className="">Hosted Events</span>
                                                <span className="inline-flex items-center justify-center text-sm font-medium text-gray-800 rounded-full dark:text-gray-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </span>
                                            </button>
                                        </li>

                                        <li>
                                            <button onClick={() => setTab('Past Hostings')} className={`w-full flex items-center justify-between px-6 py-2 text-gray-900 rounded-lg dark:text-white ${tab === 'Past Hostings' ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-200 dark:hover:bg-gray-700 group`}>

                                                <span className="">Past Hostings</span>
                                                <span className="inline-flex items-center justify-center text-sm font-medium text-gray-800 rounded-full dark:text-gray-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </span>
                                            </button>
                                        </li>


                                        <li>
                                            <button onClick={() => setTab('Profile Settings')} className={`w-full flex items-center justify-between px-6 py-2 text-gray-900 rounded-lg dark:text-white ${tab === 'Profile Settings' ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-200 dark:hover:bg-gray-700 group`}>

                                                <span className="">Profile Settings</span>
                                                <span className="inline-flex items-center justify-center text-sm font-medium text-gray-800 rounded-full dark:text-gray-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </span>
                                            </button>
                                        </li>



                                    </ul>
                                </div>
                            </aside>


                        </div>

                        <div className="col-span-3 lg:col-span-2 ">



                            {
                                tab === 'Hosted Events' ? (

                                    <div className="flex justify-center items-center flex-wrap">
                                        <HostedEventsCard eventsData={eventsData} />
                                    </div>

                                ) : (
                                    tab === 'Past Hostings' ? (
                                        <div className="flex justify-center items-center flex-wrap">
                                            <PastHostingsCard />
                                            <PastHostingsCard />
                                            <PastHostingsCard />
                                            <PastHostingsCard />
                                            <PastHostingsCard />
                                            <PastHostingsCard />
                                        </div>


                                    ) : (

                                        tab === 'Profile Settings' ? (
                                            <div className="flex justify-center items-center flex-wrap">

                                                <OrganizerProfileSettings
                                                    id={organizerData?.id}
                                                    name={organizerData?.name}
                                                    email={organizerData?.email}
                                                    govId={organizerData?.govId}
                                                    profileImg={organizerData?.profileImg}
                                                    transactionId={organizerData?.transactionId}
                                                    walletId={organizerData?.walletId}
                                                    originalImage={image}
                                                    setImage={setImage}
                                                />

                                            </div>

                                        ) : ''
                                    )

                                )
                            }

                        </div>
                        <div></div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default OrganizerProfile;