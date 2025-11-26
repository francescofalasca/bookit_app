'use server';

import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import checkAuth from "./checkAuth";

async function getMyBookings() {
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
                error: 'You must be logged in to see the bookings.'
            };
        }
        
        // Fetch user bookings
        const { rows: bookings } = await tables.listRows(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_TABLE_BOOKINGS,
            [Query.equal('user_id', user.id)]
        );

        // Fetch room details for each booking using admin client
        const { tables: adminTables } = await createAdminClient();
        const bookingsWithRooms = await Promise.all(
            bookings.map(async (booking) => {
                try {
                    const room = await adminTables.getRow(
                        process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
                        process.env.NEXT_PUBLIC_APPWRITE_TABLE_ROOMS,
                        booking.room_id
                    );
                    return { ...booking, room };
                } catch (err) {
                    console.warn(`Room ${booking.room_id} not found`);
                    return { ...booking, room: null };
                }
            })
        );

        return bookingsWithRooms;
    } catch (err) {
        console.error('Failed to get user bookings.', err);

        return {
            error: 'Failed to get bookings.'
        };
    }
};

export default getMyBookings;