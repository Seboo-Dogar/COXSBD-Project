"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Heart,
  Clock,
  Calendar,
  FileText,
  Globe,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// Mock data for visa service
const visaData = {
  _id: "1",
  name: "United States Tourist Visa (B-2)",
  provider: "Global Visa Experts",
  price: 299,
  serviceFee: 99,
  governmentFee: 160,
  description:
    "Professional assistance with your US Tourist Visa application. Our experts will guide you through the entire process, from documentation to interview preparation, ensuring the highest chance of approval.",
  images: [
    "/images/visa.png",
    "/images/visa.png",
    "/images/visa.png",
    "/images/visa.png",
  ],
  rating: 4.8,
  reviews: 243,
  processingTime: "3-5 weeks",
  validity: "Up to 10 years",
  entryType: "Multiple entries",
  stayDuration: "Up to 6 months per visit",
  successRate: "98%",
  difficulty: "Medium",
  available: true,
  requiredDocuments: [
    "Passport (valid for 6+ months)",
    "DS-160 confirmation page",
    "Photo (5x5 cm, white background)",
    "Financial statements (6 months)",
    "Employment verification",
    "Travel itinerary",
    "Hotel reservations",
    "Previous visa history",
  ],
};

// Related visa services for recommendation section
const relatedServices = [
  {
    id: 2,
    name: "Schengen Visa Assistance",
    provider: "Europe Visa Solutions",
    price: 279,
    image: "/images/visa.png",
    processingTime: "2-4 weeks",
    rating: 4.7,
  },
  {
    id: 3,
    name: "UK Tourist Visa",
    provider: "British Visa Services",
    price: 349,
    image: "/images/visa.png",
    processingTime: "3-6 weeks",
    rating: 4.6,
  },
  {
    id: 4,
    name: "Australia eVisitor Visa",
    provider: "Pacific Visa Help",
    price: 199,
    image: "/images/visa.png",
    processingTime: "1-3 days",
    rating: 4.9,
  },
];

export default function VisaServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationStep, setApplicationStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    travelDate: "",
    passportNumber: "",
  });
    const { addToCart } = useCart();
  

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleApplyNow = () => {
    setShowApplicationModal(true);
    setApplicationStep(1);
  };

  const handleNextStep = () => {
    if (applicationStep < 4) {
      setApplicationStep(applicationStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (applicationStep > 1) {
      setApplicationStep(applicationStep - 1);
    }
  };

  const handleAddToCart = () => {
  addToCart({
    id: visaData._id,
    name: visaData.name,
    price: visaData.price,
    image: visaData.images[0],
    provider: visaData.provider,
    type: "visa", // useful to identify service type later
  });

  alert(`${visaData.name} added to cart!`);
};


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Visa application submitted successfully! We'll contact you at ${formData.email} within 24 hours.`);
    setShowApplicationModal(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      nationality: "",
      travelDate: "",
      passportNumber: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navigateToService = (serviceId: string) => {
    router.push(`/visa-services/${serviceId}`);
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button onClick={() => router.push("/")} className="hover:text-blue-600">Home</button>
              <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <button onClick={() => router.push("/visa-services")} className="hover:text-blue-600">Visa Services</button>
              <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-blue-600">{visaData.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={visaData.images[selectedImage]}
                alt={visaData.name}
                fill
                className="object-cover"
                priority
              />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>
              {!visaData.available && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {visaData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {visaData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt={`${visaData.name} view ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{visaData.name}</h1>
                <p className="text-gray-500 text-lg">{visaData.provider}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
                  ${visaData.price}
                  <span className="text-base font-normal text-gray-500"> service fee</span>
                </p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">{visaData.rating}</span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">{visaData.reviews} reviews</span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <Globe className="w-5 h-5 mr-1" />
              <span>Visa assistance for United States</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">{visaData.description}</p>

            {/* Visa Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Processing Time</p>
                  <p className="font-medium">{visaData.processingTime}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <FileText className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Validity</p>
                  <p className="font-medium">{visaData.validity}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Entry Type</p>
                  <p className="font-medium">{visaData.entryType}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="font-medium">{visaData.successRate}</p>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Pricing Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium">${visaData.serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Government fee</span>
                  <span className="font-medium">${visaData.governmentFee}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-blue-600">${visaData.price}</span>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Required Documents</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {visaData.requiredDocuments.map((document, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-5 h-5 text-blue-500 mr-2 flex items-center justify-center">•</div>
                    <span>{document}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleApplyNow}
                disabled={!visaData.available}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {visaData.available ? "Apply Now" : "Not Available"}
              </button>
              <button onClick={handleAddToCart} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Application Process Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: 1, title: "Submit Application", desc: "Fill out our simple online form" },
              { step: 2, title: "Document Review", desc: "Our experts verify your documents" },
              { step: 3, title: "Application Filing", desc: "We submit your application to authorities" },
              { step: 4, title: "Visa Approval", desc: "Receive your visa and travel plans" },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Services Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Other Visa Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((service) => (
              <motion.div
                key={service.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToService(service.id.toString())}
              >
                <div className="relative h-48">
                  <Image src={service.image} alt={service.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-gray-500">{service.provider}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">{service.rating}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{service.processingTime}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">From</span>
                    <p className="text-blue-600 font-bold">${service.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        FAQ Section
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "How long does the visa process take?",
                answer: "The complete process typically takes 3-5 weeks, including documentation preparation, appointment booking, and processing time."
              },
              {
                question: "What is your success rate?",
                answer: "We have a 98% success rate for US tourist visas. In rare cases of rejection, we offer a partial refund of our service fee."
              },
              {
                question: "Do I need to attend an interview?",
                answer: "Yes, for US tourist visas, most applicants between 14-79 years need to attend a consular interview. We provide comprehensive interview preparation."
              },
              {
                question: "Can you guarantee visa approval?",
                answer: "While we cannot guarantee approval due to government authority decisions, we maximize your chances through careful documentation and preparation."
              }
            ].map((faq, index) => (
              <div key={index} className="border rounded-xl overflow-hidden">
                <button className="w-full p-4 text-left font-medium bg-gray-50 hover:bg-gray-100 flex justify-between items-center">
                  {faq.question}
                  <svg className="w-5 h-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="p-4 bg-white">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Application Modal */}
        <AnimatePresence>
          {showApplicationModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
              >
                <h2 className="text-2xl font-bold mb-4">Apply for {visaData.name}</h2>

                {/* Progress Steps */}
                <div className="flex justify-between mb-6 relative">
                  <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 z-0"></div>
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${applicationStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {step}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs whitespace-nowrap hidden md:block">
                        Step {step}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Steps */}
                {applicationStep === 1 && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                )}

                {applicationStep === 2 && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <select
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select your nationality</option>
                        <option value="us">United States</option>
                        <option value="uk">United Kingdom</option>
                        <option value="ca">Canada</option>
                        <option value="au">Australia</option>
                        <option value="de">Germany</option>
                        <option value="fr">France</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                      <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Intended Travel Date</label>
                      <input
                        type="date"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                )}

                {applicationStep === 3 && (
                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium mb-2">Please confirm your information:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                      <p><span className="font-medium">Email:</span> {formData.email}</p>
                      <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                      <p><span className="font-medium">Nationality:</span> {formData.nationality}</p>
                      <p><span className="font-medium">Passport:</span> {formData.passportNumber}</p>
                      <p><span className="font-medium">Travel Date:</span> {formData.travelDate}</p>
                    </div>
                    <div className="flex items-start">
                      <input type="checkbox" id="terms" className="mt-1 mr-2" required />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the terms and conditions and privacy policy. I confirm that all information provided is accurate.
                      </label>
                    </div>
                  </div>
                )}

                {applicationStep === 4 && (
                  <div className="text-center mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Ready to Submit!</h3>
                    <p className="text-gray-600 mb-4">Please review your information and submit your application. Our visa expert will contact you within 24 hours.</p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg text-left">
                      <h4 className="font-medium mb-2">What happens next?</h4>
                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        <li>You'll receive a confirmation email</li>
                        <li>Our visa expert will contact you</li>
                        <li>We'll guide you through document collection</li>
                        <li>We'll schedule your appointment</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {applicationStep > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  
                  {applicationStep < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleFormSubmit}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Submit Application
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <NewsletterSignup /><br /><br />
      <Footer />
    </>
  );
}