'use server';

import { createSessionClient } from "@/lib/appwrite";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from "next/cache";
import checkAuth from "./checkAuth";


async function cancelBooking(bookingID) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');

    if (!sessionCookie) {
        redirect('/login');
    }
    
    try {
        const { tables } = await createSessionClient(sessionCookie.value);

        // Get user
        const { user } = await checkAuth();
        

        if (!user) {
            return {
                error: 'You must be logged in to cancel a booking.'
            };
        }
        
        // Get booking
        const booking = await tables.getRow(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_TABLE_BOOKINGS,
            bookingID
        );

        // Check if booking belongs to current user
        if (booking.user_id !== user.id) {
            return {
                error: 'You are not authorized to delete this booking.'
            };
        }

        // Delete booking
        await tables.deleteRow(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_TABLE_BOOKINGS,
            bookingID
        );

        revalidatePath('/bookings', 'layout');

        return {
            success: true
        };

    } catch (err) {
        console.error('Failed to delete booking', err);
        return {
            error: 'Failed to delte booking.'
        };
    }
};

export default cancelBooking;