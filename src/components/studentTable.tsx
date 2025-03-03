import Image from "next/image";
import React, { useRef, useState } from "react";

interface StudentData {
  course: {
    name: string;
  }[];
  centre: {
    name: string;
  };
  payments: {
    amountPaid: number;
    paymentDate: Date;
    paymentFor: string;
  }[];
  name: string;
  imageUrl: string;
  centreId: string;
  studentId: string;
  address: string;
  parentName: string;
  parentOccupation: string;
  parentContactNumber1: string;
  parentContactNumber2?: string | null;
  classDays: string[];
  classTiming: string;
  idProof: string;
  idProofType: string;
  courseDuration: string;
  readdmission: boolean;
  readdmissionCourseId: string | null;
  readdmissionPaymentStatus: boolean;
}

interface CourseTableProps {
  students: StudentData[];
}

const StudentTable: React.FunctionComponent<CourseTableProps> = ({
  students,
}) => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  return (
    <div
      ref={tableContainerRef}
      className={`w-full overflow-x-auto ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }  scrollbar-hide select-none`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <table className="mx-10 min-w-full table-auto border-collapse whitespace-nowrap">
        <thead>
          <tr className="border-b border-dashed bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Parent Name</th>
            <th className="border p-2">Phone Number 1</th>
            <th className="border p-2">Phone Number 2</th>
            <th className="border p-2">Centre</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Class Days</th>
            <th className="border p-2">Readdmission</th>
            <th className="border p-2">Readdmission Payment Status</th>
            <th className="border p-2">Last Payment</th>
            <th className="border p-2">Last Payment For</th>
            <th className="border p-2">Last Payment Date</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {students?.map((student, index) => {
            const paymentDate = student?.payments[0]?.paymentDate
              ? new Date(student.payments[0].paymentDate)
              : null;

            const isMoreThanOneMonth = paymentDate && paymentDate > oneMonthAgo;

            const readdmissionPaymentPending =
              (student.readdmission ?? false) &&
              !(student.readdmissionPaymentStatus ?? false);
            console.log(student.name, isMoreThanOneMonth);
            return (
              <tr
                key={index}
                className={`border-b text-center ${
                  !isMoreThanOneMonth ||
                  (student.readdmission == true &&
                    student.readdmissionPaymentStatus == false)
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                <td className="border p-2">{student.studentId.slice(0, 8)}</td>
                <td
                  className={`border border-dashed p-2 ${
                    student.imageUrl.startsWith("http") ||
                    student.imageUrl.startsWith("https")
                      ? "min-w-28"
                      : "h-fit w-fit"
                  }`}
                >
                  {student.imageUrl.startsWith("http") ||
                  student.imageUrl.startsWith("https") ? (
                    <Image
                      src={student.imageUrl}
                      alt=""
                      width={100}
                      height={100}
                    />
                  ) : (
                    <></>
                  )}
                </td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.parentName}</td>
                <td className="border p-2">{student.parentContactNumber1}</td>
                <td className="border p-2">
                  {student.parentContactNumber2 || "N/A"}
                </td>
                <td className="border p-2">{student.centre.name}</td>
                <td className="border p-2">
                  {student.course.map((c) => c.name).join(", ") || "N/A"}
                </td>
                <td className="border p-2">
                  {student.classDays.join(", ") || "N/A"}
                </td>
                <td className="border p-2">
                  {student.readdmission ? "True" : "False"}
                </td>
                <td className="border p-2">
                  {student.readdmission
                    ? student.readdmissionPaymentStatus
                      ? "PAID"
                      : "PENDING"
                    : "N/A"}
                </td>
                <td className="border p-2">
                  {student?.payments[0]?.amountPaid || "N/A"}
                </td>
                <td className="border p-2">
                  {student?.payments[0]?.paymentFor || "N/A"}
                </td>
                <td className="border p-2">
                  {student?.payments[0]?.paymentDate?.toDateString() || "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
