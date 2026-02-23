import { type $Enums } from "@prisma/client";
import type React from "react";
import { useRef, useState, useEffect } from "react";
import PrintablePaymentCard from "./paymentPrintableCard";
import { useReactToPrint } from "react-to-print";
import { set } from "date-fns";
interface Payment {
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
const PaymentTable = ({ payments }: { payments: Payment[] }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setScrollLeft(tableContainerRef.current.scrollLeft);
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tableContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Speed factor
    tableContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle mouse up / leave
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReactPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Payment Receipt",
    onAfterPrint: () => {
      setSelectedPayment(null);
    },
  });

  const handlePrint = async (payment: Payment) => {
    setSelectedPayment(payment);
    setTimeout(() => {
      handleReactPrint();
    }, 0);
  };



  return (
    <div
      ref={tableContainerRef}
      className={`w-full overflow-x-auto ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }   select-none`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <table className="w-full border-collapse border border-[#FCD56C]">
        <thead className="bg-[#FCD56C] text-white">
          <tr className="text-center">
            {/* <th className="border border-[#FCD56C] p-2">Payment ID</th> */}
            <th className="border border-[#FCD56C] p-2">Student ID</th>
            <th className="border border-[#FCD56C] p-2">Name</th>
            <th className="border border-[#FCD56C] p-2">Parent Name</th>
            <th className="border border-[#FCD56C] p-2">Subject</th>
            <th className="border border-[#FCD56C] p-2">Centre</th>
            <th className="border border-[#FCD56C] p-2">Payment Date</th>
            <th className="border border-[#FCD56C] p-2">Payment Months</th>
            <th className="border border-[#FCD56C] p-2">Payment For</th>
            <th className="border border-[#FCD56C] p-2">Amount</th>
            <th className="border border-[#FCD56C] p-2">Status</th>
            <th className="border border-[#FCD56C] p-2">Print</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index} className="text-center">
              {/* <td className="border border-[#FCD56C] p-2">
                {payment.id.substring(0, 8)}
              </td> */}
              <td className="border border-[#FCD56C] p-2">
                {payment.student.studentId}
              </td>
              <td className="border border-[#FCD56C] p-2">
                {payment.student.name}
              </td>
              <td className="border border-[#FCD56C] p-2">
                {payment.student.parentName}
              </td>
              <td className="border border-[#FCD56C] p-2">
                {payment.course.name}
              </td>
              <td className="border border-[#FCD56C] p-2">
                {payment.centre.name}
              </td>
              <td className="border border-[#FCD56C] p-2">
                {payment.dateTime.toISOString().split("T")[0]}
              </td>
              <td className="border border-[#FCD56C] p-2">
                {payment.paymentMonths
                  .map(
                    (date) =>
                      `${date.toLocaleString("default", {
                        month: "short",
                      })}/${date.getFullYear()}`
                  )
                  .join(", ")}
              </td>
              <td className="border border-[#FCD56C] p-2">
                {payment.paymentFor}
              </td>
              <td className="border border-[#FCD56C] p-2">
                INR {payment.amountPaid}
              </td>
              <td
                className={`border border-[#FCD56C] p-2 ${
                  payment.status === "PAID" ? "text-green-500" : "text-red-500"
                }`}
              >
                {payment.status}
              </td>
              <td className="border border-[#FCD56C] p-1">
                <button
                  onClick={() => handlePrint(payment)}
                  className="rounded-md bg-[#FCD56C] p-2 text-white hover:underline hover:shadow-xl"
                >
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPayment && (
        <PrintablePaymentCard
          ref={printRef}
          amount={selectedPayment?.amountPaid.toString() ?? ""}
          centre={selectedPayment?.centre.name.toString() ?? ""}
          months={selectedPayment?.paymentMonths ?? []}
          name={selectedPayment?.student.name ?? ""}
          parentName={selectedPayment?.student.parentName ?? ""}
          paymentFor={selectedPayment?.paymentFor ?? ""}
          status={selectedPayment?.status ?? ""}
          studentId={selectedPayment?.student.studentId ?? ""}
          subject={selectedPayment?.course.name ?? ""}
          date={selectedPayment?.dateTime.toISOString().split("T")[0] ?? ""}
        />
      )}
    </div>
  );
};

export default PaymentTable;
