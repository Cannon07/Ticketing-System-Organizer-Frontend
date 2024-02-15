import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import Loader from "./Loader";


interface venueInterface {

  address: string,
  capacity: number,
  id: string,
  name: string,
  placeId: string,

}

interface selectedVenueI {
  id: string,
  name: string,
}

interface VenueDetails {
  venueData: venueInterface[];
  selectedVenue: selectedVenueI | undefined;
  setSelectedVenue: React.Dispatch<React.SetStateAction<selectedVenueI | undefined>>;
}

export const SelectVenueDropdown: React.FC<VenueDetails> = ({ venueData, selectedVenue, setSelectedVenue }) => {

  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false);

  return (
    <div className={"w-full relative"}>
      <div className="form-label">
        Event Venue
      </div>
      <div
        className="w-full form-input px-8 py-4 flex items-center justify-between rounded"
        onClick={() => setOpen(!open)}
      >
        {selectedVenue === undefined ? "Select the Venue" : selectedVenue?.name}
        <FaAngleDown className={`${open && "rotate-180"}`} />
      </div>
      <ul className={`absolute z-10 w-full mt-2 p-0 form-input overflow-y-auto ${open ? "max-h-60" : "hidden"}`}>
        <div className="sticky top-0">
          <input
            type="text"
            placeholder="Enter venue name"
            className="w-full form-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
          />
        </div>
        {venueData.length < 1 ? <div className="text-center p-4"> <Loader /> </div> : venueData.map((venue, index) => (
          <li
            key={index}
            className={`p-2 mx-4 mb-1 cursor-pointer ${venue.id === selectedVenue?.id && "bg-gray-200 dark:bg-gray-700"} hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${venue.name?.toLowerCase().startsWith(inputValue) ? "block" : "hidden"}`}
            onClick={() => {
              let selectedVenueData = {
                id: venue.id,
                name: venue.name,
              }
              setSelectedVenue(selectedVenueData);
              setInputValue("");
              setOpen(false);
            }}
          >{venue.name}</li>
        ))}
      </ul>
    </div>
  );
}
