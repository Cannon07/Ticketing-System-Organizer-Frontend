import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Loader from "./Loader";

interface issuerInterface {
  name: string,
  publicDid: string,
}

interface selectedIssuersI {
  name: string,
  publicDid: string,
}

interface IssuerDetails {
  issuerData: issuerInterface[];
  selectedIssuers: selectedIssuersI[];
  setSelectedIssuers: React.Dispatch<React.SetStateAction<selectedIssuersI[]>>;
  status: boolean;
}




export const SelectIssuersDropdown: React.FC<IssuerDetails> = ({ issuerData, selectedIssuers, setSelectedIssuers, status }) => {

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
                if (status) {
                  const newIssuers = selectedIssuers?.filter((filterIssuer) => (filterIssuer.publicDid !== issuer.publicDid))
                  setSelectedIssuers(newIssuers)
                }
              }}
            >
              {issuer.name}
              {status && <IoClose size={20}/>}
            </div>
          ))
          :
          <p className='w-full flex justify-center items-center'>No Issuers Selected</p>
        }
      </div>
      <div
        className="w-full form-input px-8 py-4 flex items-center justify-between rounded"
        onClick={() => {
          if (status) {
            setOpen(!open)
          } else {
            setOpen(false)
          }
        }}
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
            className={`p-2 mx-4 mb-1 cursor-pointer ${selectedIssuers?.some(selectedIssuer => selectedIssuer.publicDid === issuer.publicDid) && "bg-gray-200 dark:bg-gray-700"} hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${issuer.name?.toLowerCase().startsWith(inputValue) ? "block" : "hidden"}`}
            onClick={() => {

              let issuerData = {
                publicDid: issuer.publicDid,
                name: issuer.name,
              }

              if (!selectedIssuers?.some(selectedIssuer => selectedIssuer.publicDid === issuer.publicDid)) setSelectedIssuers([...selectedIssuers, issuerData])
              setInputValue("")
            }}
          >{issuer.name}</li>
        ))}
      </ul>
    </div>
  );
}
