"use client";

import React, { useEffect, useState } from "react";
import LocationResult from "./LocationResult";



const LocationModal = () => {
  const [searchString, setSearchString] = useState("");
  const [searchLength,setSearchLength] = useState(0);

  // handle input change
  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchString(e.currentTarget.value.replace("\\", "").toLowerCase());
  };

  // get search result
  const startTime = performance.now();
  // const searchResult = doSearch(searchData);
  const endTime = performance.now();
  const totalTime = ((endTime - startTime) / 1000).toFixed(3);

  // search dom manipulation
  useEffect(() => {
    const locationModal = document.getElementById("locationModal");
    const searchInput = document.getElementById("searchInput");
    const locationModalOverlay = document.getElementById("locationModalOverlay");
    const searchResultItems = document.querySelectorAll("#searchItem");
    const locationModalTriggers = document.querySelectorAll(
      "[data-place-trigger]",
    );

    // search modal open
    locationModalTriggers.forEach((button) => {
      button.addEventListener("click", function () {
        const locationModal = document.getElementById("locationModal");
        setSearchString("");
        locationModal!.classList.add("show");
        searchInput!.focus();
      });
    });

    // search modal close
    locationModalOverlay!.addEventListener("click", function () {
      locationModal!.classList.remove("show");
    });

    // keyboard navigation
    let selectedIndex = -1;

    const updateSelection = () => {
      searchResultItems.forEach((item, index) => {
        if (index === selectedIndex) {
          item.classList.add("search-result-item-active");
        } else {
          item.classList.remove("search-result-item-active");
        }
      });

      searchResultItems[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    };

    document.addEventListener("keydown", function (event) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        locationModal!.classList.add("show");
        searchInput!.focus();
        updateSelection();
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }

      if (event.key === "Escape") {
        locationModal!.classList.remove("show");
      }

      if (event.key === "ArrowUp" && selectedIndex > 0) {
        selectedIndex--;
      } else if (
        event.key === "ArrowDown" &&
        selectedIndex < searchResultItems.length - 1
      ) {
        selectedIndex++;
      } else if (event.key === "Enter") {
        const activeLink = document.querySelector(
          ".search-result-item-active a",
        ) as HTMLAnchorElement;
        if (activeLink) {
          activeLink?.click();
          locationModal!.classList.remove("show");
        }
      }

      updateSelection();
    });
  }, []);


 const handleSearchLength=(len:any)=>{
    setSearchLength(len);
 }




  return (
    <div id="locationModal" className="search-modal">
      <div id="locationModalOverlay" className="search-modal-overlay" />
      <div className="search-wrapper">
        <div className="search-wrapper-header">
          <label
            htmlFor="searchInput"
            className="absolute left-7 top-[calc(50%-7px)]"
          >
            <span className="sr-only">search icon</span>
            {searchString ? (
              <svg
                onClick={() => setSearchString("")}
                viewBox="0 0 512 512"
                height="18"
                width="18"
                className="hover:text-red-500 cursor-pointer -mt-0.5"
              >
                <path
                  fill="currentcolor"
                  d="M256 512A256 256 0 10256 0a256 256 0 100 512zM175 175c9.4-9.4 24.6-9.4 33.9.0l47 47 47-47c9.4-9.4 24.6-9.4 33.9.0s9.4 24.6.0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6.0 33.9s-24.6 9.4-33.9.0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9.0s-9.4-24.6.0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6.0-33.9z"
                ></path>
              </svg>
            ) : (
              <svg
                viewBox="0 0 512 512"
                height="18"
                width="18"
                className="-mt-0.5"
              >
                <path
                  fill="currentcolor"
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8.0 45.3s-32.8 12.5-45.3.0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9.0 208S93.1.0 208 0 416 93.1 416 208zM208 352a144 144 0 100-288 144 144 0 100 288z"
                ></path>
              </svg>
            )}
          </label>
          <input
            id="searchInput"
            placeholder="Search for your city..."
            className="search-wrapper-header-input"
            type="input"
            name="search"
            value={searchString}
            onChange={handleSearch}
            autoFocus
            autoComplete="off"
          />
        </div>
        <LocationResult searchString={searchString} handleLength={handleSearchLength} />
        <div className="search-wrapper-footer">
          <span className="flex items-center">
            <kbd>
              <svg
                width="14"
                height="14"
                fill="currentcolor"
                viewBox="0 0 16 16"
              >
                <path d="M3.204 11h9.592L8 5.519 3.204 11zm-.753-.659 4.796-5.48a1 1 0 011.506.0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 01-.753-1.659z"></path>
              </svg>
            </kbd>
            <kbd>
              <svg
                width="14"
                height="14"
                fill="currentcolor"
                viewBox="0 0 16 16"
              >
                <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 001.506.0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 00-.753 1.659z"></path>
              </svg>
            </kbd>
            to navigate
          </span>
          <span className="flex items-center">
            <kbd>
              <svg
                width="12"
                height="12"
                fill="currentcolor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M14.5 1.5a.5.5.0 01.5.5v4.8a2.5 2.5.0 01-2.5 2.5H2.707l3.347 3.346a.5.5.0 01-.708.708l-4.2-4.2a.5.5.0 010-.708l4-4a.5.5.0 11.708.708L2.707 8.3H12.5A1.5 1.5.0 0014 6.8V2a.5.5.0 01.5-.5z"
                ></path>
              </svg>
            </kbd>
            to select
          </span>
          {searchString && (
            <span>
              <strong>{searchLength} </strong> results - in{" "}
              <strong>{totalTime} </strong> seconds
            </span>
          )}
          <span>
            <kbd>ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
