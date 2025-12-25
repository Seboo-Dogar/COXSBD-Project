<<<<<<< HEAD
// // components/LanguageSwitcher.tsx (correct the filename and path)
// 'use client';

// import { usePathname, useRouter } from 'next/navigation';

// const languages = [
//   { code: 'en', label: 'EN' },
//   { code: 'bn', label: 'বাংলা' },
//   { code: 'ar', label: 'العربية' },
// ];

// export default function LanguageSwitcher() {
//   const pathname = usePathname();
//   const router = useRouter();
  
//   // Extract current locale from pathname
//   const pathSegments = pathname.split('/').filter(Boolean);
//   const currentLocale = pathSegments.length > 0 && ['en', 'bn', 'ar'].includes(pathSegments[0]) 
//     ? pathSegments[0] 
//     : 'en';

//   const handleChange = (locale: string) => {
//     let newPathname = pathname;

//     // If current path has a locale, replace it
//     if (['en', 'bn', 'ar'].includes(pathSegments[0])) {
//       newPathname = pathname.replace(`/${pathSegments[0]}`, `/${locale}`);
//     } else {
//       // If no locale in path, add it
//       newPathname = `/${locale}${pathname}`;
//     }

//     router.push(newPathname);
//   };

//   return (
//     <select
//       value={currentLocale}
//       onChange={(e) => handleChange(e.target.value)}
//       style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
//     >
//       {languages.map((lang) => (
//         <option key={lang.code} value={lang.code}>
//           {lang.label}
//         </option>
//       ))}
//     </select>
//   );
// }
// src/app/components/LanguageSwitcher.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LOCALES = ['en', 'bn'];

export default function LanguageSwitcher() {
  const pathname = usePathname() ?? '/en';

  function toLocalePath(path: string, target: string) {
    // if path is root or empty -> /target
    if (!path || path === '/') return `/${target}`;

    // If path starts with a locale like /en/..., replace it
    const match = path.match(/^\/(en|bn)(\/.*|$)/);
    if (match) {
      return `/${target}${match[2] || ''}`;
    }

    // otherwise prefix with the locale
    return `/${target}${path}`;
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={toLocalePath(pathname, l)}
          style={{ padding: '4px 8px', textDecoration: 'none' }}
        >
          {l.toUpperCase()}
=======
"use client";

import { usePathname } from "@/i18n/navigation";
import Link from "next/link";

const LOCALES = ["en", "bn"];

export default function LanguageSwitcher() {
  const pathname = usePathname() ?? "/en";

  return (
    <div className="flex gap-2">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={pathname.replace(/^\/(en|bn)/, `/${locale}`)}
          className="text-sm hover:underline"
        >
          {locale.toUpperCase()}
>>>>>>> 321ba94318003d811442e8ccdd31534bf1f69216
        </Link>
      ))}
    </div>
  );
}
