"use client";
import React from "react";
import Image from "next/image";
import { oip } from "public";
import { useSession } from "next-auth/react";
import { MainPageTemplate } from "~/templates";
import Link from "next/link";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import { api } from "~/utils/api";

export default function StudentDashboard() {
  const { status } = useSession();
  const {
    data: studentCount,
    isLoading: isStudentLoading,
    isError: isStudentError,
  } = api.student.count.useQuery();
  const {
    data: courseCount,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = api.course.count.useQuery();
  const {
    data: centreCount,
    isLoading: isCentreLoading,
    isError: isCentreError,
  } = api.centre.count.useQuery();

  if (status == "unauthenticated") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (
    status == "loading" ||
    isStudentLoading ||
    isCourseLoading ||
    isCentreLoading
  ) {
    return <LoadingScreen />;
  }
  if (isStudentError || isCourseError || isCentreError) {
    return <ErrorScreen errorString="Error Ocurred Contact Developers" />;
  }
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
                <div className="flex w-full justify-between text-3xl">
                  <Image src={oip} alt="Total Students" />
                  {studentCount}
                </div>
                <div className="">Total Students</div>
              </div>
              <div className="flex h-fit w-full flex-col gap-y-6 bg-[#202B5D] px-4 py-3 md:w-[295px]">
                <div className="flex w-full justify-between text-3xl">
                  <Image src={oip} alt="Total Students" />
                  {courseCount}
                </div>
                <div className="">Total Courses</div>
              </div>
              <div className="flex h-fit w-full flex-col gap-y-6 bg-[#202B5D] px-4 py-3 md:w-[295px]">
                <div className="flex w-full justify-between text-3xl">
                  <Image src={oip} alt="Total Students" />
                  {centreCount}
                </div>
                <div className="">Total Centres</div>
              </div>
            </div>
          </div>
          <div className="font-poppins mt-5 flex w-full flex-col justify-between gap-y-3 font-medium text-[#202B5D] sm:flex-row">
            <Link
              className="rounded-[15px] bg-[#FABA0999] px-[6%] py-[1.5%] text-[18px] outline-none hover:bg-[#b0944b] hover:outline-none"
              href="student-list"
            >
              All Students
            </Link>
            <Link
              className="rounded-[15px] bg-[#FABA0999] px-[6%] py-[1.5%] text-[18px] outline-none hover:bg-[#b0944b] hover:outline-none"
              href="student-registration"
            >
              Add New Student
            </Link>
          </div>
        </div>
      </div>
    </MainPageTemplate>
  );
}
