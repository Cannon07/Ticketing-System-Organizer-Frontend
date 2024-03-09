"use client"

import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/app/context/globalContext';
import { useRouter } from 'next/navigation';
import { SelectArtistDropdown } from './SelectArtistsDropdown';
import { SelectVenueDropdown } from './SelectVenueDropdown';
import AddNewArtistModal from './AddNewArtistModal';
import AddNewVenueModal from './AddNewVenueModal';
import AddNewTierModal from './AddNewTierModal';
import { IoClose } from 'react-icons/io5';
import { ImageSelector } from './ImageSelector';
import { SelectCategoryDropdown } from './SelectCategoryDropdown';
import { useContract, useTx, useWallet } from 'useink';
import { useTxNotifications } from 'useink/notifications';
import metadata from '@/constants/contract_constants/assets/TicketingSystem.json';
import { CONTRACT_ADDRESS } from '@/constants/contract_constants/ContractAddress';
import { generateHash } from '@/lib/utils/hashGenerator';
import toast from 'react-hot-toast';
import { SelectCityDropdown } from './SelectCityDropdown';
import { GetVenuesByCity } from '@/constants/endpoints/VenuesEndponts';
import { GetArtists } from '@/constants/endpoints/ArtistEndpoints';
import { PostImage } from '@/constants/endpoints/ImageEndpoints';
import { GetEventById, UpdateEventById } from '@/constants/endpoints/EventEndpoints';
import { GetAllPlaces } from '@/constants/endpoints/CityEndpoints';
import { stringify } from 'querystring';


interface venueInterface {
    address: string,
    capacity: number,
    id: string,
    name: string,
    placeId: string,
}


interface tierInterface {
    name: string,
    capacity: number,
    price: number,
}


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


interface cityInterface {
    id: string,
    city: string,
}


interface selectedVenueI {
    id: string,
    name: string,
}

interface IdProps{
  id: string,

}

const UpdateEventForm: React.FC<IdProps> = ({id}) => {

    const router = useRouter();
    const { organizerData } = useGlobalContext();
    const {account} = useWallet();

    const contract = useContract(CONTRACT_ADDRESS || '', metadata);

    const updateEvent = useTx(contract, 'updateEvents');
    useTxNotifications(updateEvent);



    useEffect(() => {
      if (updateEvent.status === 'Finalized') {
        let txId = "";
        console.log(updateEvent)
        updateEvent.result?.contractEvents?.map((value) => {
          txId=value.args[1][value.args[1].length-1].slice(0,64)
          console.log(txId)
        });
        toast.dismiss()
        if (txId === "") {
          toast.error("Something went wrong!")
        } else {
          toast.success('Transaction finalized!')
          let register_toast = toast.loading('Updating Event..')
          UpdateEvent(txId);
          toast.dismiss(register_toast)
        }
      }
        else if (updateEvent.status === 'PendingSignature') {
            toast.dismiss()
            toast.loading('Pending signature..')
        }
        else if (updateEvent.status === 'Broadcast') {
            toast.dismiss()
            toast.loading('Broadcasting transaction..')
        }
        else if (updateEvent.status === 'InBlock') {
            toast.dismiss()
            toast.loading('Transaction In Block..')
        }
        else {
            toast.dismiss();
        }
    }
    , [updateEvent.status])

    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDuration, setEventDuration] = useState('');
    const [aboutEvent, setAboutEvent] = useState('');


    const [tiers, setTiers] = useState<tierInterface[]>([]);
    const [citiesData, setCitiesData] = useState<cityInterface[]>([])

    const [selectedArtists, setSelectedArtists] = useState<selectedArtistsI[]>([]);
    const [selectedVenue, setSelectedVenue] = useState<selectedVenueI>();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState('');

    const [venueData, setVenueData] = useState<venueInterface[]>([])
    const [artistData, setArtistData] = useState<artistInterface[]>([])

    const [file, setFile] = useState<File | undefined>();
    const [filebg, setFilebg] = useState<File | undefined>();


    const [originalEventTitle,setOriginalEventTitle] = useState('');
    const [originalEventDate,setOriginalEventDate] = useState('');
    const [originalEventTime,setOriginalEventTime] = useState('');
    const [originalEventDuration,setOriginalEventDuration] = useState('');
    const [originalAboutEvent,setOriginalAboutEvent]= useState('');
    const [originalTiers,setOriginalTiers] = useState<tierInterface[]>([]);
    const [originalSelectedArtists,setOriginalSelectedArtists] = useState<selectedArtistsI[]>([]);
    const [originalSelectedVenue,setOriginalSelectedVenue] = useState<selectedVenueI>();
    const [originalSelectedCategory,setOriginalSelectedCategory] = useState('');
    const [originalSelectedCity, setOriginalSelectedCity] = useState('');

    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')

    
    const [categoryNames, setCategoryNames] = useState<string[]>(
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


    useEffect(()=>{
        getEventById();
        getPlaces();
        getArtists();
    },[])
    
    useEffect(() => {
        if (selectedCity !== '') {
            getVenuesByCity();
            setSelectedVenue(undefined);
        }
    }, [selectedCity])

    useEffect(()=>{
      if(organizerData===null){
        router.push('/');
      }
    },[organizerData?.walletId])

    
    const getEventById = async()=>{
        try {
            toast.loading('Fetching event...')
            const res = await fetch(`${GetEventById}${id}`);
            if (!res.ok) {
                throw new Error("Failed to fetching event");
            }
            toast.dismiss()
            toast.success('Event fetched successfully!')

            let result = await res.json()
            console.log(res)

            console.log(result);

            setEventTitle(result.name);
            setOriginalEventTitle(result.name);

            const dateTimeString = result.dateAndTime;
            
            const dateTime = new Date(dateTimeString)
       
            const date = dateTime.toISOString().split('T')[0];

            const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            setEventDate(date)
            setOriginalEventDate(date)

            setEventTime(time)
            setOriginalEventTime(time)

            setEventDuration(result.eventDuration);
            setOriginalEventDuration(result.eventDuration);
            
            setSelectedCity(result.venueId.placeId);
            setOriginalSelectedCity(result.venueId.placeId);
          

            setAboutEvent(result.description);
            setOriginalAboutEvent(result.description)

            setSelectedCategory(result.categoryList[0]);
            setOriginalSelectedCategory(result.categoryList[0]);
            
            const vid:string = result.venueId.id;
            const vname:string = result.venueId.name;

            const selectedVenueData:selectedVenueI = {
              id: vid,
              name: vname,
            }

            setSelectedVenue(selectedVenueData);
            setOriginalSelectedVenue(selectedVenueData);

            console.log("svd: ",selectedVenueData)
            console.log("sv: ",selectedVenue)
            console.log("osv: ",originalSelectedVenue)


            setTiers(result.tiers);
            setOriginalTiers(result.tiers)

            const selectedArtistData:selectedArtistsI[] = []

            result.artists.map((artist:artistInterface)=>{
                  const data = {
                    id: artist.id,
                    name: artist.name,
                  }
                  selectedArtistData.push(data);
              })

            setSelectedArtists(selectedArtistData);
            setOriginalSelectedArtists(selectedArtistData);

            setImage1(result.imageUrls[0])
            setImage2(result.imageUrls[1])
          

        } catch (error) {
            toast.dismiss()
            toast.error('Failed to fetch event')
            console.log("Error loading event: ", error);
        }
    }



    const postImg = async (fileData: File | undefined) => {

        if (typeof (fileData) === 'undefined') return;

        var formdata = new FormData();
        formdata.append("file", fileData);

        var requestOptions = {
            method: 'POST',
            body: formdata,
        };

        let response = await fetch(`${PostImage}`, requestOptions);
        let result = await response.text()

        return result;
    }


    const UpdateEvent = async (txId:string) => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        toast.loading('Updating event..')
    
        var tiersArray: tierInterface[] = [];
        tiers.forEach(function (tier) {
          var tierObj = {
            "name": tier.name,
            "capacity": tier.capacity,
            "price": tier.price
          };
          tiersArray.push(tierObj);
        });
    
    
        var artistArray: string[] = []
        selectedArtists?.map((artist) => (
          artistArray.push(artist.id)
        ))


    
        let primaryImgPromise = file===undefined?image1:postImg(file);
        let bgImgPromise = file===undefined?image2:postImg(filebg);
        let [primaryImg, bgImg] = await Promise.all([primaryImgPromise, bgImgPromise]);
        var images = [primaryImg, bgImg];
    
    
        let raw = JSON.stringify({
          "event": {
            "id": id,
            "name": eventTitle,
            "dateAndTime": getCurrentDateTimeFormatted(),
            "description": aboutEvent,
            "eventDuration": eventDuration,
            "categoryList": [
              selectedCategory
            ],
            "venueId": selectedVenue?.id,
            "artistList": artistArray,
            "tierList": tiersArray,
            "transactionId": txId,
          },
          "imgUrls": images,
        }
        )
    
        var requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: raw,
        }
    
        let response = await fetch(`${UpdateEventById}${id}`, requestOptions);
        let result = await response.json()
    
        console.log(response)
        console.log(result)
    
        if (response.ok) {
          setEventTitle('')
          setEventDate('')
          setEventTime('')
          setSelectedCategory('')
          setEventDuration('')
          setSelectedCity('')
          setSelectedVenue(undefined)
          setTiers([])
          setSelectedArtists([])
          setAboutEvent('')
          setFile(undefined)
          setFilebg(undefined)
          toast.dismiss();
          toast.success('Event updated successfully!');
          router.push('/organizer-profile');
        }
        else {
          toast.dismiss();
          toast.error('Failed to update event', result.statusMsg)
        }

    }



    const getVenuesByCity = async () => {
        try {
            const res = await fetch(`${GetVenuesByCity}${selectedCity}`);
            if (!res.ok) {
                throw new Error("Failed to fetch venues");
            }

            let result = await res.json()

            setVenueData(result)

            console.log(result);


        } catch (error) {
            console.log("Error loading venues: ", error);
        }
    }

    const getArtists = async () => {
        try {
            const res = await fetch(`${GetArtists}`);
            if (!res.ok) {
                throw new Error("Failed to fetch artists");
            }

            let result = await res.json()

            setArtistData(result);

            console.log(result);


        } catch (error) {
            console.log("Error loading artists: ", error);
        }
    }


    const getPlaces = async () => {
        try {
          const res = await fetch(`${GetAllPlaces}`);
          if (!res.ok) {
            throw new Error("Failed to fetch artists");
          }
    
          let result = await res.json()
          setCitiesData(result);
          console.log(result);
    
        } catch (error) {
          console.log("Error loading artists: ", error);
        }
      }
    


    const handleCancelClick = (e: any) => {
        e.preventDefault();
        setEventTitle(originalEventTitle);
        setEventDate(originalEventDate);
        setEventTime(originalEventTime);
        setEventDuration(originalEventDuration);
        setAboutEvent(originalAboutEvent);
        setTiers([...originalTiers]);
        setSelectedArtists([...originalSelectedArtists]);
        setSelectedVenue(originalSelectedVenue);
        setSelectedCategory(originalSelectedCategory);
        router.push('/organizer-profile')
    };





    const formatAMPM = (date: Date) => {
        let hours = date.getHours();
        let minutes: any = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ':00 ' + ampm;
        return strTime;
    };
    
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        let month: any = date.getMonth() + 1;
        let day: any = date.getDate();
    
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
    
        return year + '-' + month + '-' + day;
    };
    
    const getCurrentDateTimeFormatted = () => {
        const currentDate = new Date(eventDate + 'T' + eventTime);
        return formatDate(currentDate) + ' ' + formatAMPM(currentDate);
    };

    
    const previousHash = generateHash([originalEventTitle, originalEventDate, originalEventTime, originalEventDuration, originalAboutEvent, [...originalSelectedArtists], originalSelectedCategory])

    const newHash = generateHash([eventTitle, eventDate, eventTime, eventDuration, aboutEvent, [...selectedArtists], selectedCategory])




    const handleUpdateEvent = (e: any) => {
        e.preventDefault();

     
        if(!account){
          toast.dismiss()
          toast.error('You are not connected to wallet!')
        }
        else if(organizerData===null){
          toast.dismiss();
          toast.error("Please register as organizer..")
        }
        else if (eventTitle === '') {
            toast.dismiss();
            toast.error('Please enter event title');
        } else if (eventDate === '') {
            toast.dismiss();
            toast.error('Please enter event date');
        } else if (eventTime === '') {
            toast.dismiss();
            toast.error('Please enter event time');
        } else if (selectedCategory === '') {
            toast.dismiss();
            toast.error('Please select category');
        } else if (eventDuration === '') {
            toast.dismiss();
            toast.error('Please enter event duration');
        } else if (selectedCity === '') {
            toast.dismiss();
            toast.error('Please select city');
        } else if (selectedVenue === undefined) {
            toast.dismiss();
            toast.error('Please select venue');
        } else if (tiers.length < 1) {
            toast.dismiss();
            toast.error('Please add tiers');
        } else if (selectedArtists.length < 1) {
            toast.dismiss();
            toast.error('Please select artists');
        } else if (aboutEvent === '') {
            toast.dismiss();
            toast.error('Please enter about the event');
        }else if (aboutEvent.length <50) {
          toast.dismiss();
          toast.error('The About section requires a minimum of 50 words.');
        }
        else if (file === undefined && image1==='') {
          toast.dismiss();
          toast.error('Please upload primary image');
        } else if (filebg === undefined && image2==='') {
          toast.dismiss();
          toast.error('Please upload background image');
        }
        else {
            var tiersList: string[] = [];
            var tiersCapacity: number[] = []
            tiers.forEach((tier) => {
                tiersList.push(tier.name);
                tiersCapacity.push(tier.capacity);
            });
            updateEvent.signAndSend([previousHash, newHash]);
        }

    }

    

    return (
        <div className="mx-auto border dark:border-gray-600 border-gray-300 rounded-lg">
          previous: {previousHash} <br />
          new: {newHash}
          
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
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </div>
  
          <div className="mb-4">
            <label htmlFor="date" className="form-label block">
              Event Date
            </label>
            <input
              id="date"
              name="date"
              className="form-input dark:dark-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>
  
          <div className="mb-4">
            <label htmlFor="date" className="form-label block">
              Event Time
            </label>
            <input
              id="time"
              name="time"
              className="form-input dark:dark-date"
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
            />
          </div>
  
          <div className="mb-4">
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
              onChange={(e) => setEventDuration(e.target.value)}
              required
            />
          </div>
  
  
          <div className="mb-4">
            <div className='flex flex-col gap-4'>
              <SelectCityDropdown
                citiesData={citiesData}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
              />
            </div>
          </div>
  
          <div className={`mb-4`}>
            <AddNewVenueModal
              venueData={venueData}
              setVenueData={setVenueData}
              setSelectedVenue={setSelectedVenue}
              selectedCity={selectedCity}
            />
            <div className='flex flex-col gap-4'>
              <SelectVenueDropdown
                venueData={venueData}
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
            />
            <div className='flex flex-col'>
              <label className='form-label block'>
                Event Tiers
              </label>
  
              <div className={`flex flex-col gap-4`}>
                <div className={`flex flex-wrap gap-2 dark:border-gray-600 border-gray-300 border-2 rounded border-dashed min-h-[57px] p-1`}>
                  {tiers.length > 0 ?
                    tiers.map((tier, index) => {
                      return (
                        <div
                          key={index}
                          className='btn btn-outline-primary flex gap-4 justify-center items-center'
                          onClick={() => {
                            const newTiers = tiers?.filter((filterTier) => (filterTier !== tier))
                            setTiers(newTiers)
                          }}
                        >
                          {tier.name}
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
              artistData={artistData}
              setArtistData={setArtistData}
              selectedArtists={selectedArtists}
              setSelectedArtists={setSelectedArtists}
            />
            <div className='flex flex-col gap-4'>
              <SelectArtistDropdown
                artistData={artistData}
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
              onChange={(e) => setAboutEvent(e.target.value)}
              required
            ></textarea>
          </div>
  
          <div className='mb-4'>
            <ImageSelector
              title={"Primary Image"}
              file={file}
              setFile={setFile}
              imageU={image1}
              setImageU={setImage1}
            />
          </div>
  
          <div className='mb-4'>
            <ImageSelector
              title={"Background Image"}
              file={filebg}
              setFile={setFilebg}
              imageU = {image2}
              setImageU = {setImage2}
            />
          </div>
  
          <div className="col-span-2 flex gap-4 pl-1">
                    <button onClick={handleUpdateEvent} type="submit" className="btn btn-primary">
                        Update Event
                    </button>
                    <button onClick={handleCancelClick} className="btn btn-primary">
                        Cancel
                    </button>
            </div>

  
        </div>
      </div>
    )

}

export default UpdateEventForm;
