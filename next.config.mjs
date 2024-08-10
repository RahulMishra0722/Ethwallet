/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        domains: ['i.pinimg.com'],
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
};

export default nextConfig;
