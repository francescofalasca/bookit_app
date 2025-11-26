'use server';

import { createSessionClient } from "@/lib/appwrite";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { DateTime } from 'luxon';

// Convert a date string to a Luxon DateTime Object in UTC
function toUTCDateTime(dateString) {
    return DateTime.fromISO(dateString, { zone: 'UTC'}).toUTC();
}

// Check for overlapping date ranges
function dateRangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
    return checkInA < checkOutB && checkOutA > checkInB;
}

async function checkRoomAvailability(roomID, checkIn, checkOut) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');

    if (!sessionCookie) {
        redirect('/login');
    }
    
    try {
        const { tables } = await createSessionClient(sessionCookie.value);

        const checkInDateTime = toUTCDateTime(checkIn);
        const checkOutDateTime = toUTCDateTime(checkOut);

        // Fetch all bookings for a given room
        const { rows: bookings } = await tables.listRows(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_TABLE_BOOKINGS,
            [Query.equal('room_id', roomID)]
        );

        // Loop over bookings and check for overlaps
        for (const booking of bookings) {
            const bookingCheckInDateTime = toUTCDateTime(booking.check_in);
            const bookingCheckOutDateTime = toUTCDateTime(booking.check_out);

            if (dateRangesOverlap(
                checkInDateTime,
                checkOutDateTime,
                bookingCheckInDateTime,
                bookingCheckOutDateTime
            )) {
                return false;
            }
        }

        // No overlap found, continue to book
        return true;
    } catch (err) {
        console.error('Failed to check availability.', err);

        return {
            error: 'Failed to check availability.'
        };
    }
};

export default checkRoomAvailability;