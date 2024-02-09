"use client"

import React, { useState } from 'react'
import { useGlobalContext } from '@/app/context/globalContext';
import NotConnected from '@/app/not-connected';
import { useContract, useTx } from 'useink';
import { useTxNotifications } from 'useink/notifications';
import { CONTRACT_ADDRESS } from '@/constants/contract_constants/ContractAddress';
import metadata from  '@/constants/contract_constants/assets/TicketingSystem.json';
import { generateHash } from '@/lib/utils/hashGenerator';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';






const OrganizerRegistrationForm = () => {




    // const [aadharError, setAadharError] = useState(false);
    const router = useRouter()
    const { walletAddress, hasAccount } = useGlobalContext();



    
    const contract = useContract(CONTRACT_ADDRESS, metadata);

    const registerOrganizer = useTx(contract, 'registerOrganizer');
    useTxNotifications(registerOrganizer);


    const [fullName,setFullName] = useState<string>('');
    const [username,setUsername] = useState<string>('')
    const [email,setEmail] = useState<string>('');
    const [organizationName,setOrganizationName] = useState<string>('');
    const [aadharNumber,setAadharNumber] = useState<string>('');


    
    if (!hasAccount) return <NotConnected />






    const dataHash = generateHash([walletAddress,fullName,username,email,organizationName,aadharNumber]);


    const handleCancelClick=(e:any)=>{
        e.preventDefault();
      
    }

    

    const handleSubmit=async(e:any)=>{
        e.preventDefault();
        registerOrganizer.signAndSend([dataHash]);
        router.push('/organizer-profile');
    }



    const handleAadharChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        event.target.value=event.target.value.replace(/\D/g, '');
        if(event.target.value.length>12){
            event.target.value=event.target.value.slice(0,12);
        }
        const inputAadhar=event.target.value

        setAadharNumber(inputAadhar);


    };
 
    return (

        <div className="mx-auto border dark:border-gray-600 border-gray-300 rounded-lg">
            <form className="lg:grid md:grid lg:grid-cols-2 md:grid-cols-2 gap-6 p-4 py-8" method="POST">
                <div className="mb-4">
                    <label htmlFor="type" className="form-label block">
                        Wallet Address
                    </label>
                    <input
                        disabled
                        id="address"
                        name="address"
                        className="form-input-disable"
                        value={walletAddress}
                        type="text"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="name" className="form-label block">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        className="form-input"
                        placeholder="Enter your full name.."
                        type="text"
                        value={fullName}
                        onChange={(e)=>setFullName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="uname" className="form-label block">
                        Username
                    </label>
                    <input
                        id="uname"
                        name="uname"
                        className="form-input"
                        placeholder="Enter your username.."
                        type="text"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="type" className="form-label block">
                        Email
                    </label>
                    <input
                        id="type"
                        name="type"
                        className="form-input w-full"
                        placeholder='Enter your email..'
                        type="text"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="organization" className="form-label block">
                        Organization Name (if any)
                    </label>
                    <input
                        id="organization"
                        name="organization"
                        className="form-input"
                        placeholder="Enter your organization name.."
                        type="text"
                        value={organizationName}
                        onChange={(e)=>setOrganizationName(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="aadhar" className="form-label block">
                        Aadhar Number
                    </label>
                    <input
                        id="aadhar"
                        name="aadhar"
                        className="form-input"
                        placeholder="Enter your Aadhar number.."
                        type="text"
                        value={aadharNumber}
                        onChange={handleAadharChange}
                        required
                    />
                </div>

                <div className="col-span-2 flex gap-4 pl-1">
                    <button onClick={handleSubmit} type="submit" className="btn btn-primary">
                        Submit
                    </button>
                    <button onClick={handleCancelClick} className="btn btn-primary">
                        Cancel
                    </button>
                </div>

            </form>
        </div>


    )

}

export default OrganizerRegistrationForm;
