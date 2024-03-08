"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useGlobalContext } from '@/app/context/globalContext';
import { useContract, useTx, useWallet } from 'useink';
import { useTxNotifications } from 'useink/notifications';
import { CONTRACT_ADDRESS } from '@/constants/contract_constants/ContractAddress';
import metadata from '@/constants/contract_constants/assets/TicketingSystem.json';
import { generateHash } from '@/lib/utils/hashGenerator';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PostOrganizer } from '@/constants/endpoints/OrganizerEndpoints';
import { PostImage } from '@/constants/endpoints/ImageEndpoints';




interface OrganizerDataI {
    id: string,
    name: string,
    email: string,
    govId: string,
    walletId: string,
    transactionId: string,
    organisedEvents: string[]
    profileImg: string,
  }
  






const OrganizerRegistrationForm = () => {




    // const [aadharError, setAadharError] = useState(false);
    
    const { setConnectLoading, setOrganizerData } = useGlobalContext();
    const { account ,disconnect } = useWallet();
    const router = useRouter()


    const contract = useContract(CONTRACT_ADDRESS, metadata);

    const registerOrganizer = useTx(contract, 'registerOrganizer');
    useTxNotifications(registerOrganizer);

    
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [aadharNumber, setAadharNumber] = useState<string>('');
    const [file, setFile] = useState<File | undefined>();
    const imageRef = useRef<HTMLInputElement>(null);


  


    useEffect(() => {
        if (registerOrganizer.status === 'Finalized') {
            let txId = "";
            registerOrganizer.result?.contractEvents?.map((value) => {
                txId = Object.values(value.args[1]).slice(0, 64).join("")
            });
            toast.dismiss()
           
            if (txId === "") {
                toast.error("Something went wrong!")
                setFullName("");
                setEmail("");
                setAadharNumber("");
                setFile(undefined);
                disconnect();
            } else {
                toast.success('Transaction finalized!')
                let register_toast = toast.loading('Registering Organizer..')
                uploadImage(txId);
                toast.dismiss(register_toast);
            }
            setConnectLoading(false)
            
        }
        else if (registerOrganizer.status === 'PendingSignature') {
            toast.dismiss()
            toast.loading('Pending signature..')
        }
        else if (registerOrganizer.status === 'Broadcast') {
            toast.dismiss()
            toast.loading('Broadcasting transaction..')
        }
        else if (registerOrganizer.status === 'InBlock') {
            toast.dismiss()
            toast.loading('Transaction In Block..')
        }
        else {
            toast.dismiss();
        }
    }
        , [registerOrganizer.status])




    const saveOrganizer = async (txId: string, imageUrl: string) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        var raw = JSON.stringify({
          "name": fullName,
          "email": email,
          "govId": aadharNumber,
          "walletId": account?.address,
          "transactionId": txId,
          "profileImg": imageUrl,
        });
  
        console.log(raw);
  
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
        };
  
        let response = await fetch(`${PostOrganizer}`, requestOptions)
        if (response.ok) {
          let result = await response.json();
          console.log(result)
          toast.success("User Registered!")
          setFullName("");
          setEmail("");
          setAadharNumber("");
          setFile(undefined);

          const orgData:OrganizerDataI = {
                id: "123",
                name: fullName,
                email: email,
                govId: aadharNumber,
                walletId: account?.address || '',
                transactionId: txId,
                organisedEvents: [],
                profileImg: imageUrl,
          }

          setOrganizerData(orgData);
          router.push('/')
          
        }
        else{
            toast.dismiss()
            toast.error('Failed to Register Organizer')
        }
    }
  
    const uploadImage = async (txId: string) => {
      if (typeof(file) === 'undefined') return;
  
      var formdata = new FormData();
      formdata.append("file", file);
  
      var requestOptions = {
        method: 'POST',
        body: formdata,
      };
  
      let response = await fetch(`${PostImage}`, requestOptions);
      let result = await response.text()
      saveOrganizer(txId, result)
    }





    const handleCancelClick = (e: any) => {
        e.preventDefault();
    }



    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        if (fullName === "") {
            toast.error("Please enter Full Name");
        }
        else if (email === ""){ 
            toast.error("Please enter Email");
        }
        else if(aadharNumber === ""){
             toast.error("Please enter your Adhar Number")
        }
        else if (typeof(file) === 'undefined'){
             toast.error("Please upload Profile Image");
        }
        else {
          const hashData = generateHash([account?.address,fullName,email,aadharNumber,file])
          registerOrganizer.signAndSend([hashData]);
            
        }
    }



    const handleAadharChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        event.target.value = event.target.value.replace(/\D/g, '');
        if (event.target.value.length > 12) {
            event.target.value = event.target.value.slice(0, 12);
        }
        const inputAadhar = event.target.value

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
                        value={account?.address}
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
                        onChange={(e) => setFullName(e.target.value)}
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
                        onChange={(e) => setEmail(e.target.value)}
                        required
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

                <div className={"mb-4 flex gap-6 flex-col md:flex-row w-full col-span-2"}>
                    <div className="w-full">
                        <label
                            className="form-label block"
                            htmlFor="file_input"
                        >
                            Profile Image
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById("image-org")?.click()
                                }}
                                className="btn btn-outline-primary">
                                Upload
                            </button>
                            <input
                                id="uplaoded-file"
                                name="uploaded-file"
                                className="form-input-disable w-full"
                                value={`${file ? file.name : "No file chosen"}`}
                                disabled
                            />
                        </div>
                        <input
                            id="image-org"
                            ref={imageRef}
                            type="file"
                            className="hidden"
                            onChange={({ target: { files } }) => {
                                if (files && files.length > 0) setFile(files[0]);
                            }}
                        />
                    </div>
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
