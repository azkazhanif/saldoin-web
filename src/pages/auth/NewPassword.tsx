import { useState } from "react";
import { useNavigate } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import InputLabel from "../../components/molecules/form/InputLabel";
import Button from "../../components/atoms/button/Button";
import { useAuth } from "../../contexts/AuthContext";

const NewPassword = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error } = await updatePassword(password);
      if (error) {
        setError(error.message || "Failed to update your password.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
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
      <h1 className="text-4xl font-bold text-black mb-2">New Password</h1>
      <p className="text-lg text-gray mb-4">
        Enter your new password below to reset your password and regain access
        to your account.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-3 rounded-xl bg-blue/5 border border-blue/10 text-blue text-sm font-semibold animate-pulse">
          Updating password...
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-semibold animate-in fade-in">
          Password updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputLabel
          id="password"
          name="password"
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputLabel
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button width="full" type="submit" variant="primary">
          Update Password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default NewPassword;

