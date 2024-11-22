import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY);

export const getAllCategories = async () => {
    const { data, error } = await supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error('Error fetching categories', error);
        return [];
    }

    return data;
}

export const getAllProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products', error);
        return [];
    }

    return data;
}

export const getProduct = async (id) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error fetching product', error);
        return null;
    }

    return data;
}

export const getUser = async (id) => {
    const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, pfp')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error fetching user', error);
        return null;
    }

    return data;
}