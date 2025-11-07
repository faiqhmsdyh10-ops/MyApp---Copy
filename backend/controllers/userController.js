import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔹 GET semua user
export const getUsers = async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    console.error("❌ Error fetching users:", error.message);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
};

// 🔹 POST tambah user
export const createUser = async (req, res) => {
  const { nama, email, password, no_hp, alamat, role } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ error: "Nama, email, dan password wajib diisi" });
  }

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        nama,
        email,
        password,
        no_hp,
        alamat,
        role: role || "donatur",
        status: true,
      },
    ])
    .select();

  if (error) {
    console.error("❌ Error inserting user:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
};
