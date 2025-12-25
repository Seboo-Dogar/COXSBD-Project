import createNextIntlPlugin from 'next-intl/plugin';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: [
      "img.classistatic.de",
      "cdn.freebiesupply.com",
      "images.unsplash.com",
      "images.pexels.com",
      "media.istockphoto.com",
      "cdn.mos.cms.futurecdn.net",
      "t4.ftcdn.net",
      "wallpapers.com",
      "png.pngtree.com",
      "i.ibb.co",
      "via.placeholder.com",      // <--- Added for car images
      "static-00.iconduck.com"    // <--- Added for Amex icon
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);