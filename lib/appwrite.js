import { Client, TablesDB, Account, Storage } from 'node-appwrite';

// Admin Client
const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
        .setKey(process.env.NEXT_APPWRITE_KEY);
    
    return {
        get account() {
            return new Account(client);
        },
        get tables() {
            return new TablesDB(client);
        },
        get storage() {
            return new Storage(client);
        }
    };
};

// Session Client
const createSessionClient = async (session) => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
    
    if (session) {
        client.setSession(session);
    }
    
    return {
        get account() {
            return new Account(client);
        },
        get tables() {
            return new TablesDB(client);
        }
    };
};

export { createAdminClient, createSessionClient };