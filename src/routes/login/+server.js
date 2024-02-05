// src/routes/login/+server.js

import { json } from '@sveltejs/kit';

/**
 * POST /login server-side endpoint
 */
export async function POST({ request, locals }) {
    try {
        // Extract email and password from the request body
        const { email, password } = await request.json();

        // Authenticate the user with PocketBase
        const { token, user } = await locals.pb.collection('users').authWithPassword(email, password);

        // Optionally, handle the token and user info as needed

        // Return success response
        return json({ message: 'Login successful', user });
    } catch (error) {
        // Handle errors (e.g., authentication failure, missing fields)
        return json({ message: 'Login failed', error: error.message }, { status: 401 });
    }
}
