"use client";

import React, { forwardRef } from "react";
import { $Enums } from "@prisma/client";

export interface PaymentRow {
  student: {
    name: string;
    studentId: string;
    parentName: string;
  };
  course: {
    id: string;
    name: string;
  };
  centre: {
    id: string;
    name: string;
  };
  status: $Enums.PaymentStatus;
  amountPaid: number;
  paymentFor: string;
  paymentDate: Date;
  dateTime: Date;
  paymentMonths: Date[];
  id: string;
}

interface PrintablePaymentTableProps {
  payments: PaymentRow[];
}

const PrintablePaymentTable = forwardRef<
  HTMLDivElement,
  PrintablePaymentTableProps
>(({ payments }, ref) => {
  return (
    <>
      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
    @page {
      size: A4 landscape;
      margin: 8mm;
    }

    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .print-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    table {
      width: 100%;
      table-layout: fixed; /* 🔑 CRITICAL */
      border-collapse: collapse;
      font-size: 10px; /* 🔑 smaller font for print */
    }

    th,
    td {
      padding: 4px;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    thead {
      display: table-header-group;
    }

    tr {
      page-break-inside: avoid;
    }
  }
      `}</style>

      <div className="print-wrapper hidden" ref={ref}>
        <table
          className="border-collapse text-[11px]"
          style={{
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <thead className="bg-[#FCD56C]">
            <tr className="text-center font-semibold">
              <th className="border border-black p-2">Student ID</th>
              <th className="border border-black p-2">Name</th>
              <th className="border border-black p-2">Parent Name</th>
              <th className="border border-black p-2">Subject</th>
              <th className="border border-black p-2">Centre</th>
              <th className="border border-black p-2">Payment Date</th>
              <th className="border border-black p-2">Payment Months</th>
              <th className="border border-black p-2">Payment For</th>
              <th className="border border-black p-2">Amount</th>
              <th className="border border-black p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="text-center">
                <td className="border border-black p-1">
                  {payment.student.studentId}
                </td>
                <td className="border border-black p-1">
                  {payment.student.name}
                </td>
                <td className="border border-black p-1">
                  {payment.student.parentName}
                </td>
                <td className="border border-black p-1">
                  {payment.course.name}
                </td>
                <td className="border border-black p-1">
                  {payment.centre.name}
                </td>
                <td className="border border-black p-1">
                  {payment.dateTime.toISOString().split("T")[0]}
                </td>
                <td className="border border-black p-1">
                  {payment.paymentMonths
                    .map(
                      (date) =>
                        `${date.toLocaleString("default", {
                          month: "short",
                        })}/${date.getFullYear()}`
                    )
                    .join(", ")}
                </td>
                <td className="border border-black p-1">
                  {payment.paymentFor}
                </td>
                <td className="border border-black p-1">
                  ₹ {payment.amountPaid}
                </td>
                <td
                  className={`border border-black p-1 font-semibold ${
                    payment.status === "PAID"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default PrintablePaymentTable;
