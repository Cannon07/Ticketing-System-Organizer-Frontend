"use client"

import OrganizerProfile from "@/layouts/profiles/OrganizerProfile";
import { useGlobalContext } from "../context/globalContext";
import NotRegistered from "../not-registered";


const OrganizerProfilePage = () => {
    const {organizerData} = useGlobalContext()
  

    return (
        <>
        {organizerData?
          <div>
                <OrganizerProfile/>
          </div>:<NotRegistered/>
        }
        </>
      
    )
}

export default OrganizerProfilePage;