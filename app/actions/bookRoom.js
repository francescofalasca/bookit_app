'use server';

import { createSessionClient } from "@/lib/appwrite";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from "next/cache";
import { ID } from 'node-appwrite';
import checkAuth from "./checkAuth";
import checkRoomAvailability from "./checkRoomAvailability";

async function bookRoom(previousState, formData) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');

    if (!sessionCookie) {
        redirect('/login');
    }

    try {
        const { tables } = await createSessionClient(sessionCookie.value);

        // Get user ID
        const { user } = await checkAuth();

        if (!user) { 
            return {
                error: 'You must be logged in to book a room.'
            };
        }
        
        // Extract date and time from formData
        const checkInDate = formData.get('check_in_date');
        const checkInTime = formData.get('check_in_time');
        const checkOutDate = formData.get('check_out_date');
        const checkOutTime = formData.get('check_out_time');
        const roomID = formData.get('room_id');
        
        // Combine date and time to ISO 8601 format
        const checkInDateTime = `${checkInDate}T${checkInTime}`;
        const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;
        
        // Check if room is available
        const isAvailable = await checkRoomAvailability(roomID, checkInDateTime, checkOutDateTime);

        if (!isAvailable) {
            return {
                error: 'This room is already booked for the selected time.'
            };
        }

        const bookingData = {
            check_in: checkInDateTime,
            check_out: checkOutDateTime,
            user_id: user.id,
            room_id: roomID
        };

        console.log(bookingData.room_id);

        // Create booking
        const newBooking = await tables.createRow(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_TABLE_BOOKINGS,
            ID.unique(),
            bookingData
        );

        // Revalidate cache
        revalidatePath('/', 'layout');

        return {
            success: true
        };
    } catch (err) {
        console.error('Failed to book room', err);

        return {
            error: 'Something went wrong booking the room.'
        }
    }
};

export default bookRoom;