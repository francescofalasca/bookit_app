'use server';

import { createSessionClient } from "@/lib/appwrite";
import { cookies } from 'next/headers';

async function destroySession() {
    // Retrieve the session cookie
    const sessionCookie = (await cookies()).get('appwrite-session');

    if (!sessionCookie) {
        return {
            error: 'No session cookie found.'
        };
    }

    try {
        const { account } = await createSessionClient(sessionCookie.value);

        // Delete session
        await account.deleteSession('current');

        // Clear session cookie
        const cookieStore = await cookies();
        cookieStore.delete('appwrite-session');

        return {
            success: true
        };
    } catch (err) {
        return {
            error: 'Error deleting session.'
        };
    }
}

export default destroySession;