import { Modal } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import CustomDropdown from "~/components/customDropdown";
import ErrorPopup from "~/components/errorPopup";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import StudentTable from "~/components/studentTable";
import SuccessPopup from "~/components/successPopup";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
interface ViewStudentForm {
  centreIds: string[];
  courseNames: string[];
}
const StudentList: React.FunctionComponent = () => {
  const [formData, setFormData] = useState<ViewStudentForm>(
    {} as ViewStudentForm
  );
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { status, data: session } = useSession();

  const {
    data: centres,
    isError,
    isSuccess,
    isLoading,
  } = api.centre.getAllCentreNamesByUserId.useQuery({
    id: session?.user.id ?? "",
    role: session?.user.role ?? "",
  });
  const {
    data: students,
    isError: isStudentsError,
    isLoading: isStudentsLoading,
  } = api.student.getAll.useQuery();
  const {
    data: courses,
    isError: isCoursesError,
    isLoading: isCoursesLoading,
  } = api.course.getCourseNameByMultipleCentreNames.useQuery({
    centreNames: formData.centreIds ?? [],
  });

  if (status == "unauthenticated" || session?.user.role != "Admin") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (
    status == "loading" ||
    isLoading ||
    isError ||
    isCoursesLoading ||
    isCoursesError ||
    isStudentsLoading ||
    isStudentsError
  ) {
    return <LoadingScreen />;
  }
  const filteredStudents = students.filter((student) => {
    const isCentreSelected =
      !formData.centreIds ||
      formData.centreIds.length === 0 ||
      formData.centreIds.includes(student.centre.name);

    const isCourseSelected =
      !formData.courseNames ||
      formData.courseNames.length === 0 ||
      student.course?.some((c) => formData.courseNames.includes(c.name));
    const isNameMatched =
      searchQuery.trim() === "" ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase());
    console.log("isNameMatched", isNameMatched);
    return isCentreSelected && isCourseSelected && isNameMatched;
  });

  return (
    <MainPageTemplate>
      <div className="flex w-full flex-col items-center justify-start gap-y-7">
        <div className="relative mt-4 flex w-full flex-row items-center justify-end px-[5%] py-7 lg:flex-col lg:px-[10%]">
          <h1 className=" text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
            Student <span className="text-[#DCA200]"> List</span>
          </h1>
          <Link
            className="rounded-full bg-[#FCD56C] px-4 py-2 text-[#202B5D] shadow-md hover:bg-[#FABA09] lg:self-end"
            href="create-course"
          >
            Create Course
          </Link>
        </div>

        <div className="w-4/5">
          <CustomDropdown
            className="w-full"
            selectedValues={formData.centreIds}
            setSelectedValues={(value) =>
              setFormData({
                centreIds: value,
              } as ViewStudentForm)
            }
            placeHolder="Select Centres"
            values={centres}
          />
          <CustomDropdown
            className="w-full"
            selectedValues={formData.courseNames}
            setSelectedValues={(value) =>
              setFormData({ ...formData, courseNames: value })
            }
            placeHolder="Select Courses"
            values={courses}
          />
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
          </div>
          <StudentTable students={filteredStudents} />
        </div>
        <div className="flex gap-x-6 self-center justify-self-center pb-7">
          <button
            type="button"
            onClick={() => {
              //   setFormData({} as ViewStudentForm);
              console.log(searchQuery);
            }}
            className="rounded bg-[#202B5D] px-8 py-3 text-white"
          >
            Cancel
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
          message="Centre created succesfully"
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
    </MainPageTemplate>
  );
};
export default StudentList;
