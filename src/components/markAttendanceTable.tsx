import { $Enums } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { api } from "~/utils/api";
import SuccessPopup from "./successPopup";
import { Modal } from "@mui/material";
import ErrorPopup from "./errorPopup";
import LoadingPopup from "./loadingPopup";

interface AttendanceTableProps {
  attendance: attendanceData[];
  date: Date;
}
interface attendanceData {
  studentId: string;
  centreId: string;
  courseId: string;
  date: Date;
  status: $Enums.AttendanceStatus;
  centre: {
    name: string;
  };
  course: {
    name: string | undefined;
  };
  student: {
    name: string;
    parentName: string;
  };
}

const MarkAttendanceTable: React.FunctionComponent<AttendanceTableProps> = ({
  attendance,
  date,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localData, setLocalData] = useState<attendanceData[]>();
  const [firstRender, setFirstRender] = useState(false);
  const [isScuccess, setIsSuccess] = useState(false);
  const [errorString, setErrorString] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (attendance && !firstRender) {
      setLocalData(attendance);
      setFirstRender(true);
    }
  }, [attendance, firstRender]);
  const markAsPresent = (index: number) => {
    setLocalData((prevData) => {
      if (!prevData) return prevData;

      const updatedData = prevData.map((item, i) =>
        i === index
          ? {
              ...item,
              status:
                item.status === $Enums.AttendanceStatus.PRESENT
                  ? $Enums.AttendanceStatus.ABSENT
                  : $Enums.AttendanceStatus.PRESENT,
            }
          : item
      );

      return updatedData;
    });
  };
  const registerattendance = api.attendance.markattendance.useMutation({
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
      await registerattendance.mutate(localData);

      // console.log(localData);
    }
  };
  return (
    <div className="p-6">
      <div className="relative flex w-full flex-col-reverse items-start justify-start gap-y-2 py-7 lg:flex-row">
        <div className="mb-4 flex space-x-2 self-start">
          <input
            type="text"
            placeholder="Search Student"
            className="w-full rounded-md border p-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="rounded-md bg-yellow-500 px-4 py-2 text-white">
            🔍
          </button>
        </div>
        <h1 className="self-center text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
          attendance
        </h1>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto whitespace-nowrap">
          <thead>
            <tr className="border-b border-dashed">
              <th className="border-b border-l border-r border-dashed p-2">
                ID
              </th>
              <th className="border-b border-r border-dashed p-2">Name</th>
              <th className="border-b border-r border-dashed p-2">Present</th>
              <th className="border-b border-r border-dashed p-2">Absent</th>
              <th className="border-b border-r border-dashed p-2">
                Parent Name
              </th>
              <th className="border-b border-r border-dashed p-2">Centre</th>
              <th className="border-b border-r border-dashed p-2">Course</th>
              <th className="border-b border-r border-dashed p-2">Date</th>
              <th className="border-b border-r border-dashed p-2">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {localData?.map((student, index) => (
              <tr key={index} className="border-b border-dashed text-center">
                <td className="border border-dashed p-2">
                  {student.studentId.slice(0, 8)}
                </td>
                <td className="border border-dashed p-2">
                  {student.student.name}
                </td>
                <td className="cursor-pointer items-center justify-center border border-dashed p-2 text-center text-green-500">
                  <div className="flex w-full items-center justify-center">
                    <div
                      className={`flex h-7 w-9 items-center justify-center border border-green-500 ${
                        student.status === $Enums.AttendanceStatus.PRESENT
                          ? "bg-green-500"
                          : "bg-white"
                      }`}
                      onClick={() => {
                        markAsPresent(index);
                      }}
                    >
                      {student.status === $Enums.AttendanceStatus.PRESENT ? (
                        <FaCheck className=" text-white" />
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="cursor-pointer border border-dashed p-2 text-center text-red-500">
                  <div className="flex w-full items-center justify-center">
                    <div
                      className={`flex h-7 w-9 items-center justify-center border  border-red-500 ${
                        student.status === $Enums.AttendanceStatus.ABSENT
                          ? "bg-red-500"
                          : "bg-white"
                      }`}
                      onClick={() => {
                        markAsPresent(index);
                      }}
                    >
                      {student.status === $Enums.AttendanceStatus.ABSENT ? (
                        <ImCross className=" text-white" />
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="border border-dashed p-2">
                  {student.student.parentName}
                </td>
                <td className="border border-dashed p-2">
                  {student.centre.name}
                </td>
                <td className="border border-dashed p-2">
                  {student.course.name}
                </td>
                <td className="border border-dashed p-2">
                  {date.toDateString()}
                </td>
                <td className="border border-dashed p-2">
                  {date.toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex w-full flex-row justify-between gap-x-6 gap-y-4 self-center">
          <Link
            className="flex w-48 justify-center rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]"
            href="attendance"
          >
            Cancel
          </Link>
          <button
            className="w-48 self-end justify-self-end rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]"
            onClick={handleSubmit}
            disabled={isProcessing}
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
          message="Attendacne Marked succesfully"
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
export default MarkAttendanceTable;
