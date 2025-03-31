/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "https://infinite-overly-bug.ngrok-free.app", // Add your Ngrok URL here
    ],
  },
};

export default nextConfig;
