import { $Enums } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { api } from "~/utils/api";
import SuccessPopup from "./successPopup";
import { Modal } from "@mui/material";
import ErrorPopup from "./errorPopup";
import LoadingPopup from "./loadingPopup";
import { set } from "date-fns";

interface ReaddmissionTableProps {
  students: ReaddmissionData[];
  payment: number;
  previousCourseId: string;
  newCourseId: string;
  centreId: string;
}
interface ReaddmissionData {
  course: {
    name: string;
  }[];
  centre: {
    name: string;
  };
  name: string;
  studentId: string;
  parentName: string;
  readdmissionCourseId: string | undefined | null;
  readdmission?: boolean;
  readdmissionPaymentStatus?: boolean;
}
const ReaddmissionTable: React.FunctionComponent<ReaddmissionTableProps> = ({
  students,
  payment,
  previousCourseId,
  newCourseId,
  centreId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localData, setLocalData] = useState<ReaddmissionData[]>();
  const [firstRender, setFirstRender] = useState(false);
  const [isScuccess, setIsSuccess] = useState(false);
  const [errorString, setErrorString] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log("stu", students);

    const updatedStudents = students.map((student) => ({
      ...student,
      readdmission:
        (student.readdmission &&
          student.readdmissionCourseId != previousCourseId) ??
        false,
      readdmissionPayment:
        (student.readdmission &&
          student.readdmissionCourseId != previousCourseId &&
          student.readdmissionPaymentStatus) ??
        false,
    }));
    setLocalData(updatedStudents);
  }, [students, previousCourseId, newCourseId, centreId]);
  const markAsReadmission = (
    index: number,
    field: "readdmission" | "readdmissionPaymentStatus"
  ) => {
    setLocalData((prevData) => {
      if (!prevData) return prevData;

      return prevData.map((student, i) => {
        if (i === index) {
          const updatedStudent = { ...student, [field]: !student[field] };

          // If readdmissionPaymentStatus is true, ensure readdmission is also true
          if (
            field === "readdmissionPaymentStatus" &&
            updatedStudent.readdmissionPaymentStatus
          ) {
            updatedStudent.readdmission = true;
          } else if (field === "readdmission" && !updatedStudent.readdmission) {
            updatedStudent.readdmissionPaymentStatus = false;
          }

          return updatedStudent;
        }
        return student;
      });
    });
  };

  const readdmission = api.student.readmission.useMutation({
    onSuccess() {
      setIsSuccess(true);
      setIsProcessing(false);
    },
    onError(error) {
      setErrorString(error.message);
      setIsProcessing(false);
    },
  });
  const handleSubmit = async () => {
    setIsProcessing(true);
    if (localData) {
      await readdmission.mutate({
        studentData: localData,
        centreId: centreId,
        courseId: previousCourseId,
        readdmissionCourseId: newCourseId,
        readdmissionPaymentAmount: payment,
      });
      console.log("localdata", {
        studentData: localData,
        centreId: centreId,
        courseId: previousCourseId,
        readdmissionCourseId: newCourseId,
        readdmissionPaymentAmount: payment,
      });
    }
  };
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
    <div className=" w-full py-6">
      <div
        ref={tableContainerRef}
        className={` scrollbar-hide  w-full min-w-full  overflow-x-auto ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }  scrollbar-hide select-none`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <table className="min-w-full table-auto whitespace-nowrap">
          <thead>
            <tr className="border-b border-dashed">
              <th className="border-b border-l border-r border-dashed p-2">
                ID
              </th>
              <th className="border-b border-r border-dashed p-2">Name</th>
              <th className="border-b border-r border-dashed p-2">
                Parent Name
              </th>
              <th className="border-b border-r border-dashed p-2">Centre</th>
              <th className="border-b border-r border-dashed p-2">Course</th>
              <th className="border-b border-r border-dashed p-2">
                Readdmission
              </th>
              <th className="border-b border-r border-dashed p-2">
                Readdmission Payment
              </th>
              {/* <th className="border-b border-r border-dashed p-2">Present</th>
              <th className="border-b border-r border-dashed p-2">Absent</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {localData?.map((student, index) => (
              <tr key={index} className="border-b border-dashed text-center">
                <td className="border border-dashed p-2">
                  {student.studentId}
                </td>
                <td className="border border-dashed p-2">{student.name}</td>
                <td className="border border-dashed p-2">
                  {student.parentName}
                </td>
                <td className="border border-dashed p-2">
                  {student.centre.name}
                </td>
                <td className="border border-dashed p-2">
                  {student.course.map((c) => c.name).join(", ") || "N/A"}
                </td>
                <td className="cursor-pointer items-center justify-center border border-dashed p-2 text-center text-green-500">
                  <div className="flex w-full items-center justify-center">
                    <div
                      className={`flex h-7 w-9 items-center justify-center border border-green-500 ${
                        student.readdmission ? "bg-green-500" : "bg-white"
                      }`}
                      onClick={() => {
                        markAsReadmission(index, "readdmission");
                      }}
                    >
                      {student.readdmission ? (
                        <FaCheck className=" text-white" />
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="cursor-pointer items-center justify-center border border-dashed p-2 text-center text-green-500">
                  <div className="flex w-full items-center justify-center">
                    <div
                      className={`flex h-7 w-9 items-center justify-center border border-green-500 ${
                        student.readdmissionPaymentStatus
                          ? "bg-green-500"
                          : "bg-white"
                      }`}
                      onClick={() => {
                        markAsReadmission(index, "readdmissionPaymentStatus");
                      }}
                    >
                      {student.readdmissionPaymentStatus ? (
                        <FaCheck className=" text-white" />
                      ) : null}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex w-full min-w-full flex-row justify-between gap-x-6 gap-y-4 self-center ">
          <button
            className="w-48 self-end justify-self-end rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={isScuccess}
        onClose={() => {
          setIsSuccess(false);
        }}
        className="flex h-full w-full items-center justify-center"
      >
        <SuccessPopup
          onClick={() => {
            setIsSuccess(false);
          }}
          message="Readmission Marked succesfully"
        />
      </Modal>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={errorString.length > 0}
        onClose={() => {
          setErrorString("");
        }}
        className="flex h-full w-full items-center justify-center"
      >
        <ErrorPopup
          onClick={() => {
            setErrorString("");
          }}
          message={errorString}
        />
      </Modal>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={isProcessing}
        className="flex h-full w-full items-center justify-center"
      >
        <LoadingPopup />
      </Modal>
    </div>
  );
};
export default ReaddmissionTable;
