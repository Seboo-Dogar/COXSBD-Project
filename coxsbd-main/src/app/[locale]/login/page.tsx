import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Image Section */}
      <div className="hidden md:flex md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-600 opacity-90"></div>
        <img
          src="/images/loginBackground.jpg"
          alt="Server hosting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
            <p className="text-xl opacity-90">
              Manage all your digital services from a single website — Rent Car
              — Rent Bus — Buy Flight Ticket — Book Hotel — Buy Tour Package —
              Apply Visa — Ecommerce — Choose Hosting Plan — Configure Server —
              Deploy Cloud VPS — Register Domain — Buy Script — Connect WiFi —
              Apply License — Get Offer
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <LoginForm />
      </div>
    </div>
  );
}
