import type React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: "About Us",
      links: [
        "Company Overview",
        "Our History",
        "Leadership Team",
        "Careers",
        "Press Releases",
      ],
    },
    {
      title: "Customer Services",
      links: [
        "Help Center",
        "Contact Us",
        "How to Buy",
        "Shipping & Delivery",
        "Product Recalls",
      ],
    },
    {
      title: "Business Services",
      links: [
        "Sell on MyCoxsBD",
        "Supplier Memberships",
        "Learning Center",
        "Partner Program",
      ],
    },
    {
      title: "Trade Services",
      links: [
        "Trade Assurance",
        "Business Identity",
        "Logistics Services",
        "Production Monitoring",
      ],
    },
  ];

  return (
    <footer className="text-slate-300">
      {/* Main Footer */}
      <div className="bg-slate-800 py-12">
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-full xl:max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <div className="font-bold text-xl text-white mb-4">
                  <span className="bg-red-600 text-white px-2 py-1 rounded-md mr-1">
                    My
                  </span>
                  CoxsBD
                </div>
                <p className="text-sm mb-4">
                  Your trusted partner for global trade, connecting buyers and
                  suppliers worldwide since 1999.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-red-400" />
                  <span className="text-sm">contact@mycoxsbd.com</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-red-400" />
                  <span className="text-sm">+1 (800) 555-1234</span>
                </div>
                <div className="flex items-start">
                  <MapPin size={16} className="mr-2 mt-1 text-red-400" />
                  <span className="text-sm">
                    123 Trade Center, Business District, Coxs Bazar, Bangladesh
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href="#"
                        className="text-sm text-slate-300 hover:text-red-400 transition duration-200"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social media and payment methods */}
      <div className="bg-red-600 py-6">
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-full xl:max-w-[1280px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div className="flex justify-center md:justify-start space-x-4 md:space-x-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-slate-200 transition duration-200"
                aria-label="Facebook"
              >
                <Facebook size={22} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-slate-200 transition duration-200"
                aria-label="Twitter"
              >
                <Twitter size={22} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-slate-200 transition duration-200"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-slate-200 transition duration-200"
                aria-label="YouTube"
              >
                <Youtube size={22} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-slate-200 transition duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={22} />
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-slate-200 transition duration-200"
                aria-label="Website"
              >
                <Globe size={22} />
              </a>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-4 items-center mt-4 md:mt-0">
              <img
                src="https://static-00.iconduck.com/assets.00/visa-icon-2048x1313-o6hi8q5l.png"
                alt="Visa"
                className="h-7 rounded px-1"
              />
              <img
                src="https://static-00.iconduck.com/assets.00/mastercard-icon-2048x1286-s6y46dfh.png"
                alt="Mastercard"
                className="h-7 rounded px-1"
              />
              <img
                src="https://static-00.iconduck.com/assets.00/amex-icon-1024x643-v5cuc08d.png"
                alt="American Express"
                className="h-7 rounded px-1"
              />
              <img
                src="https://freelogopng.com/images/all_img/1656227518bkash-logo-png.png"
                alt="bKash"
                className="h-7 bg-white rounded px-1"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8e4SixYh3d4Me6HuncJHAA60BCGS6HFx-kQ&s"
                alt="Apple Pay"
                className="h-7 bg-white rounded px-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-red-800 py-4">
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-full xl:max-w-[1280px] text-center text-xs text-slate-200">
          © 1999-2025 MyCoxsBD.com. All rights reserved. This is a
          demonstration website.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
