import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/atoms/button/Button";
import { useAuth } from "../../contexts/AuthContext";

const VerifyOtp = () => {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Focus next field if value is entered
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (!otp[index] && index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length === 6 && !isNaN(Number(pastedData))) {
      const otpArray = pastedData.split("");
      setOtp(otpArray);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length < 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    if (!email) {
      setError("No email address provided to verify.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error } = await verifyOtp(email, token);
      if (error) {
        setError(error.message || "Invalid OTP code. Please try again.");
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
      <h1 className="text-4xl font-bold text-black mb-2">Verify OTP</h1>
      <p className="text-lg text-gray mb-6">
        Enter the OTP sent to <span className="font-semibold text-black">{email || "your email"}</span> below to verify your account.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-3 rounded-xl bg-blue/5 border border-blue/10 text-blue text-sm font-semibold animate-pulse">
          Verifying code...
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-semibold animate-in fade-in">
          Account verified successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3 justify-center mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className="w-12 h-12 text-center text-lg font-bold border border-gray-200 focus:border-blue focus:ring-2 focus:ring-blue/10 rounded-xl bg-gray-50 focus:bg-white outline-none transition-all"
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={idx === 0 ? handlePaste : undefined}
            />
          ))}
        </div>
        <Button width="full" type="submit" variant="primary">
          Verify OTP
        </Button>
      </form>
      <p className="text-center mt-6 text-sm text-gray">
        Didn't receive the OTP?{" "}
        <a href="/auth/forgot-password" className="text-blue font-semibold hover:underline">
          Resend OTP
        </a>
      </p>
    </AuthLayout>
  );
};

export default VerifyOtp;

