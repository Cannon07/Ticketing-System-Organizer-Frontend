"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";


interface tierInterface{
  name: string,
  capacity: number,
  price: number,
}

interface tierProps {
  tiers: tierInterface[];
  setTiers: React.Dispatch<React.SetStateAction<tierInterface[]>>;

}

const AddNewTierModal: React.FC<tierProps> = ({ tiers, setTiers}) => {

  const [name, setName] = useState("");
  const [newCapacity,setNewCapacity] = useState<number>(0);
  const [tierPrice,setTierPrice] = useState(0);

  

  useEffect(() => {
    const addTierModal = document.getElementById("addTierModal");
    const addTierModalOverlay = document.getElementById("addTierModalOverlay");
    const addTierModalTriggers = document.querySelectorAll(
      "[data-add-tier-trigger]",
    );

    addTierModalTriggers.forEach((button) => {
      button.addEventListener("click", function () {
        const addTierModal = document.getElementById("addTierModal");
        addTierModal!.classList.add("show");
      });
    });

    addTierModalOverlay!.addEventListener("click", function () {
      addTierModal!.classList.remove("show");
    });
  }, []);

  return (
    <div id="addTierModal" className="search-modal">
      <div id="addTierModalOverlay" className="search-modal-overlay" />
      <div className="search-wrapper">
        <div className="search-wrapper-header">
          <div className={"flex flex-col items-center gap-4"}>
            <h3 className={"mb-4"}>New Tier</h3>
            <div className="mx-auto mb-4 w-full sm:px-4 md:px-8 lg:px-12">
            <div className="flex flex-col gap-6">
                <div className={"flex gap-6 lg:flex-row flex-col w-full"}>
                  <div className="w-full">
                      <label htmlFor="title" className="form-label block">
                        Tier Name
                      </label>
                      <input
                        id="tier-name"
                        name="tier-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input w-full"
                        placeholder="Enter tier name"
                        type="text"
                        required
                      />
                  </div>

                  <div className="w-full">
                      <label htmlFor="title" className="form-label block">
                        Tier Capacity
                      </label>
                      <input
                          id="tier-capacity"
                          name="tier-capacity"
                          className="form-input w-full"
                          placeholder="Enter tier capacity"
                          type="number"
                          value={newCapacity}
                          onChange={(e)=>setNewCapacity(e.target.valueAsNumber)}
                          required
                      />
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="w-full">
                    <label htmlFor="title" className="form-label block">
                        Tier Price
                      </label>
                      <input
                          id="tier-price"
                          name="tier-price"
                          className="form-input w-full"
                          placeholder="Enter tier Price"
                          type="number"
                          value={tierPrice}
                          onChange={(e)=>setTierPrice(e.target.valueAsNumber)}
                          required
                      />
                  </div>
                </div>

            </div>
          </div>
          <div className="w-full sm:px-4 md:px-8 lg:px-12">
            <button
              className={"btn btn-primary w-full"}
              onClick={() => {
              
                if(name==="" || newCapacity===0 || tierPrice===0 ){
                  toast.dismiss()
                  toast.error("All fields are required!")
                  return;
                }
                if (name.length > 0) {

                  let newTierData = {
                        name: name,
                        capacity: newCapacity,
                        price: tierPrice,
                  }

                  setTiers([...tiers, newTierData]);
                  
                  toast.success('New tier Added!')

                }
                
                setName("");
                setNewCapacity(0);
                setTierPrice(0);
                const addTierModal = document.getElementById("addTierModal");
                addTierModal!.classList.remove("show");
              }}
            >
              <h5 className={"text-white dark:text-dark flex justify-center"}>Add Tier</h5>
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewTierModal;
