import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

interface VerificatoinModeDetails {
  verificationMode: string[];
  selectedVerificationMode: string;
  setSelectedVerificationMode: React.Dispatch<React.SetStateAction<string>>;
}

export const SelectVerificationModeDropdown: React.FC<VerificatoinModeDetails> = ({ verificationMode, selectedVerificationMode, setSelectedVerificationMode }) => {


  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false);

  return (
    <div className={"w-full relative"}>
      <div className="form-label">
        Verification Mode
      </div>
      <div
        className="w-full form-input px-8 py-4 flex items-center justify-between rounded"
        onClick={() => setOpen(!open)}
      >
        {selectedVerificationMode === "" ? "Select the Verification Mode" : selectedVerificationMode}
        <FaAngleDown className={`${open && "rotate-180"}`}/>
      </div>
      <ul className={`absolute z-10 w-full mt-2 p-0 form-input overflow-y-auto ${open ? "max-h-60" : "hidden"}`}>
        <div className="sticky top-0">
          <input
            type="text"
            placeholder="Enter verification mode"
            className="w-full form-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
          />
        </div>
        {verificationMode?.map((mode: string, index: number) => (
          <li
            key={index}
            className={`p-2 mx-4 mb-1 cursor-pointer ${mode === selectedVerificationMode && "bg-gray-200 dark:bg-gray-700"} hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${mode?.toLowerCase().startsWith(inputValue) ? "block" : "hidden"}`}
            onClick={() => {
              setSelectedVerificationMode(mode);
              setInputValue("");
              setOpen(false);
            }}
          >{mode}</li>
        ))}
      </ul>
    </div>
  );
}
