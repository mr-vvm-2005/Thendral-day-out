/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/facilities', destination: '/#facilities', permanent: true },
      { source: '/gallery', destination: '/#gallery', permanent: true },
      { source: '/celebrations', destination: '/#celebrations', permanent: true },
      { source: '/availability', destination: '/#availability', permanent: true },
      { source: '/booking', destination: '/#availability', permanent: true },
      { source: '/faq', destination: '/#faq', permanent: true },
      { source: '/contact', destination: '/#location', permanent: true },
      { source: '/location', destination: '/#location', permanent: true },
    ];
  },
};

export default nextConfig;
