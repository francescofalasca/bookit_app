'use server';

import { createSessionClient } from "@/lib/appwrite";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';

async function getMyRooms() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');

    if (!sessionCookie) {
        redirect('/login');
    }
    
    try {
        const { tables, account } = await createSessionClient(sessionCookie.value);

        // Get user ID
        const user = await account.get();
        const userID = user.$id;
        
        // Fetch user rooms
        const { rows: rooms } = await tables.listRows(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_TABLE_ROOMS,
            [Query.equal('user_id', userID)]
        );

        return rooms;
    } catch (err) {
        console.error('Failed to get user rooms', err);
        redirect('/error');
    }
};

export default getMyRooms;