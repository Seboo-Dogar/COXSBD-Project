// "use client";

// import { useTranslations } from "next-intl";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import HeroBanner from "@/components/HeroBanner";
// import CategoryBanner from "@/components/CategoryBanner";
// import SupplierShowcase from "@/components/SupplierShowcase";
// import RequestQuotation from "@/components/RequestQuotation";
// import TrustBadges from "@/components/TrustBadges";
// import MobileHomePage from "@/components/sections/mobile";

// type Props = {
//   locale: string;
// };

// export default function HomePageLayout({ locale }: Props) {
//   const t = useTranslations("Index"); // Loads translations from messages/en.json or bn.json

//   // Example usage of translations
//   console.log("Current locale:", locale);
//   console.log("Page title:", t("title"));
//   console.log("Page description:", t("description"));

//   return (
//     <>
//       {/* Desktop layout */}
//       <div className="min-h-screen bg-gray-100 hidden md:block">
//         <Header />
//         <main>
//           <HeroBanner />
//           <CategoryBanner />
//           <TrustBadges />
//           <SupplierShowcase />
//           <RequestQuotation />
//         </main>
//         <Footer />
//       </div>

//       {/* Mobile layout */}
//       <MobileHomePage />
//     </>
//   );
// }
