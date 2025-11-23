'use server';

import { createAdminClient } from "@/lib/appwrite";
import { redirect } from 'next/navigation';

async function getSingleRoom(id) {
    try {
        const { tables } = await createAdminClient();
        
        const room = await tables.getRow(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_TABLE_ROOMS,
            id
        );

        return room;
    } catch (err) {
        console.error('Failed to get room', err);
        redirect('/error');
    }
};

export default getSingleRoom;