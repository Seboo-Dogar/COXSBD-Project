import RegisterForm from "@/components/register-form";

export default function RegisterPage() {
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
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">Get Started Today</h1>
            <p className="text-xl opacity-90">
              Create your account & get the best service!
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <RegisterForm />
      </div>
    </div>
  );
}
