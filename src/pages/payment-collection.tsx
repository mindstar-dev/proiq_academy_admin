import Link from "next/link";
import React from "react";
import { MainPageTemplate } from "~/templates";

const PaymentCollection: React.FunctionComponent = () => {
  return (
    <MainPageTemplate>
      <div className="flex w-full flex-col">
        <div className="relative flex w-full flex-row items-center justify-end px-[5%] py-7 lg:flex-col lg:px-[10%]">
          <h1 className="text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
            Payment Collection
          </h1>
          <Link
            className="rounded-full bg-[#FCD56C] px-4 py-2 text-[#202B5D] shadow-md hover:bg-[#FABA09] lg:self-end"
            href="payment-status"
          >
            Payment Status
          </Link>
        </div>
        <div className="grid w-4/5 grid-cols-1 gap-x-4 self-center py-7 lg:grid-cols-2">
          <input
            placeholder="Student Id"
            className="h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
          <input
            placeholder="Student Name"
            className="h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
          <input
            placeholder="Select Date"
            type="datetime-local"
            className="h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
          <select className="h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none">
            <option selected disabled>
              Select Subject
            </option>
            <option value="">Centre 1</option>
            <option value="">Centre 2</option>
            <option value="">Centre 3</option>
          </select>
          <select className="h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none">
            <option selected disabled>
              Select Centre
            </option>
            <option value="">Centre 1</option>
            <option value="">Centre 2</option>
            <option value="">Centre 3</option>
          </select>
          <input
            placeholder="Payable Amount"
            className="h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
        </div>
        <div className="flex w-4/5 flex-col justify-end gap-x-6 gap-y-4 self-center lg:w-4/5 lg:flex-row">
          <button className="w-48 self-end rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]">
            Pay Fees
          </button>
        </div>
      </div>
    </MainPageTemplate>
  );
};

export default PaymentCollection;
