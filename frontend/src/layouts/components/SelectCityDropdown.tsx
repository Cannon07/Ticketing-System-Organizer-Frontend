import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import Loader from "./Loader";

interface cityInterface{
  id: string,
  city: string,
}

interface cityDetails {
  citiesData: cityInterface[];
  selectedCity: string;
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
}

export const SelectCityDropdown: React.FC<cityDetails> = ({ citiesData, selectedCity, setSelectedCity }) => {

  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false);

  return (
    <div className={"w-full relative"}>
      <div className="form-label">
        Event City
      </div>
      <div
        className="w-full form-input px-8 py-4 flex items-center justify-between rounded"
        onClick={() => setOpen(!open)}
      >
        {selectedCity === "" ? "Select the city" : selectedCity}
        <FaAngleDown className={`${open && "rotate-180"}`}/>
      </div>
      <ul className={`absolute z-10 w-full mt-2 p-0 form-input overflow-y-auto ${open ? "max-h-60" : "hidden"}`}>
        <div className="sticky top-0">
          <input
            type="text"
            placeholder="Enter city name"
            className="w-full form-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
          />
        </div>
        {citiesData.length < 1 ? <div className="text-center p-4"> <Loader/> </div>:citiesData.map((city, index) => (
          <li
            key={index}
            className={`p-2 mx-4 mb-1 cursor-pointer ${city.city === selectedCity && "bg-gray-200 dark:bg-gray-700"} hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${city.city?.toLowerCase().startsWith(inputValue) ? "block" : "hidden"}`}
            onClick={() => {
              setSelectedCity(city.city);
              setInputValue("");
              setOpen(false);
            }}
          >{city.city}</li>
        ))}
      </ul>
    </div>
  );
}
