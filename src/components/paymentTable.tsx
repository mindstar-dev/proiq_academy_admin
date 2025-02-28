import { $Enums } from "@prisma/client";
import React from "react";
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
  paymentDate: Date;
  id: string;
}
const PaymentTable = ({ payments }: { payments: Payment[] }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-[#FCD56C]">
        <thead className="bg-[#FCD56C] text-white">
          <tr className="text-center">
            <th className="border border-[#FCD56C] p-2">ID</th>
            <th className="border border-[#FCD56C] p-2">Name</th>
            <th className="border border-[#FCD56C] p-2">Parent Name</th>

            <th className="border border-[#FCD56C] p-2">Subject</th>
            <th className="border border-[#FCD56C] p-2">Centre</th>
            <th className="border border-[#FCD56C] p-2">Payment Date</th>
            <th className="border border-[#FCD56C] p-2">Amount</th>
            <th className="border border-[#FCD56C] p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index} className="text-center hover:bg-gray-50">
              <td className="border border-[#FCD56C] p-2">
                {payment.id.substring(0, 8)}.....
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
                {payment.paymentDate.toISOString().split("T")[0]}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
