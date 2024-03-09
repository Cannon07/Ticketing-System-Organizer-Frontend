"use client"

import Accordion from "@/shortcodes/Accordion"
import { useEffect, useState } from "react";
import ImageFallback from "@/helpers/ImageFallback";
import OrganizerProfileSettings from "@/components/OrganizerProfileSettings";
import HostedEventsCard from "@/components/HostedEventsCard";
import PastHostingsCard from "@/components/PastHostingsCard";
import { useGlobalContext } from "@/app/context/globalContext";
import { GetOrganizerEvents } from "@/constants/endpoints/OrganizerEndpoints";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

interface venueI {
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

    const { organizerData,setOrganizerData } = useGlobalContext();
    const router = useRouter();
    const [tab, setTab] = useState('Hosted Events')
    const [image, setImage] = useState(organizerData?.profileImg);
    const [eventsData, setEventsData] = useState<eventsDataI[]>([])
    const currentDateAndTime = new Date();

    const [upcomingEvents, setUpcomingEvents] = useState<eventsDataI[]>([]);
    const [pastEvents, setPastEvents] = useState<eventsDataI[]>([]);


    const filterEvents = (events: eventsDataI[]) => {

        const upcoming: eventsDataI[] = [];
        const past: eventsDataI[] = [];

        events.forEach(event => {
            const eventDateAndTime = new Date(event.dateAndTime);

            if (eventDateAndTime > currentDateAndTime) {
                upcoming.push(event);
            } else {
                past.push(event);
            }
        });


        past.sort((a, b) => new Date(b.dateAndTime).getTime() - new Date(a.dateAndTime).getTime());

        upcoming.sort((a, b) => new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime());

        setUpcomingEvents(upcoming);
        setPastEvents(past);
    };


    useEffect(() => {
        filterEvents(eventsData);
    }, [eventsData]);



    const getEventsByOrganzer = async () => {

        toast.loading("Fetching organizer's events..",{id:"EventsFetchingLoading"} )

        var requestOptions = {
            method: 'GET',
        };

        let response = await fetch(`${GetOrganizerEvents}${organizerData?.id}`, requestOptions)
        let result = await response.json()
        console.log(result)

        if (response.ok) {
            setEventsData(result);

            toast.dismiss();
            toast.success("Events Fetched Successfully!", {id:"EventsFetchingSuccess"});
            if(result.length<1){
                toast.dismiss()
                toast.error("No Events Found!", {id:"NoEventsFound"})
            }
        }
        else {
            toast.dismiss();
            toast.error("Error Fetching Events!", {id:"EventsFetchingFailure"})
        }

    }

    useEffect(() => {
        setTab('Hosted Events');
        setImage(organizerData?.profileImg)
        getEventsByOrganzer();
    }, [organizerData?.walletId])

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

                            <aside className="w-full pr-3 relative">
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

                                    <div className="flex justify-center items-center h-full flex-wrap">


                                        {upcomingEvents.length != 0 ?

                                            <HostedEventsCard eventsData={upcomingEvents} />

                                            :
                                            <div className={"p-8 flex flex-col items-center"}>
                                                <h1 className="h2 text-center">No Events Found</h1>
                                                <div className="content flex flex-col items-center">
                                                    <p className="mb-0 text-center">
                                                        Oops! It seems you haven&apos;t created any events yet.
                                                    </p>
                                                    <p className="mt-0 text-center">
                                                        Visit our create event page and create your events now.
                                                    </p>
                                                </div>
                                                <button
                                                    className="btn-sm btn-primary"
                                                    onClick={() => { router.push('/create-event') }}
                                                >
                                                    Explore Now
                                                </button>
                                            </div>
                                        }

                                    </div>

                                ) : (
                                    tab === 'Past Hostings' ? (
                                        <div className="flex justify-center items-center h-full flex-wrap">

                                            {pastEvents.length != 0 ?
                                                <PastHostingsCard eventsData={pastEvents} />
                                                :
                                                <div className={"p-8 flex flex-col items-center"}>
                                                    <h1 className="h2 text-center">No Events Found</h1>
                                                    <div className="content flex flex-col items-center">
                                                        <p className="mb-0 text-center">
                                                            It looks like you haven&apos;t created any events in the past.
                                                        </p>
                                                        <p className="mt-0 text-center">
                                                            Visit our create event page and create your events now.
                                                        </p>
                                                    </div>
                                                    <button
                                                        className="btn-sm btn-primary"
                                                        onClick={() => { router.push('/create-event') }}
                                                    >
                                                        Explore Now
                                                    </button>
                                                </div>
                                            }
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
                                                    organizedEvents = {organizerData?.organisedEvents}
                                                    setOrganizerData = {setOrganizerData}
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

        </div >
    )
}

export default OrganizerProfile;