import AuthLayout from "../../layouts/AuthLayout";
import InputLabel from "../../components/molecules/form/InputLabel";
import Button from "../../components/atoms/button/Button";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  return (
    <AuthLayout social={false}>
      <h1 className="text-4xl font-bold text-black mb-2">
        Forgot your password?
      </h1>
      <p className="text-lg text-gray">
        Enter your email address below and we'll send you a link to reset your
        password.
      </p>
      <form action="">
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
