"use client";

import { PostArtist } from "@/constants/endpoints/ArtistEndpoints";
import { PostImage } from "@/constants/endpoints/ImageEndpoints";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";


interface artistInterface {
  id: string,
  name: string,
  userName: string,
  email: string,
  govId: string,
}
interface selectedArtistsI {
  id: string,
  name: string,
}

interface ArtistProps {
  artistData: artistInterface[];
  setArtistData: React.Dispatch<React.SetStateAction<artistInterface[]>>;
  selectedArtists: selectedArtistsI[];
  setSelectedArtists: React.Dispatch<React.SetStateAction<selectedArtistsI[]>>;
}

const AddNewArtistModal: React.FC<ArtistProps> = ({ artistData, setArtistData, selectedArtists, setSelectedArtists }) => {
  const [file, setFile] = useState<File | undefined>();
  const [newArtistName, setNewArtistName] = useState("");
  const [newArtistUsername, setNewArtistUsername] = useState("");
  const [newArtistEmail, setNewArtistEmail] = useState("");
  const [newArtistGovId, setNewArtistGovId] = useState("");

  useEffect(() => {
    const addArtistModal = document.getElementById("addArtistModal");
    const addArtistModalOverlay = document.getElementById("addArtistModalOverlay");
    const addArtistModalTriggers = document.querySelectorAll(
      "[data-add-artist-trigger]",
    );

    addArtistModalTriggers.forEach((button) => {
      button.addEventListener("click", function () {
        const addArtistModal = document.getElementById("addArtistModal");
        addArtistModal!.classList.add("show");
      });
    });

    addArtistModalOverlay!.addEventListener("click", function () {
      addArtistModal!.classList.remove("show");
    });
  }, []);


  
  const postImg = async () => {

    if (typeof (file) === 'undefined') return;

    var formdata = new FormData();
    formdata.append("file", file);

    var requestOptions = {
      method: 'POST',
      body: formdata,
    };

    let response = await fetch(`${PostImage}`, requestOptions);
    let result = await response.text()

    return result;
  }



  const addArtistData = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(
      {
        "name": newArtistName,
        "userName": newArtistUsername,
        "email": newArtistEmail,
        "govId": newArtistGovId,

      });

    console.log(raw)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    toast.dismiss()
    toast.loading("Adding artist...")

    const profImg = await postImg();

    if (profImg===undefined) {
        toast.dismiss();
        toast.error('Failed to upload image');
        return;
    }    
    let response = await fetch(`${PostArtist}?profileImg=${profImg}`, requestOptions);
    // console.log(`${PostArtist}?profileImg=${profImg}`)
    let result = await response.json();
    console.log(response)
    if (response.ok) {
      let newArtistData = {
        id: result.statusMsg,
        name: newArtistName,
        userName: newArtistUsername,
        email: newArtistUsername,
        govId: newArtistGovId,
      }
      let selectedArtistData = {
        id: result.statusMsg,
        name: newArtistName,
      }

      console.log(newArtistData)

      setArtistData([...artistData, newArtistData]);
      setSelectedArtists([...selectedArtists, selectedArtistData]);

      setNewArtistName("");
      setNewArtistUsername("");
      setNewArtistEmail("");
      setNewArtistGovId("");
      setFile(undefined);

      // document.getElementById("image-input-artist")?.click();

      const addArtistModal = document.getElementById("addArtistModal");
      addArtistModal!.classList.remove("show");
      toast.dismiss()
      toast.success('Artist added successfully!')
    }
    else {
      toast.dismiss()
      toast.error('Failed to add artist')
    }

  }

  const handleAadharChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    event.target.value=event.target.value.replace(/\D/g, '');
    if(event.target.value.length>12){
        event.target.value=event.target.value.slice(0,12);
    }
    const inputAadhar=event.target.value

    setNewArtistGovId(inputAadhar);


};


  return (
    <div id="addArtistModal" className="search-modal overflow-scroll">
      <div id="addArtistModalOverlay" className="search-modal-overlay" />
      <div className="search-wrapper">
        <div className="search-wrapper-header">
          <div className={"flex flex-col items-center gap-4 "}>
            <h3 className={"mb-4"}>Register Artist</h3>
            <div className="mx-auto mb-4 w-full sm:px-4 md:px-8 lg:px-12">
              <div className="flex flex-col gap-6">
                <div className={"flex flex-col md:flex-row w-full justify-between gap-4"}>

                  <div className="w-full flex flex-col gap-4">
                    <div className="w-full">
                      <label htmlFor="title" className="form-label block">
                        Full Name
                      </label>
                      <input
                        id="artist-name"
                        name="artist-name"
                        value={newArtistName}
                        onChange={(e) => setNewArtistName(e.target.value)}
                        className="form-input w-full"
                        placeholder="Enter artist's name"
                        type="text"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="title" className="form-label block">
                        Username
                      </label>
                      <input
                        id="artist-username"
                        name="artist-username"
                        value={newArtistUsername}
                        onChange={(e) => setNewArtistUsername(e.target.value)}
                        className="form-input w-full"
                        placeholder="Enter artist's name"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-full">
                      <label htmlFor="title" className="form-label block">
                        Email
                      </label>
                      <input
                        id="artist-email"
                        name="email"
                        value={newArtistEmail}
                        onChange={(e) => setNewArtistEmail(e.target.value)}
                        className="form-input w-full"
                        placeholder="Enter artist's name"
                        type="email"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="title" className="form-label block">
                        Aadhar Number
                      </label>
                      <input
                        id="aadhar-no"
                        name="aadhar-no"
                        className="form-input w-full"
                        placeholder="Enter artist's aadhar No."
                        type="text"
                        value={newArtistGovId}
                        onChange={handleAadharChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className={"flex gap-6 flex-col md:flex-row w-full"}>
                  <div className="w-full">
                    <label
                      className="form-label block"
                      htmlFor="file_input"
                    >
                      Upload Profile Image
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          document.getElementById("image-input-artist")?.click()
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
                      id="image-input-artist"
                      type="file"
                      className="hidden"
                      onChange={({ target: { files } }) => {
                        if (files && files.length > 0) setFile(files[0]);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full sm:px-4 md:px-8 lg:px-12">
              <button
                className={"btn btn-primary w-full"}
                onClick={() => {

                  if (newArtistName === "") {
                    toast.dismiss()
                    toast.error("Please enter artist fullname");
                  }
                  else if (newArtistUsername === "") {
                    toast.dismiss()
                    toast.error("Please enter username");
                  }
                  else if (newArtistEmail === "") {
                    toast.dismiss()
                    toast.error("Please enter email");
                  }
                  else if (newArtistGovId === "") {
                    toast.dismiss()
                    toast.error("Please enter Adhar number");
                  }
                  else if(newArtistGovId.length<12){
                    toast.dismiss()
                    toast.error("Adhar number must be of 12 digits")
                  }
                  else if (typeof (file) === 'undefined') {
                    toast.dismiss()
                    toast.error("Please upload Profile Image");
                  }
                 
                  else {
                    addArtistData();
                  }
                }}
              >
                <h5 className={"text-white dark:text-dark flex justify-center"}>Add Artist</h5>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewArtistModal;
