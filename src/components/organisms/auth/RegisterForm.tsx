import { useState } from "react";
import Button from "../../atoms/button/Button";
import InputLabel from "../../molecules/form/InputLabel";
import InputPasswordLabel from "../../molecules/form/InputPasswordLabel";

interface RegisterFormProps {
  onSubmitRegister: (data: any) => void;
}

const RegisterForm = ({ onSubmitRegister }: RegisterFormProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [verifyPassword, setVerifyPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !verifyPassword) {
      alert("All fields are required!");
      return;
    }

    if (password !== verifyPassword) {
      alert("Passwords do not match!");
      return;
    }

    onSubmitRegister({ email, password, name, verifyPassword });
  };
  return (
    <form onSubmit={handleSubmit} className="mt-4 mb-4">
      <InputLabel
        id="name"
        name="name"
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <InputPasswordLabel
        id="verifyPassword"
        name="verifyPassword"
        label="Verify Password"
        value={verifyPassword}
        onChange={(e) => setVerifyPassword(e.target.value)}
      />
      <Button width="full" type="submit" variant="primary">
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;
