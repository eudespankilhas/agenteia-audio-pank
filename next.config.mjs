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
  // Configuração de arquivos estáticos (usando a pasta public padrão do Next.js)
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
    ];
  },
  // Configuração para o Netlify
  output: 'standalone',
  // Configuração para otimizar o build
  experimental: {
    optimizePackageImports: ['@chakra-ui/react']
  },
  // Configuração do Netlify
  output: 'standalone',
  // Configuração de exportação
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuração de webpack
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false
    };
    return config;
  }
}

export default nextConfig
