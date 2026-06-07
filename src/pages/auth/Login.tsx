import { useState } from "react";
import { useNavigate } from "react-router";
import LoginForm from "../../components/organisms/auth/LoginForm";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (data: any) => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        setError(error.message || "Failed to log in. Please check your credentials.");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="login">
      <h1 className="text-4xl font-bold text-black mb-2">
        Log in to your account
      </h1>
      <p className="text-lg text-gray">
        Welcome back! Please enter your details.
      </p>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-4 p-3 rounded-xl bg-blue/5 border border-blue/10 text-blue text-sm font-semibold animate-pulse">
          Logging in...
        </div>
      )}

      <LoginForm onSubmitLogin={handleLogin} />
    </AuthLayout>
  );
};

export default Login;

