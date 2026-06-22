import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Capas dos livros ficam num bucket público do Supabase Storage:
    // https://<project>.supabase.co/storage/v1/object/public/capas/...
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
