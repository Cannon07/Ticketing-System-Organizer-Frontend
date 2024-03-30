import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Loader from "./Loader";

interface issuerInterface {
  name: string,
  did: string,
}

interface selectedIssuersI {
  name: string,
  did: string,
}

interface ArtistDetails {
  issuerData: issuerInterface[];
  selectedIssuers: selectedIssuersI[];
  setSelectedIssuers: React.Dispatch<React.SetStateAction<selectedIssuersI[]>>;
}




export const SelectIssuersDropdown: React.FC<ArtistDetails> = ({ issuerData, selectedIssuers, setSelectedIssuers }) => {

  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false);

  return (
    <div className={"w-full relative"}>
      <div className="form-label">
        Trusted Issuers
      </div>
      <div className={`flex gap-2 flex-wrap dark:border-gray-600 border-gray-300 border-2 rounded border-dashed min-h-[57px] p-1 mb-4`}>
        {selectedIssuers.length > 0 ?
          selectedIssuers?.map((issuer, index) => (
            <div
              key={index}
              className="btn btn-outline-primary px-4 py-2 flex gap-4 items-center justify-center"
              onClick={() => {
                const newIssuers = selectedIssuers?.filter((filterIssuer) => (filterIssuer.did !== issuer.did))
                setSelectedIssuers(newIssuers)
              }}
            >
              {issuer.name}
              <IoClose size={20}/>
            </div>
          ))
          :
          <p className='w-full flex justify-center items-center'>No Issuers Selected</p>
        }
      </div>
      <div
        className="w-full form-input px-8 py-4 flex items-center justify-between rounded"
        onClick={() => setOpen(!open)}
      >
        Select the Issuers
        <FaAngleDown className={`${open && "rotate-180"}`}/>
      </div>
      <ul className={`absolute w-full mt-2 p-0 form-input overflow-y-auto ${open ? "max-h-60" : "hidden"} z-10`}>
        <div className="sticky top-0">
          <input
            type="text"
            placeholder="Enter issuer name"
            className="w-full form-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
          />
        </div>
        {issuerData.length < 1 ?<div className="text-center p-4"> <Loader/> </div>: issuerData.map((issuer, index) => (
          <li
            key={index}
            className={`p-2 mx-4 mb-1 cursor-pointer ${selectedIssuers?.some(selectedIssuer => selectedIssuer.did === issuer.did) && "bg-gray-200 dark:bg-gray-700"} hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${issuer.name?.toLowerCase().startsWith(inputValue) ? "block" : "hidden"}`}
            onClick={() => {

              let issuerData = {
                did: issuer.did,
                name: issuer.name,
              }

              if (!selectedIssuers?.some(selectedIssuer => selectedIssuer.did === issuer.did)) setSelectedIssuers([...selectedIssuers, issuerData])
              setInputValue("")
            }}
          >{issuer.name}</li>
        ))}
      </ul>
    </div>
  );
}
