import LoginForm from "../../components/organisms/auth/LoginForm";
import AuthLayout from "../../layouts/AuthLayout";

const Login = () => {
  const handleLogin = (data: any) => {
    console.log("Login data:", data);
    // Implement login logic here, e.g., call API, handle response, etc.
  };
  return (
    <AuthLayout title="login">
      <h1 className="text-4xl font-bold text-black mb-2">
        Log in to your account
      </h1>
      <p className="text-lg text-gray">
        Welcome back! Please enter your details.
      </p>
      <LoginForm onSubmitLogin={handleLogin} />
    </AuthLayout>
  );
};

export default Login;
