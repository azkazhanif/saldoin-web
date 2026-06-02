import SocialButton from "../atoms/button/SocialButton";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa6";

const SocialAuth = () => {
  return (
    <>
      <p className="text-center text-gray text-sm">Or continue with</p>
      <div className="grid grid-cols-3 gap-2 items-center justify-center mt-4">
        <SocialButton icon={<FaFacebook className="mx-auto" />} />
        <SocialButton icon={<FaGoogle className="mx-auto" />} />
        <SocialButton icon={<FaApple className="mx-auto" />} />
      </div>
    </>
  );
};

export default SocialAuth;
