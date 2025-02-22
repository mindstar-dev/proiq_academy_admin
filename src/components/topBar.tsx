import Image from "next/image";
import {
  faCircleUser,
  menuBarView,
  notifications,
  menuBarAttendance,
  menuBarPayment,
  menuBarStudentRegistrationLogo,
  menuBarUpdate,
  menuBarUpload,
  settings,
  signOutImg,
} from "public";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const TopBar: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLImageElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="top-bar h-fit w-full rounded-t-lg bg-[#FABA0999] px-2 py-3">
      {/* profile detail section */}
      <div className="flex h-full items-center justify-end">
        {/* Notification Block */}
        <div className="w-[27px]">
          <Image src={notifications} alt="Notifications" />
        </div>
        {/* Profile-icon block */}
        <div className="ml-4 mr-1 w-[27px]">
          <Image src={faCircleUser} alt="User" />
        </div>
        {/* name-designation block */}
        <div className="flex flex-col px-[1%] font-medium text-[#202B5D]">
          <div className="text-lg">Name</div>
          <div className="text-base">Designation</div>
        </div>
        <div className="flex w-[27px] items-center lg:hidden">
          <Image
            ref={menuRef}
            onClick={() => setIsOpen(!isOpen)}
            alt=""
            src={menuBarView}
          />
          <div className="relative inline-block" ref={menuRef}>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="fixed left-0 z-10 w-screen bg-[#202B5D]"
                >
                  <ul className="py-2 text-white">
                    <li className="pb-2">
                      <Link
                        href="student-registration"
                        className="relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999]"
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
                        href="#"
                        className="relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999]"
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
                        href="#"
                        className="relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999]"
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
                        href="#"
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
                    <li className="pb-2">
                      <Link
                        href="#"
                        className="relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999]"
                      >
                        <Image
                          src={menuBarUpload}
                          alt="Upload Result Logo"
                          className="w-[20px]"
                        />
                        Upload Results
                      </Link>
                    </li>
                    <li className="pb-2">
                      <Link
                        href="#"
                        className="relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999]"
                      >
                        <Image
                          src={menuBarView}
                          alt="View Result Logo"
                          className="w-[20px]"
                        />
                        View Results
                      </Link>
                    </li>
                    <li className="pb-2">
                      <Link
                        href="#"
                        className="relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999]"
                      >
                        <Image
                          src={signOutImg}
                          alt="Sign-Out Logo"
                          className="w-5"
                        />
                        Sign Out
                      </Link>
                    </li>
                    <li className="pb-2">
                      <Link
                        href="#"
                        className="relative flex gap-3 py-3 pl-5 hover:rounded-[45px] hover:bg-[#FABA0999]"
                      >
                        <Image
                          src={settings}
                          alt="Settings Logo"
                          className="w-5"
                        />
                        Settings
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopBar;
