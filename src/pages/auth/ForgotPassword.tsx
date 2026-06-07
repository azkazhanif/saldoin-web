import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import InputLabel from "../../components/molecules/form/InputLabel";
import Button from "../../components/atoms/button/Button";
import { useAuth } from "../../contexts/AuthContext";

const ForgotPassword = () => {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await sendPasswordReset(email);
      if (error) {
        setError(error.message || "Failed to send password reset link.");
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout social={false}>
      <h1 className="text-4xl font-bold text-black mb-2">
        Forgot your password?
      </h1>
      <p className="text-lg text-gray mb-4">
        Enter your email address below and we'll send you a link to reset your
        password.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-3 rounded-xl bg-blue/5 border border-blue/10 text-blue text-sm font-semibold animate-pulse">
          Sending reset link...
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-semibold animate-in fade-in">
          Password reset link sent! Please check your email inbox.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputLabel
          id="email"
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button width="full" type="submit" variant="primary">
          Send Reset Link
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;

