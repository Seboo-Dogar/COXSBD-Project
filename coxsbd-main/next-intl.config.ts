// next-intl.config.ts
/** @type {import('next-intl').NextIntlConfig} */
const nextIntlConfig = {
  locales: ["en", "bn"],
  defaultLocale: "bn",
  pages: {
    "*": ["Index"], // load Index namespace on all pages
  },
};

export default nextIntlConfig;
