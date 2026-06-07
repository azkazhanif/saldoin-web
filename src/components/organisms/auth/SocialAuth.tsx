import { useState } from "react";
import { FaGoogle } from "react-icons/fa6";
import SocialButton from "../../atoms/button/SocialButton";
import { useAuth } from "../../../contexts/AuthContext";

const SocialAuth = () => {
  const { signInWithOAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleOAuthLogin = async () => {
    setError(null);
    try {
      const { error } = await signInWithOAuth("google");
      if (error) {
        setError(error.message || "Failed to sign in with Google.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred during Google sign in.");
      console.error(err);
    }
  };

  return (
    <div className="mt-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray font-bold tracking-wider">Or continue with</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in">
          {error}
        </div>
      )}

      <div className="flex flex-col">
        <SocialButton 
          icon={
            <div className="flex items-center justify-center gap-2">
              <FaGoogle className="text-base" />
              <span className="text-sm font-bold">Sign in with Google</span>
            </div>
          } 
          onClick={handleOAuthLogin} 
        />
      </div>
    </div>
  );
};

export default SocialAuth;


