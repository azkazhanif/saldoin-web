import React from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/atoms/button/Button";

const VerifyOtp = () => {
  const [otp, setOtp] = React.useState<string>("");

  return (
    <AuthLayout social={false}>
      <h1 className="text-4xl font-bold text-black mb-2">Verify OTP</h1>
      <p className="text-lg text-gray mb-2">
        Enter the OTP sent to your email address below to verify your account.
      </p>
      <form action="">
        <div className="flex space-x-2 justify-center mb-2">
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center border border-gray-300 rounded"
            value={otp[0] || ""}
            onChange={(e) => setOtp(e.target.value + otp.slice(1))}
          />
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center border border-gray-300 rounded"
            value={otp[1] || ""}
            onChange={(e) => setOtp(otp[0] + e.target.value + otp.slice(2))}
          />
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center border border-gray-300 rounded"
            value={otp[2] || ""}
            onChange={(e) =>
              setOtp(otp.slice(0, 2) + e.target.value + otp.slice(3))
            }
          />
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center border border-gray-300 rounded"
            value={otp[3] || ""}
            onChange={(e) => setOtp(otp.slice(0, 3) + e.target.value)}
          />
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center border border-gray-300 rounded"
            value={otp[4] || ""}
            onChange={(e) => setOtp(otp.slice(0, 4) + e.target.value)}
          />
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center border border-gray-300 rounded"
            value={otp[5] || ""}
            onChange={(e) => setOtp(otp.slice(0, 5) + e.target.value)}
          />
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center border border-gray-300 rounded"
            value={otp[6] || ""}
            onChange={(e) => setOtp(otp.slice(0, 6) + e.target.value)}
          />
        </div>
        <Button width="full" type="submit" variant="primary">
          Verify OTP
        </Button>
      </form>
      <p className="text-center mt-4">
        Don't receive the OTP?{" "}
        <a href="/auth/forgot-password" className="text-blue-500">
          Resend OTP
        </a>
      </p>
    </AuthLayout>
  );
};

export default VerifyOtp;
