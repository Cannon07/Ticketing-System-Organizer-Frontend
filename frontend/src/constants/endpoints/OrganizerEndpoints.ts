import { BaseURL } from "./BaseURL";


// GET
export const GetOrganizerByWalletId = `${BaseURL}/organisers/registration?walletId=`;
export const GetOrganizerEvents =`${BaseURL}/organisers/events?id=`;

//POST
export const PostOrganizer = `${BaseURL}/organisers/`;
export const PostOrganizerEvent = `${BaseURL}/organisers/addEvent?id=`;


//PUT
export const UpdateOrganizerById = `${BaseURL}/organisers/update/id?id=`;

