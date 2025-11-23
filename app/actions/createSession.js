'use server';

import { createAdminClient } from "@/lib/appwrite";
import { cookies } from 'next/headers';

async function createSession(previousState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return {
            error: 'Please fill in all fields'
        };
    }

    // Get account instance
    const { account } = await createAdminClient();

    try {
        // Generate session
        const session = await account.createEmailPasswordSession(email, password);
        
        // Create cookie
        const cookieStore = await cookies();
        cookieStore.set('appwrite-session', session.secret, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(session.expire),
            path: '/'
        });

        return {
            success: true
        };
    } catch (err) {
        console.log('Authentication Error: ', err);
        return {
            error: 'Invalid Credentials'
        };
    }
}

export default createSession;