import React from "react";

const Login = () => {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-blue"></div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-md">
          <h1 className="text-4xl font-bold text-black mb-2">
            Log in to your account
          </h1>
          <p className="text-lg text-gray">
            Welcome back! Please enter your details.
          </p>
          <form action="" className="mt-4">
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                autoComplete="off"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded-md"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue text-white p-2 rounded-md mt-4"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
