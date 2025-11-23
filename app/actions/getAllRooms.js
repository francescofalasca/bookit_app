'use server';

import { createAdminClient } from "@/lib/appwrite";
import { redirect } from 'next/navigation';

async function getAllRooms() {
    try {
        const { tables } = await createAdminClient();
        
        const { rows: rooms } = await tables.listRows(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_TABLE_ROOMS
        );

        return rooms;
    } catch (err) {
        console.error('Failed to get rooms', err);
        redirect('/error');
    }
};

export default getAllRooms;