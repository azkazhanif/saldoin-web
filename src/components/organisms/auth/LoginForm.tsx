import { useState } from "react";
import Button from "../../atoms/button/Button";
import CheckboxLabel from "../../molecules/form/CheckboxLabel";
import InputLabel from "../../molecules/form/InputLabel";
import { Link } from "react-router";
import InputPasswordLabel from "../../molecules/form/InputPasswordLabel";

interface LoginFormProps {
  onSubmitLogin: (data: any) => void;
}

const LoginForm = ({ onSubmitLogin }: LoginFormProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    onSubmitLogin({ email, password, remember });
  };
  return (
    <form onSubmit={handleSubmit} className="mt-4 mb-4">
      <InputLabel
        id="email"
        name="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputPasswordLabel
        id="password"
        name="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="mb-6 flex items-center justify-between">
        <CheckboxLabel
          id="remember"
          name="remember"
          label="Remember me"
          value={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <Link
          to="/auth/forgot-password"
          className="text-blue text-sm font-semibold hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <Button width="full" type="submit" variant="primary">
        Log In
      </Button>

    </form>
  );
};

export default LoginForm;
