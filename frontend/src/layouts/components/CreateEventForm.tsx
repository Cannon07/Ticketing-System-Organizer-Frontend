"use client"

import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/app/context/globalContext';
import NotConnected from '@/app/not-connected';
import { useRouter } from 'next/navigation';
import { SelectArtistDropdown } from './SelectArtistsDropdown';
import { SelectVenueDropdown } from './SelectVenueDropdown';
import AddNewArtistModal from './AddNewArtistModal';
import AddNewVenueModal from './AddNewVenueModal';
import AddNewTierModal from './AddNewTierModal';
import { IoClose } from 'react-icons/io5';
import { ImageSelector } from './ImageSelector';
import { SelectCategoryDropdown } from './SelectCategoryDropdown';
import { useContract, useTx } from 'useink';
import { useTxNotifications } from 'useink/notifications';
import metadata from '@/constants/contract_constants/assets/TicketingSystem.json';
import { CONTRACT_ADDRESS } from '@/constants/contract_constants/ContractAddress';
import { generateHash } from '@/lib/utils/hashGenerator';
import { useCodeHash } from 'useink';
import { Hash } from 'crypto';
import toast from 'react-hot-toast';
// import CodeHash from '@/constants/contract_constants/CodeHash';



const CreateEventForm = () => {

    const router = useRouter();
    const { hasAccount } = useGlobalContext();
    const registered = true;




    const contract = useContract(CONTRACT_ADDRESS,metadata);

    

    const registerEvent = useTx(contract,'registerEvent');
    useTxNotifications(registerEvent);


    useEffect(()=>{
      if(registerEvent.status === 'Finalized'){
        toast.dismiss()
        toast.success('Transaction finalized!')
      }
      else if(registerEvent.status === 'PendingSignature'){
        toast.dismiss()
        toast.loading('Pending signature..')
      }
      else if(registerEvent.status === 'Broadcast'){
        toast.dismiss()
        toast.loading('Broadcasting transaction..')
      }
      else if(registerEvent.status === 'InBlock'){
        toast.dismiss()
        toast.loading('Transaction In Block..')
      }
    }
    ,[registerEvent.status])





    const [eventTitle, setEventTitle] = useState('');
    const [eventDateTime, setEventDateTime] = useState('');
    const [eventDuration, setEventDuration] = useState('');
    const [aboutEvent, setAboutEvent] = useState('');


    const [tiers, setTiers] = useState<String[]>([]);
    const [tiersCapacity,setTiersCapacity] = useState<number[]>([])

    const [selectedArtists, setSelectedArtists] = useState<String[]>([]);
    const [selectedVenue, setSelectedVenue] = useState<String>('');
    const [selectedCategory, setSelectedCategory] = useState<String>('');

    const [venueNames, setVenueNames] = useState<String[]>(
      [
        'Starlight Lounge',
        'Moonlit Garden',
        'Cityscape Ballroom',
        'Harmony Hall',
        'Sunset Terrace',
        'Epic Event Space',
        'Crystal Pavilion',
        'Royal Oasis',
        'Grand Horizon Plaza',
        'Enchanting Courtyard',
        'Sapphire Skyline Club',
        'Majestic Manor',
        'Celestial Gardens',
        'Azure Amphitheater',
        'Prestige Palace',
        'Radiant Rooftop Lounge',
        'Whispering Woods Pavilion',
        'Golden Gate Banquet Hall',
        'Charm City Chapel',
        'Ethereal Elegance Hall'
      ]
    )
    const [categoryNames, setCategoryNames] = useState<String[]>(
      [
        'Rock',
        'Pop',
        'Jazz',
        'Classical',
        'Hip-hop',
        'Electronic/Dance',
        'Country',
        'R&B/Soul',
        'Folk',
        'Alternative'
      ]
    )
    const [artistNames, setArtistNames] = useState<String[]>([
        'Alice',
        'Bob',
        'Charlie',
        'Diana',
        'Eva',
        'Frank',
        'Grace',
        'Henry',
        'Ivy',
        'Jack',
        'Katherine',
        'Leo',
        'Mia',
        'Nathan',
        'Olivia',
        'Peter',
        'Quinn',
        'Rachel',
        'Samuel',
        'Tessa'
    ])


    if (!registered) {
      router.push('/register-organizer');
    }

  if (!hasAccount) return <NotConnected />

    const hashData = generateHash([eventTitle,eventDateTime,eventDuration,aboutEvent,[...tiers],[...selectedArtists],selectedVenue,selectedCategory])


    const handleCancelClick=(e:any)=>{
      e.preventDefault();


    }


    const handleCreateEvent=(e:any)=> {
        e.preventDefault();
        registerEvent.signAndSend([hashData,tiers,tiersCapacity]);
    }

    
    function handleDateTimeChange(ev: any) {
      if (!ev.target['validity'].valid) return;
      const dt = ev.target['value'] + ':00Z';
      setEventDateTime(dt);
  }


    return (
        <div className="mx-auto border dark:border-gray-600 border-gray-300 rounded-lg">
            <div className="lg:grid md:grid lg:grid-cols-2 md:grid-cols-2 gap-6 p-4 py-8">
                <div className="mb-4">
                    <label htmlFor="title" className="form-label block">
                        Event Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        className="form-input"
                        placeholder="Enter the title of the event.."
                        type="text"
                        value={eventTitle}
                        onChange={(e)=>setEventTitle(e.target.value)}
                        required
                    />
                </div>
                

                <div className="mb-4">
                    <label htmlFor="date" className="form-label block">
                        Event Date and Time
                    </label>

                    <input
                        id="datetimelocal"
                        name="datetimelocal"
                        className="form-input dark:dark-date"
                        type="datetime-local"
                        value={(eventDateTime || '').toString().substring(0, 16)}
                        onChange={handleDateTimeChange}
                        required
                    />
                </div>

                
                <div className="mb-4">
                    {/* <AddNewVenueModal
                      venueNames={venueNames}
                      setVenueNames={setVenueNames}
                      setSelectedVenue={setSelectedVenue}
                    /> */}
                    <div className='flex flex-col gap-4'>
                      <SelectCategoryDropdown
                        categoryNames={categoryNames}
                        selectedCategory={selectedCategory}
                        setselectedCategory={setSelectedCategory}
                      />
                   
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="duration" className="form-label block">
                        Event Duration (hh:mm)
                    </label>
                    <input
                        id="duration"
                        name="duration"
                        className="form-input dark:dark-date"
                        type="time"
                        value={eventDuration}
                        onChange={(e)=>setEventDuration(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <AddNewVenueModal
                      venueNames={venueNames}
                      setVenueNames={setVenueNames}
                      setSelectedVenue={setSelectedVenue}
                    />
                    <div className='flex flex-col gap-4'>
                      <SelectVenueDropdown
                        venueNames={venueNames}
                        selectedVenue={selectedVenue}
                        setSelectedVenue={setSelectedVenue}
                      />
                      <button className='btn btn-primary' data-add-venue-trigger>
                        Add new Venue
                      </button>
                    </div>
                </div>
                


                <div className="mb-4">
                    <AddNewTierModal
                      tiers={tiers}
                      setTiers={setTiers}
                      tiersCapacity={tiersCapacity}
                      setTiersCapacity={setTiersCapacity}
                    />
                    <div className='flex flex-col'>
                      <label className='form-label block'>
                        Event Tiers
                      </label>

                      <div className={`flex flex-col gap-4`}>
                        <div className={`flex flex-wrap gap-2 dark:border-gray-600 border-gray-300 border-2 rounded border-dashed min-h-[57px] p-1`}>
                          {tiers.length > 0 ?
                            tiers.map((tier, index) => {
                              return(
                                <div
                                  key={index}
                                  className='btn btn-outline-primary flex gap-4 justify-center items-center'
                                  onClick={() => {
                                    const newTiers = tiers?.filter((filterTier) => (filterTier !== tier))
                                    setTiers(newTiers)
                                  }}
                                >
                                  {tier}
                                  <IoClose size={20} />
                                </div>
                              )
                            })
                          :
                          <p className='w-full flex justify-center items-center'>No Tiers Selected</p>
                          }
                        </div>

                        <button className='btn btn-primary' data-add-tier-trigger>
                          Add Seat Tier
                        </button>
                      </div>
                    </div>
                </div>

                <div className="mb-4">
                    <AddNewArtistModal
                      artistNames={artistNames}
                      setArtistNames={setArtistNames}
                      selectedArtists={selectedArtists}
                      setSelectedArtists={setSelectedArtists}
                    />
                    <div className='flex flex-col gap-4'>
                      <SelectArtistDropdown
                        artistNames={artistNames}
                        selectedArtists={selectedArtists}
                        setSelectedArtists={setSelectedArtists}
                      />
                      <button className='btn btn-primary' data-add-artist-trigger>
                        Add new Artist
                      </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="about" className="form-label block">
                        About the Event
                    </label>
                    <textarea
                        id="about"
                        name="about"
                        className="form-input w-full min-h-48"
                        placeholder="Provide details about the event.."
                        value={aboutEvent}
                        onChange={(e)=>setAboutEvent(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className='mb-4'>
                  <ImageSelector
                    title={"Primary Image"}
                  />
                </div>

                <div className='mb-4'>
                  <ImageSelector
                    title={"Background Image"}
                  />
                </div>


                <div className="col-span-2 flex gap-4 pl-1">
                    <button onClick={handleCreateEvent} type="submit" className="btn btn-primary">
                      Create Event
                    </button>
                    <button onClick={handleCancelClick} className="btn btn-primary">
                        Cancel
                    </button>
                </div>


            </div>
        </div>
    )

}

export default CreateEventForm;
