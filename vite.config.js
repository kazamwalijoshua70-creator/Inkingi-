import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React setup — nothing Inkingi-specific is needed here.
// App.jsx reads its Supabase/Cloudinary config via import.meta.env.VITE_*
// (see .env / .env.example and SETUP.md), which Vite wires up automatically
// for any variable prefixed with VITE_.
export default defineConfig({
  plugins: [react()],
});
