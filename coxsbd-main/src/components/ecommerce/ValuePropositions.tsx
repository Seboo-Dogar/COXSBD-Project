import { FaShippingFast, FaUndo, FaShieldAlt, FaHeadset } from "react-icons/fa";

export default function ValuePropositions() {
  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FaShippingFast, title: "Free Shipping", text: "On orders over $50" },
          { icon: FaUndo, title: "Easy Returns", text: "30-day return policy" },
          { icon: FaShieldAlt, title: "Secure Payment", text: "Safe and encrypted" },
          { icon: FaHeadset, title: "24/7 Support", text: "Dedicated support" },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-center text-center p-4">
            <Icon className="text-3xl text-red-600 mb-2" />
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
