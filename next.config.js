/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = __dirname + '/app';
    return config;
  },
};

module.exports = nextConfig;
