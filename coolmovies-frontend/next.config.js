/** @type {import('next').NextConfig} */
const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5001/graphql';

module.exports = {
  compiler: {
    emotion: true,
  },
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: GRAPHQL_URL,
      },
    ];
  },
  reactStrictMode: true,
};
