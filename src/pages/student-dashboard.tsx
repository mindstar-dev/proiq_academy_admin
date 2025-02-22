"use client";
import React from "react";
import Image from "next/image";
import { oip } from "public";
import { useSession } from "next-auth/react";
import { MainPageTemplate } from "~/templates";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  console.log("role", session?.user.role);
  console.log("session", session);
  console.log("status", status);

  return (
    <MainPageTemplate>
      <div className="font-poppins flex h-fit w-full items-center justify-center bg-[#FFFFFF] pb-4">
        <div className="flex flex-col rounded-xl bg-[#FFFFFF]">
          {/* Main content : Student-Dashboard */}
          {/*Main Dashboard Title Section*/}
          <h2 className="font-lato mt-6 flex h-[15%] items-center justify-center text-[36px] font-medium">
            <span className="text-[#202B5D]">Student</span>&nbsp;
            <span className="text-[#FABA0999]">Dashboard</span>
          </h2>
          {/* Wrapping Container for information and buttons */}
          <div className="font-poppins flex w-full flex-col items-center justify-center">
            {/* Student information section */}
            <div className="flex h-fit w-full flex-col items-center justify-around gap-x-9 gap-y-9 p-6 text-white md:bg-[#D9D9D9] lg:flex-row">
              <div className="flex h-fit w-full flex-col gap-y-6 bg-[#202B5D] px-4 py-3 md:w-[295px]">
                <div className="flex w-full justify-between">
                  <Image src={oip} alt="Total Students" />
                  30
                </div>
                <div className="">Total Students</div>
              </div>
              <div className="flex h-fit w-full flex-col gap-y-6 bg-[#202B5D] px-4 py-3 md:w-[295px]">
                <div className="flex w-full justify-between">
                  <Image src={oip} alt="Total Students" />
                  30
                </div>
                <div className="">Total Students</div>
              </div>
              <div className="flex h-fit w-full flex-col gap-y-6 bg-[#202B5D] px-4 py-3 md:w-[295px]">
                <div className="flex w-full justify-between">
                  <Image src={oip} alt="Total Students" />
                  30
                </div>
                <div className="">Total Students</div>
              </div>
            </div>
          </div>
          <div className="font-poppins mt-5 flex w-full flex-col justify-between gap-y-3 font-medium text-[#202B5D] sm:flex-row">
            <button
              className="rounded-[15px] bg-[#FABA0999] px-[6%] py-[1.5%] text-[18px] outline-none hover:bg-[#b0944b] hover:outline-none"
              type="button"
            >
              All Students
            </button>
            <button
              className="rounded-[15px] bg-[#FABA0999] px-[6%] py-[1.5%] text-[18px] outline-none hover:bg-[#b0944b] hover:outline-none"
              type="button"
            >
              Add New Student
            </button>
          </div>
        </div>
      </div>
    </MainPageTemplate>
  );
}
