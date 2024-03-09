"use client"

import React, { useEffect, useState, useRef } from 'react';
import { generateHash } from '@/lib/utils/hashGenerator';
import { useContract, useTx } from 'useink';
import { CONTRACT_ADDRESS } from '@/constants/contract_constants/ContractAddress';
import metadata from '@/constants/contract_constants/assets/TicketingSystem.json';
import { useTxNotifications } from 'useink/notifications';
import toast from 'react-hot-toast';
import { PostImage } from '@/constants/endpoints/ImageEndpoints';
import { UpdateOrganizerById } from '@/constants/endpoints/OrganizerEndpoints';

interface OrganizerDataProps {
    id: string,
    name: string,
    email: string,
    govId: string,
    walletId: string,
    transactionId: string,
    organisedEvents: string[]
    profileImg: string,
  }


interface organizerDataI {
    id: string | undefined,
    name: string | undefined,
    email: string | undefined,
    govId: string | undefined,
    profileImg: string | undefined,
    transactionId: string | undefined,
    walletId: string | undefined,
    originalImage: string | undefined,
    setImage: React.Dispatch<React.SetStateAction<string | undefined>>,
    organizedEvents: string[] | undefined,
    setOrganizerData: React.Dispatch<React.SetStateAction<OrganizerDataProps | null>>

}

const OrganizerProfileSettings: React.FC<organizerDataI> = ({ id, name, email, profileImg, govId, transactionId, walletId, originalImage, setImage, organizedEvents,setOrganizerData }) => {

    const contract = useContract(CONTRACT_ADDRESS, metadata);
   
    const updateOrganizer = useTx(contract, 'updateOrganizer');
    useTxNotifications(updateOrganizer);



    useEffect(() => {
        if (updateOrganizer.status === 'Finalized') {
            toast.dismiss()
            toast.success('Transaction finalized!')
            setIsEditing(false);
        }
        else if (updateOrganizer.status === 'PendingSignature') {
            toast.dismiss()
            toast.loading('Pending signature..')
        }
        else if (updateOrganizer.status === 'Broadcast') {
            toast.dismiss()
            toast.loading('Broadcasting transaction..')
        }
        else if (updateOrganizer.status === 'InBlock') {
            toast.dismiss()
            toast.loading('Transaction In Block..')
        }
        else {
            toast.dismiss();
        }
    }
        , [updateOrganizer.status])


    const [isEditing, setIsEditing] = useState(false);
    const [orgName, setOrgName] = useState(name);
    const [orgEmail, setOrgEmail] = useState(email);
    const [identity, setIdentity] = useState<string | undefined>(govId);
    const [profilePic, setProfilePic] = useState(null);
    const [transId, setTransId] = useState(transactionId);
    const [loading, setLoading] = useState(false);

    const [file, setFile] = useState<File | undefined>();
    const imageRef = useRef<HTMLInputElement>(null);

    const [originalName, setOriginalName] = useState(name);
    const [originalEmail, setOriginalEmail] = useState(email);
    const [originalIdentity, setOriginalIdentity] = useState<string | undefined>(govId);
    const [originalProfilePic, setOriginalProfilePic] = useState(null);



    const updateStatus = () => {
        if(updateOrganizer.status === 'Finalized'){
          let txId = "";
          updateOrganizer.result?.contractEvents?.map((value) => {
            txId = Object.values(value.args[1]).slice(0, 64).join("")
          });
          toast.dismiss()
          if (txId === "") {
            toast.error("Something went wrong!")
          } else {
            toast.success('Transaction finalized!')
            let register_toast = toast.loading('Updating Organizer..')
            uploadImage(txId);
            toast.dismiss(register_toast);
          }
        }
        else if(updateOrganizer.status === 'PendingSignature'){
          toast.dismiss()
          toast.loading('Pending signature..')
        }
        else if(updateOrganizer.status === 'Broadcast'){
          toast.dismiss()
          toast.loading('Broadcasting transaction..')
        }
        else if(updateOrganizer.status === 'InBlock'){
          toast.dismiss()
          toast.loading('Transaction In Block..')
        }
        else{
          toast.dismiss()
        }
      }

      useEffect(() => {
        updateStatus();
      }, [updateOrganizer.status])

      const uploadImage = async (txId: string) => {
          if (typeof(file) === 'undefined') {
            putOrganizer(txId, originalImage)
            return;
          }

          var formdata = new FormData();
          formdata.append("file", file);

          var requestOptions = {
            method: 'POST',
            body: formdata,
          };

          let response = await fetch(`${PostImage}`, requestOptions);
          let result = await response.text();
          console.log(result);
          putOrganizer(txId, result);
      }

      const putOrganizer = async (txId: string, imageUrl: string | undefined) => {
        toast.loading('Updating organizer..')
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "name": orgName,
          "email": orgEmail,
          "govId": identity,
          "walletId": walletId,
          "transactionId": txId,
          "profileImg": imageUrl,
        });

        console.log(raw);

        var requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: raw,
        };

        let response = await fetch(`${UpdateOrganizerById}${id}`, requestOptions)
        if (response.ok) {
          let result = await response.json();
          setTransId(txId);
          console.log(result)
          toast.dismiss()
          toast.success("Organizer Updated!")
          setLoading(false)
          const orgData = {
                id: id ? id.toString() : "",
                name: orgName ? orgName.toString() : "",
                email: orgEmail ? orgEmail.toString() : "",
                govId: identity ? identity.toString() : "",
                walletId: walletId ? walletId.toString() : "",
                transactionId: txId ? txId.toString() : "",
                organisedEvents:  Array.isArray(organizedEvents) ? organizedEvents : (organizedEvents ? [organizedEvents] : []),
                profileImg: imageUrl ? imageUrl.toString() : "",
            };

          setOrganizerData(orgData);

        }
    }

    const handleEditClick = () => {
        setIsEditing(true);
        setOriginalName(name);
        setOriginalEmail(email);
        setOriginalIdentity(govId)
        setOriginalProfilePic(profilePic);
    };

    const handleSaveChanges = (e: any) => {
        e.preventDefault();
        if (orgName === "") toast.error("Name cannot be empty!");
        else if (orgEmail === "") toast.error("Email cannot be empty!");
        else if (identity==="") toast.error("Adhar number cannot be empty!");
        else if(identity && identity.length<12) toast.error("Adhar number must be of 12 digits")
        else {
            const hashData = generateHash([orgName, orgEmail, identity, profilePic]);
            updateOrganizer.signAndSend([hashData]);
        }
    };

    const handleCancelEdit = () => {
        setOrgName(originalName);
        setOrgEmail(originalEmail);
        setIdentity(originalIdentity)
        setProfilePic(originalProfilePic);
        setProfilePic(null);
        setFile(undefined);
        setIsEditing(false);


    };

    return (
        <div className="h-full w-full pl-3">
            <div className="bg-theme-light dark:bg-darkmode-theme-light overflow-hidden shadow rounded-lg h-full w-full flex items-center justify-center">
                <div className="p-8 rounded shadow-md w-full">
                    <h1 className="text-2xl font-semibold mb-4 text-center">Profile Settings</h1>
                    <div>
                        {!isEditing &&

                            <div className="py-4">
                                <hr className="h-px w-full dark:bg-gray-600 border-0 bg-gray-200" />
                            </div>}

                        <div className={`mb-4 ${isEditing ? '' : 'flex justify-between'}`}>
                            <label htmlFor="name" className="form-label-profile">
                                Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    className="form-input-profile"
                                />
                            ) : (
                                <div>{orgName}</div>
                            )}
                        </div>


                        <div className={`mb-4 ${isEditing ? '' : 'flex justify-between'}`}>
                            <label htmlFor="email" className="form-label-profile">
                                Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={orgEmail}
                                    onChange={(e) => setOrgEmail(e.target.value)}
                                    className="form-input-profile"
                                />
                            ) : (
                                <div>{orgEmail}</div>
                            )}
                        </div>

                        <div className={`mb-4 ${isEditing ? '' : 'flex justify-between'}`}>
                            <label htmlFor="email" className="form-label-profile">
                                Adhar Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    id="identity"
                                    name="identity"
                                    value={identity}
                                    onChange={(e) => setIdentity(e.target.value)}
                                    className="form-input-profile"
                                />
                            ) : (
                                <div>{identity}</div>
                            )}
                        </div>

                        {!isEditing &&
                            <>
                                <div className={`mb-4 flex justify-between`}>
                                    <label htmlFor="email" className="form-label-profile">
                                        Wallet Id
                                    </label>
                                    <div>{walletId}</div>
                                </div>

                                <div className={`mb-4 flex justify-between`}>
                                    <label htmlFor="email" className="form-label-profile">
                                        Transaction Id
                                    </label>
                                    <div>{loading ? 'Loading...' : transId}</div>
                                </div>
                            </>
                        }

                        {isEditing && <div className={"flex gap-6 flex-col md:flex-row w-full"}>
                            <div className="w-full">
                                <label
                                    className="form-label-profile block"
                                    htmlFor="file_input"
                                >
                                    Profile Image
                                </label>
                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={() => {
                                            document.getElementById("image-input-profile")?.click()
                                        }}
                                        className="btn btn-sm btn-outline-primary h-fit mt-1">
                                        Upload
                                    </button>
                                    <input
                                        id="uplaoded-file"
                                        name="uploaded-file"
                                        className="form-input-disable form-input-profile w-full"
                                        value={`${file ? file.name : "No file chosen"}`}
                                        disabled
                                    />
                                </div>
                                <input
                                    id="image-input-profile"
                                    ref={imageRef}
                                    type="file"
                                    className="hidden"
                                    onChange={({ target: { files } }) => {
                                        if (files && files.length > 0) {
                                            setImage(URL.createObjectURL(files[0]));
                                            setFile(files[0]);
                                        }
                                    }}
                                />
                            </div>
                        </div>}
                    </div>




                    <div className="flex justify-start mt-6">

                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSaveChanges}
                                    className="mr-2 btn-sm btn-primary"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="btn-sm btn-primary"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEditClick}
                                className="btn-sm btn-primary"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerProfileSettings;


