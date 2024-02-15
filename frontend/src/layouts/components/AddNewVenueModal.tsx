"use client";

import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import { GetPlaceByCity } from "@/constants/endpoints/CityEndpoints";
import { PostVenue } from "@/constants/endpoints/VenuesEndponts";
import toast from "react-hot-toast";


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


interface VenueProps {
  venueData: venueInterface[];
  setVenueData: React.Dispatch<React.SetStateAction<venueInterface[]>>;
  setSelectedVenue: React.Dispatch<React.SetStateAction<selectedVenueI | undefined>>;
  selectedCity: string,
}

const AddNewVenueModal: React.FC<VenueProps> = ({ venueData, setVenueData, setSelectedVenue, selectedCity }) => {

  // const { selectedCity } = useGlobalContext();

  const [newVenue, setNewVenue] = useState("");
  const [newVenueAddress, setNewVenueAddress] = useState("");
  const [capacity, setCapacity] = useState(0)
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    const addVenueModal = document.getElementById("addVenueModal");

    const addVenueModalOverlay = document.getElementById("addVenueModalOverlay");
    const addVenueModalTriggers = document.querySelectorAll(
      "[data-add-venue-trigger]",
    );

    addVenueModalTriggers.forEach((button) => {
      button.addEventListener("click", function () {
        const addVenueModal = document.getElementById("addVenueModal");
        addVenueModal!.classList.add("show");
      });
    });

    addVenueModalOverlay!.addEventListener("click", function () {
      addVenueModal!.classList.remove("show");
    });
  }, []);


  const getPlaceData = async () => {
    try {
      const res = await fetch(`${GetPlaceByCity}${selectedCity}`);

      if (!res.ok) {
        throw new Error("Failed to fetch venues");
      }

      let result = await res.json()
      // const getId = result.id;

      setPlaceId(result.id)

      // setPlaceData(result)

      console.log("place data: ", placeId);

    } catch (error) {
      console.log("Error loading venues: ", error);
    }
  }

  const addNewVenue = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "address": newVenueAddress,
      "capacity": capacity,
      "name": newVenue,
      "placeId": placeId,
    });

    console.log(raw)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    toast.loading("Adding venue...")

    let response = await fetch(`${PostVenue}`, requestOptions);
    let result = await response.json();

    if (response.status === 201) {
      const newVenueData: venueInterface = {
        address: newVenueAddress,
        capacity: capacity,
        id: result.statusMsg,
        name: newVenue,
        placeId: placeId,
      }

      console.log(newVenueData)

      setVenueData([...venueData, newVenueData]);

      let selectedVenueData = {
        id: result.statusMsg,
        name: newVenue,
      }
      setSelectedVenue(selectedVenueData);
      setNewVenue('')
      setCapacity(0)
      setNewVenueAddress('')
      const addVenueModal = document.getElementById("addVenueModal");
      addVenueModal!.classList.remove("show");
      toast.dismiss()
      toast.success('Venue added successfully!')
    }
    else {
      toast.dismiss()
      toast.error(`Failed to add venue,${result.capacity}`)
    }

  }



  useEffect(() => {
    if (selectedCity !== '') {
      getPlaceData();
    }
  }, [selectedCity])



  return (
    <div id="addVenueModal" className="search-modal">
      <div id="addVenueModalOverlay" className="search-modal-overlay" />
      <div className="search-wrapper">
        <div className="search-wrapper-header">
          <div className={"flex flex-col items-center gap-4"}>
            <h3 className={"mb-4"}>Register Venue</h3>
            <div className="mx-auto mb-4 w-full sm:px-4 md:px-8 lg:px-12">
              <div className="flex flex-col gap-6">
                <div className={"flex gap-6 flex-col md:flex-row w-full"}>
                  <div className="w-full">
                    <label htmlFor="title" className="form-label block">
                      Venue Name
                    </label>
                    <input
                      id="venue-name"
                      name="venue-name"
                      value={newVenue}
                      onChange={(e) => setNewVenue(e.target.value)}
                      className="form-input w-full"
                      placeholder="Enter venue name"
                      type="text"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="title" className="form-label block">
                      Venue Capacity
                    </label>
                    <input
                      id="venue-capacity"
                      name="venue-capacity"
                      className="form-input w-full"
                      placeholder="Enter venue capacity"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.valueAsNumber)}
                      type="number"
                      required
                    />
                  </div>
                </div>
                <div className={"flex gap-6 flex-col md:flex-row w-full"}>
                  <div className="w-full">
                    <label htmlFor="title" className="form-label block">
                      Venue Address
                    </label>
                    <input
                      id="venue-address"
                      name="venue-address"
                      value={newVenueAddress}
                      onChange={(e) => setNewVenueAddress(e.target.value)}
                      className="form-input w-full"
                      placeholder="Enter venue address"
                      type="text"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="title" className="form-label block">
                      City
                    </label>
                    <input
                      id="venue-city"
                      name="venue-city"
                      className="form-input w-full"
                      value={selectedCity}
                      type="text"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full sm:px-4 md:px-8 lg:px-12">
              {/* {placeData && placeData} */}
              <button
                className={"btn btn-primary w-full"}
                onClick={() => {
                  if (newVenueAddress === "" || capacity === 0 || newVenue === "" || placeId === "") {
                    toast.dismiss()
                    toast.error("All fields are required!")
                  }
                  else if(capacity<0){
                    toast.dismiss()
                    toast.error("Capacity must be greater than zero")
                  }
                  else {
                    addNewVenue()
                  }
                }}
              >
                <h5 className={"text-white dark:text-dark flex justify-center"}>Add Venue</h5>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewVenueModal;
