import { BaseURL } from "./BaseURL";

//Get
export const GetEventById = `${BaseURL}/events/id?id=`
export const GetEventsByCity = `${BaseURL}/events/city?city=`

// Post
export const PostEvent = `${BaseURL}/events/`;

//Put
export const UpdateEventById = `${BaseURL}/events/update/id?id=`