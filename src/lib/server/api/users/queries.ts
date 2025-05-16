// src/lib/server/api/users/queries.ts
import { supabase } from '$lib/server/db/client';

export async function getUserById(id: string) {
	const { data, error } = await supabase
		.from('users')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw new Error(`Database error: ${error.message}`);

	return data;
}

export async function getUsersByEmailPattern(pattern: string, limit = 10) {
	const { data, error } = await supabase
		.from('users')
		.select('*')
		.ilike('email', `%${pattern}%`)
		.limit(limit);

	if (error) throw new Error(`Database error: ${error.message}`);

	return data || [];
}