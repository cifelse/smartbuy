import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs"; // Import bcrypt for hashing

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
);

// Helper function to hash a value
const hashValue = async (value) => {
  const saltRounds = 10; // Define salt rounds for bcrypt
  return await bcrypt.hash(value, saltRounds);
};

export const getAllCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("Error fetching categories", error);
    return [];
  }

  return data;
};

export const getAllProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products", error);
    return [];
  }

  return data;
};

export const getProduct = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching product", error);
    return null;
  }

  return data;
};

export const getUser = async (id) => {
  const { data, error } = await supabase
    .from("sellers")
    .select("first_name, last_name, pfp")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user", error);
    return null;
  }

  return data;
};

// Function to create a new user with hashed password and security answer
export const createUser = async ({ username, email, firstName, lastName, password, securityQuestion, securityAnswer }) => {
  try {
    // Hash password and security answer
    const hashedPassword = await hashValue(password);
    const hashedAnswer = await hashValue(securityAnswer);

    // Insert into Supabase
    const { data, error } = await supabase.from("users").insert({
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      password: hashedPassword,
      security_question: securityQuestion,
      security_answer: hashedAnswer,
    });

    if (error) {
      console.error("Error creating user", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error hashing password or security answer", error);
    return null;
  }
};
