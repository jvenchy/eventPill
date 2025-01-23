/** @type {import('next').NextConfig} */
import dotenv from 'dotenv'; // Load environment variables from .env file 
dotenv.config(); 
const nextConfig = { env: { JWT_SECRET: process.env.JWT_SECRET, }, }; 
export default nextConfig;