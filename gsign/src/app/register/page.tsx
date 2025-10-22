import RegistrationForm from "@/containers/form/RegistrationForm";

const RegisterPage = () => {
    return (
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] max-h-[800px]">
                    {/* Left: Image Section */}
                    <div className="relative lg:w-2/5 h-64 lg:h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                            <div className="text-center text-white p-8">
                                <h2 className="text-3xl font-bold mb-4">Join Our Platform</h2>
                                <p className="text-xl opacity-90">
                                    Create your account and start your patent application journey.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form Section */}
                    <div className="lg:w-3/5 flex flex-col p-4 lg:p-6">
                        <div className="max-w-2xl mx-auto w-full overflow-y-auto max-h-full pr-2">
                            <RegistrationForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;