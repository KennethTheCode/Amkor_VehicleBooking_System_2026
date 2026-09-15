import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Amkor_VehicleBooking_System_2026/Frontend/',
  plugins: [
    tailwindcss(),
    react()
  ],
})