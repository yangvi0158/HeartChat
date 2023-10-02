/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "heartchat-repo.s3.eu-west-2.amazonaws.com",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
  output: 'standalone'
};

module.exports = nextConfig;
