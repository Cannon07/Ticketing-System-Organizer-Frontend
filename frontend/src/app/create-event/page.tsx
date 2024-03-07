"use client"

import CreateEventForm from "@/components/CreateEventForm";
import OrganizerPageHeader from "@/partials/OrganizerPageHeader";
import { useGlobalContext } from "../context/globalContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NotRegistered from "../not-registered";




const CreateEvent = () => {
    
    const {organizerData } = useGlobalContext()
    



    return (
        <>  
            {organizerData? <div>
            <OrganizerPageHeader title={"Create Event"} />
            <section className="section-sm">
                <div className="container">
                    <div className="row px-4">
                            <CreateEventForm />
                    </div>
                </div>
            </section> 
            </div>:<NotRegistered/>
            }
        </>
    );
};

export default CreateEvent;
