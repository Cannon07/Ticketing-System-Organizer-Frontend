"use client"

import OrganizerRegistrationForm from "@/components/OrganizerRegistrationForm";
import OrganizerPageHeader from "@/partials/OrganizerPageHeader";
import { useGlobalContext } from "../context/globalContext";
import NotConnected from "../not-connected";
import { useEffect } from "react";




const OrganizerRegistration = () => {

    const {hasAccount,organizerData} = useGlobalContext()

    // useEffect(()=>{

    //     if(!hasAccount){
    //         return <NotConnected/>
    //     }
    // },[hasAccount])

    return (
        <>{hasAccount?
           <div>
            <OrganizerPageHeader title={"Organizer Registration"} />
            <section className="section-sm">
                <div className="container">
                    <div className="row px-4">
                            <OrganizerRegistrationForm />
                    </div>
                </div>
            </section>
            </div>:<NotConnected/>
            }
        </>
    );
};

export default OrganizerRegistration;
