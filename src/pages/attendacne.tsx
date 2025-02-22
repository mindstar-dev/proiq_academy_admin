import Link from "next/link";
import React from "react";
import { MainPageTemplate } from "~/templates";

const Attendance: React.FunctionComponent = () => {
  return (
    <MainPageTemplate>
      <div className="flex w-full flex-col">
        <h1 className="self-center py-7 text-3xl">Attendence</h1>
        <div className="grid w-full grid-cols-1 gap-x-4 self-center py-7 lg:w-4/5 lg:grid-cols-2">
          <select className="h-12 w-4/5 justify-self-center border-b border-b-[#919191] focus:outline-none">
            <option selected disabled>
              Select Class
            </option>
            <option value="">Centre 1</option>
            <option value="">Centre 2</option>
            <option value="">Centre 3</option>
          </select>
          <select className="h-12 w-4/5 justify-self-center border-b border-b-[#919191] focus:outline-none">
            <option selected disabled>
              Select Centre
            </option>
            <option value="">Centre 1</option>
            <option value="">Centre 2</option>
            <option value="">Centre 3</option>
          </select>
          <select className="h-12 w-4/5 justify-self-center border-b border-b-[#919191] focus:outline-none">
            <option selected disabled>
              Select Day
            </option>
            <option value="">Centre 1</option>
            <option value="">Centre 2</option>
            <option value="">Centre 3</option>
          </select>
          <select className="h-12 w-4/5 justify-self-center border-b border-b-[#919191] focus:outline-none">
            <option selected disabled>
              Select Time Slot
            </option>
            <option value="">Centre 1</option>
            <option value="">Centre 2</option>
            <option value="">Centre 3</option>
          </select>
          <select className="h-12 w-4/5 justify-self-center border-b border-b-[#919191] focus:outline-none">
            <option selected disabled>
              Select Subject
            </option>
            <option value="">Centre 1</option>
            <option value="">Centre 2</option>
            <option value="">Centre 3</option>
          </select>
          <select className="h-12 w-4/5 justify-self-center border-b border-b-[#919191] focus:outline-none">
            <option selected disabled>
              Select Month
            </option>
            <option value="">Centre 1</option>
            <option value="">Centre 2</option>
            <option value="">Centre 3</option>
          </select>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-x-6 gap-y-4 self-center lg:w-4/5 lg:flex-row lg:px-10">
          <button className="w-48 rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]">
            Check Attendence
          </button>
          <Link
            className="flex w-48 justify-center rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]"
            href="/attendance/mark-attendance"
          >
            Mark Attendence
          </Link>
        </div>
      </div>
    </MainPageTemplate>
  );
};

export default Attendance;
