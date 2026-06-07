import { useState } from "react";
import { useNavigate } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import RegisterForm from "../../components/organisms/auth/RegisterForm";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async (data: any) => {
    setError(null);
    setLoading(true);
    try {
      const { error, data: signUpData } = await signUp(data.email, data.password, data.name);
      if (error) {
        setError(error.message || "Failed to register account.");
      } else {
        setSuccess(true);
        // Check if session is auto-established
        if (signUpData?.session) {
          navigate("/dashboard");
        } else {
          // Redirect to verify-otp with email parameter
          navigate(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
        }
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="register">
      <h1 className="text-4xl font-bold text-black mb-2">
        Create your account
      </h1>
      <p className="text-lg text-gray">Join us! Please enter your details.</p>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-4 p-3 rounded-xl bg-blue/5 border border-blue/10 text-blue text-sm font-semibold animate-pulse">
          Registering account...
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-semibold">
          Registration successful! Redirecting...
        </div>
      )}

      <RegisterForm onSubmitRegister={handleRegister} />
    </AuthLayout>
  );
};

export default Register;

