import AuthLayout from "../../layouts/AuthLayout";
import InputLabel from "../../components/molecules/form/InputLabel";
import { useState } from "react";
import Button from "../../components/atoms/button/Button";

const NewPassword = () => {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
  return (
    <AuthLayout social={false}>
      <h1 className="text-4xl font-bold text-black mb-2">New Password</h1>
      <p className="text-lg text-gray mb-2">
        Enter your new password below to reset your password and regain access
        to your account.
      </p>
      <form action="">
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
          Send Reset Link
        </Button>
      </form>
    </AuthLayout>
  );
};

export default NewPassword;
