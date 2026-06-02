import AuthLayout from "../../layouts/AuthLayout";
import RegisterForm from "../../components/organisms/form/RegisterForm";

const Register = () => {
  const handleRegister = (data: any) => {
    console.log("Register data:", data);
  };

  return (
    <AuthLayout>
      <h1 className="text-4xl font-bold text-black mb-2">
        Create your account
      </h1>
      <p className="text-lg text-gray">Join us! Please enter your details.</p>
      <RegisterForm onSubmitRegister={handleRegister} />
    </AuthLayout>
  );
};

export default Register;
