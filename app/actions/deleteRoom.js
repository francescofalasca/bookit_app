'use server';

import { createSessionClient } from "@/lib/appwrite";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Query } from 'node-appwrite';

async function deleteRoom(roomID) {
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

        // Find room to delete
        const roomToDelete = rooms.find(room => room.$id = roomID);

        // Delete room
        if (roomToDelete) {
            await tables.deleteRow(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
                process.env.NEXT_PUBLIC_APPWRITE_TABLE_ROOMS,
                roomToDelete.$id
            );
            
            // Revalidate my rooms and all rooms
            revalidatePath('/rooms/my', 'layout');
            revalidatePath('/', 'layout');
            
            return {
                success: true
            };
        } else {
            return {
                error: 'Room not found.'
            };
        }
    } catch (err) {
        console.error('Failed to delete room', err);

        return {
            error: 'Failed to delete room.'
        };
    }
};

export default deleteRoom;