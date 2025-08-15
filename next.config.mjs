/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    ...(process.env.NODE_ENV === 'development' ? { unoptimized: true } : {}),
  },
};
export default nextConfig;
