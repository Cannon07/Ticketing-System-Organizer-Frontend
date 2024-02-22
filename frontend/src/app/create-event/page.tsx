"use client"

import CreateEventForm from "@/components/CreateEventForm";
import OrganizerPageHeader from "@/partials/OrganizerPageHeader";
import { useGlobalContext } from "../context/globalContext";
import NotConnected from "../not-connected";
import { useRouter } from "next/navigation";



const CreateEvent = () => {
    
    const {organizerData, hasAccount} = useGlobalContext()
    
    const router = useRouter()

    
    // if (!hasAccount) return <NotConnected />


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
            </div>:router.push('/register-organizer')
            }
        </>
    );
};

export default CreateEvent;
