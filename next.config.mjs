/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações para o Vercel
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'extensions.aitopia.ai'],
    unoptimized: true,
    loader: 'default',
    path: '/_next/image',
    minimumCacheTTL: 60,
  },
  // Configuração de arquivos estáticos
  staticFileDirectories: ['public'],
  // Desativa a pré-renderização estática para evitar erros durante o build
  output: 'standalone',
  // Otimizações para o Supabase
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuração de webpack
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
}

export default nextConfig
