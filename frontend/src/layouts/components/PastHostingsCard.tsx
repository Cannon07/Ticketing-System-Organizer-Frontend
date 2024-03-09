"use client"

import React from 'react'
import { GoHourglass } from 'react-icons/go';
import Loader from './Loader';
import EventContent from './EventContent';
import Image from 'next/image';



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

interface eventDataProps {
    eventsData: eventsDataI[],
}




const PastHostingsCard: React.FC<eventDataProps> = ({ eventsData }) => {


    const formatDateAndTime = (dateTimeString: string): { date: string, time: string } => {
        const dateTime = new Date(dateTimeString);

        const date = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;


        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const amOrPm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const time = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${amOrPm}`;
        return { date, time };
    };

    function formatDuration(timeString: string): string {
        const [hours, minutes] = timeString.split(':')

        const formattedHours = Number(hours) < 10 ? hours[1] : hours;
        if (minutes[0] == '0' && minutes[1] === '0') {
            return `${formattedHours} hrs`;
        }
        const formattedMinutes = Number(minutes) < 10 ? '0' + minutes[1] : minutes;



        return `${formattedHours}:${formattedMinutes} hrs`;
    }


    console.log("eventsData ",eventsData)


    return (

        <>
            {eventsData.map((eventData) => (


                <div key={eventData.id} className="pl-3 pb-3 flex items-center justify-center grayscale">                    
                    <div className="rounded bg-theme-light p-8 dark:bg-darkmode-theme-light relative  h-full w-auto">
                        
                        <div className={"flex flex-col items-center gap-4"}>


                            <div className=' max-w-full max-h-96 overflow-hidden object-cover rounded'>
                                <Image
                                    height={200}
                                    width={1200}
                                    src={eventData.imageUrls[1]}
                                    alt="event-image"

                                />
                            </div>


                            <div className='flex flex-col items-center justify-center'>

                                <div className='flex flex-col gap-3 justify-center'>
                                    <div>
                                        <p>{eventData.categoryList[0]}</p>
                                        <h4>{eventData.name}</h4>
                                        <p>
                                            <EventContent description={eventData.description} />
                                        </p>
                                    </div>

                                    <ul className='flex gap-4 flex-wrap'>
                                        <li className='flex gap-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                            </svg>
                                            <span>{formatDateAndTime(eventData.dateAndTime).date}</span>
                                        </li>
                                        <li className='flex gap-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            <span>{formatDateAndTime(eventData.dateAndTime).time}</span>
                                        </li>

                                        <li className='flex gap-1'>
                                            <GoHourglass size={24} />
                                            <span>{formatDuration(eventData.eventDuration)}</span>
                                        </li>
                                        <li className='flex gap-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>

                                            <span>
                                                {eventData.venueId.name + ', ' + eventData.venueId.address}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            ))}
        </>
    )

}

export default PastHostingsCard;