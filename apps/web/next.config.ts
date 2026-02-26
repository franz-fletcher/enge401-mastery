import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@enge401-mastery/math-engine',
    '@enge401-mastery/exercise-generator',
    '@enge401-mastery/spaced-repetition',
  ],
};

export default nextConfig;
