import React, { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { academyLogo, loginImg } from "public";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login: React.FunctionComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/student-dashboard");
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: loginData.email,
      password: loginData.password,
      role: loginData.role,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/student-dashboard");
    }
  };

  return (
    <div className="max-w-screen font-poppins flex h-screen w-screen items-center justify-center bg-white">
      <div className="relative hidden h-full max-h-full w-3/5 bg-cyan-500 md:block">
        <Image
          src={loginImg}
          alt="login-page-section-image"
          className="max-h-full w-full"
        />
        <div className="absolute inset-0 w-full bg-blue-500 opacity-50"></div>
      </div>
      <div className="flex h-full max-h-full w-full items-center justify-center md:w-2/5">
        <div className="flex w-full flex-col gap-4">
          <div className="academy-logo-section flex justify-center">
            <Image
              src={academyLogo as StaticImageData}
              alt="Pro IQ Academy Logo"
              className="h-[118px] w-[103px]"
            />
          </div>
          <h1 className="font-poppins mt-12 text-center text-3xl font-medium text-gray-700 underline underline-offset-8">
            SIGN IN
          </h1>
          <div className="mb-3 flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8">
              <form onSubmit={handleSubmit}>
                <div className="relative mb-6 flex justify-center">
                  <FaUser className="absolute right-[4em] top-1/2 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-3/4 rounded-lg border border-gray-300 px-3 py-3 text-xs shadow-sm focus:border-[#202B5D] focus:outline-none focus:ring-2 focus:ring-[#202B5D]"
                    placeholder="Email"
                  />
                </div>
                <div className="relative mb-6 flex justify-center">
                  <FaUser className="absolute right-[4em] top-1/2 -translate-y-1/2 transform text-gray-400" />
                  <select
                    name="role"
                    value={loginData.role}
                    onChange={handleChange}
                    className={`mt-1 block w-3/4 appearance-none  rounded-lg border border-gray-300 px-3 py-3 text-xs shadow-sm focus:border-[#202B5D] focus:outline-none focus:ring-2 focus:ring-[#202B5D] ${
                      loginData.role == "" ? "text-gray-400" : "text-black"
                    }`}
                  >
                    <option disabled value="">
                      Choose User Type
                    </option>

                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>

                <div className="relative mb-6 flex justify-center">
                  {showPassword ? (
                    <FaEyeSlash
                      className="absolute right-[4em] top-1/2 -translate-y-1/2 transform cursor-pointer text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <FaEye
                      className="absolute right-[4em] top-1/2 -translate-y-1/2 transform cursor-pointer text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-3/4 rounded-lg border border-gray-300 px-3 py-3 text-xs shadow-sm focus:border-[#202B5D] focus:outline-none focus:ring-2 focus:ring-[#202B5D]"
                    placeholder="Password"
                  />
                </div>

                {error && (
                  <p className="mb-4 text-center text-red-500">{error}</p>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="font-poppins w-[100px] rounded-2xl bg-[#202B5D] px-2 py-2 text-white hover:bg-[#1A234A] focus:outline-none focus:ring-2 focus:ring-[#202B5D] focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
