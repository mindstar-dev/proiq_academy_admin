import Image, { type StaticImageData } from "next/image";
import React from "react";
import {
  menuBarAttendance,
  menuBarPayment,
  menuBarStudentRegistrationLogo,
  menuBarUpdate,
  proiqLogoWhite1,
  settings,
  signOutImg,
} from "public";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
const SideBar: React.FunctionComponent = () => {
  const pathName = usePathname();
  const router = useRouter();
  console.log(pathName);

  return (
    <div className="font-poppins hidden min-h-screen w-[270px] min-w-[270px] flex-col bg-[#202B5D] text-white lg:flex">
      <div className="container flex h-full flex-col items-center">
        <div className="logo mb-5 mt-6 w-[130px]">
          <Image
            src={proiqLogoWhite1 as StaticImageData}
            alt="Pro IQ Academy"
            className="cursor-pointer"
            onClick={() => {
              router.push("/dashboard");
            }}
          />
        </div>
        <nav className="mt-5 flex h-full w-full flex-col justify-between">
          <ul className="w-full list-none text-center text-base">
            <li className="pb-2">
              <Link
                href="student-registration"
                className={`relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999] ${
                  pathName === "/student-registration"
                    ? "rounded-full bg-[#FABA09]"
                    : ""
                }`}
              >
                <Image
                  src={menuBarStudentRegistrationLogo}
                  alt="Student Registration Logo"
                  className="w-[20px]"
                />
                Student Registration
              </Link>
            </li>
            <li className="pb-2">
              <Link
                href="create-centre"
                className={`relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999] ${
                  pathName.includes("centre") ? "rounded-full bg-[#FABA09]" : ""
                }`}
              >
                <Image
                  src={menuBarPayment}
                  alt="Payment Logo"
                  className="w-[20px]"
                />
                Create Centre
              </Link>
            </li>
            <li className="pb-2">
              <Link
                href="create-course"
                className={`relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999] ${
                  pathName?.includes("course")
                    ? "rounded-full bg-[#FABA09]"
                    : ""
                }`}
              >
                <Image
                  src={menuBarPayment}
                  alt="Payment Logo"
                  className="w-[20px]"
                />
                Create Course
              </Link>
            </li>
            <li className="pb-2">
              <Link
                href="attendance"
                className={`relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999] ${
                  pathName?.includes("attendance")
                    ? "rounded-full bg-[#FABA09]"
                    : ""
                }`}
              >
                <Image
                  src={menuBarAttendance}
                  alt="Attendance Logo "
                  className="w-[20px]"
                />
                Attendance / Footfall
              </Link>
            </li>
            <li className="pb-2">
              <Link
                href="payment-collection"
                className={`relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999] ${
                  pathName.includes("payment")
                    ? "rounded-full bg-[#FABA09]"
                    : ""
                }`}
              >
                <Image
                  src={menuBarPayment}
                  alt="Payment Logo"
                  className="w-[20px]"
                />
                Payment Collection
              </Link>
            </li>
            <li className="pb-2">
              <Link
                href="update-student"
                className="relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999]"
              >
                <Image
                  src={menuBarUpdate}
                  alt="Update Student Reg. Logo"
                  className="w-[20px]"
                />
                Update Student Reg.
              </Link>
            </li>
          </ul>
          <ul className="mt-10 w-full pb-10 pl-2">
            <li className="pb-4">
              <button
                className="relative flex w-full gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999]"
                onClick={async () => {
                  await signOut({ redirect: false });
                  router.push("/");
                }}
              >
                <Image src={signOutImg} alt="Sign-Out Logo" className="w-5" />
                Sign Out
              </button>
            </li>
            <li className="pb-2">
              {" "}
              {/* Add pb-2 for consistent padding-bottom */}
              <Link
                href="user-creation"
                className={`relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999] ${
                  pathName === "/user-creation"
                    ? "rounded-full bg-[#FABA09]"
                    : ""
                }`}
              >
                <Image src={settings} alt="Settings Logo" className="w-5" />
                User Creation
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
export default SideBar;
