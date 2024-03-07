"use client"

import OrganizerRegistrationForm from "@/components/OrganizerRegistrationForm";
import OrganizerPageHeader from "@/partials/OrganizerPageHeader";
import NotConnected from "../not-connected";
import { useWallet } from "useink";




const OrganizerRegistration = () => {

   const {account} = useWallet();

    return (
        <>{account?
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
