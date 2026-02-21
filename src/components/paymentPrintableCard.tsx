"use client";

import { a } from "framer-motion/dist/types.d-6pKw1mTI";
import React, { forwardRef } from "react";

export interface Props {
  studentId: string;
  name: string;
  parentName: string;
  subject: string;
  centre: string;
  date?: string;
  months: Date[];
  paymentFor: string;
  amount: string;
  status: string;
}

const PrintablePaymentCard = forwardRef<HTMLDivElement, Props>(
  (
    {
      studentId,
      name,
      parentName,
      subject,
      centre,
      date,
      months,
      paymentFor,
      amount,
      status,
    },
    ref
  ) => {
    console.log("Rendering PrintablePaymentCard with props: ", { studentId, name, parentName, subject, centre, date, months, paymentFor, amount, status });
    return (
      <div
        ref={ref}
        className="w-full bg-white p-8 text-black print:bg-white print:p-8"
      >
        <h1 className="border-b pb-3 text-center text-2xl font-bold">
          Payment Receipt
        </h1>

        <div className="mt-6 grid grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="col-span-2 space-y-4">
            <h2 className="mb-2 text-xl font-semibold">Payment Details</h2>

            <p>
              <strong>Student Id:</strong> {studentId}
            </p>

            <p>
              <strong>Full Name:</strong> {name}
            </p>
            <p>
              <strong>Parent Name:</strong> {parentName}
            </p>
            <p>
              <strong>Subject: </strong> {subject}
            </p>
            <p>
              <strong>Centre: </strong> {centre}
            </p>
            <p>
              <strong>Payment Date: </strong> {date}
            </p>
            <p>
              <strong>Payment Months: </strong> {months
                  .map(
                    (date) =>
                      `${date.toLocaleString("default", {
                        month: "short",
                      })}/${date.getFullYear()}`
                  )
                  .join(", ")}
            </p>

            <p>
              <strong>Payment For: </strong>
              {paymentFor}
            </p>

            <p>
              <strong>Amount: </strong>
              {amount}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PrintablePaymentCard.displayName = "PrintableStudentCard";
export default PrintablePaymentCard;
