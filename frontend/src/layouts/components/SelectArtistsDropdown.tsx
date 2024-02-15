import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Loader from "./Loader";

interface artistInterface{
  id:string,
  name: string,
  userName: string,
  email: string,
  govId: string,
}

interface selectedArtistsI{
  id: string,
  name: string,
}

interface ArtistDetails {
  artistData: artistInterface[];
  selectedArtists: selectedArtistsI[];
  setSelectedArtists: React.Dispatch<React.SetStateAction<selectedArtistsI[]>>;
}




export const SelectArtistDropdown: React.FC<ArtistDetails> = ({ artistData, selectedArtists, setSelectedArtists }) => {

  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false);

  return (
    <div className={"w-full relative"}>
      <div className="form-label">
        Event Artists
      </div>
      <div className={`flex gap-2 flex-wrap dark:border-gray-600 border-gray-300 border-2 rounded border-dashed min-h-[57px] p-1 mb-4`}>
        {selectedArtists.length > 0 ?
          selectedArtists?.map((artist, index) => (
            <div
              key={index}
              className="btn btn-outline-primary px-4 py-2 flex gap-4 items-center justify-center"
              onClick={() => {
                const newArtists = selectedArtists?.filter((filterArtist) => (filterArtist.id !== artist.id))
                setSelectedArtists(newArtists)
              }}
            >
              {artist.name}
              <IoClose size={20}/>
            </div>
          ))
          :
          <p className='w-full flex justify-center items-center'>No Artists Selected</p>
        }
      </div>
      <div
        className="w-full form-input px-8 py-4 flex items-center justify-between rounded"
        onClick={() => setOpen(!open)}
      >
        Select the Artists
        <FaAngleDown className={`${open && "rotate-180"}`}/>
      </div>
      <ul className={`absolute w-full mt-2 p-0 form-input overflow-y-auto ${open ? "max-h-60" : "hidden"} z-10`}>
        <div className="sticky top-0">
          <input
            type="text"
            placeholder="Enter artist name"
            className="w-full form-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
          />
        </div>
        {artistData.length < 1 ?<div className="text-center p-4"> <Loader/> </div>: artistData.map((artist, index) => (
          <li
            key={index}
            className={`p-2 mx-4 mb-1 cursor-pointer ${selectedArtists?.some(selectedArtist => selectedArtist.id === artist.id) && "bg-gray-200 dark:bg-gray-700"} hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${artist.name?.toLowerCase().startsWith(inputValue) ? "block" : "hidden"}`}
            onClick={() => {

              let artistData = {
                id: artist.id,
                name: artist.name,
              }

              if (!selectedArtists?.some(selectedArtist => selectedArtist.id === artist.id)) setSelectedArtists([...selectedArtists, artistData])
              setInputValue("")
            }}
          >{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}
