import { Modal } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { ChangeEventHandler, useState } from "react";
import CustomDropdown from "~/components/customDropdown";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import SuccessPopup from "~/components/successPopup";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
interface StudentUpdateForm {
  name: string;
  centreName: string;
  courseName: string;
}
const UpdateStudent: React.FunctionComponent = () => {
  const [formData, setFormData] = useState<StudentUpdateForm>({
    centreName: "",
    courseName: "",
  } as StudentUpdateForm);
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);

  const { status, data: session } = useSession();

  const {
    data: centres,
    isError,
    isSuccess,
    isLoading,
  } = api.centre.getAllNamesByUserId.useQuery({
    id: session?.user.id as string,
    role: session?.user.role as string,
  });
  const {
    data: courses,
    isError: isCoursesError,
    isLoading: isCoursesLoading,
  } = api.course.getCourseByCentreName.useQuery({
    centreName: formData.centreName,
  });
  const {
    data: students,
    isError: isStudentsError,
    isSuccess: isStudentsSuccess,
    isLoading: isStudentsLoading,
  } = api.student.getByCentreAndCourseName.useQuery({
    centreName: formData.centreName,
    courseName: formData.courseName,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  if (status == "unauthenticated") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (
    status == "loading" ||
    isLoading ||
    isCoursesLoading ||
    isStudentsLoading
  ) {
    return <LoadingScreen />;
  }
  if (errorString != "" || isError || isCoursesError || isStudentsError) {
    return (
      <ErrorScreen
        errorString={errorString}
        onClick={() => {
          setErrorString("");
        }}
      />
    );
  }
  return (
    <MainPageTemplate>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col justify-start gap-y-7"
      >
        <div className="flex gap-x-4 self-center px-[10%] pt-7">
          <h1 className="self-center py-7 text-3xl">
            Update Student <span className="text-[#DCA200]"> Registration</span>
          </h1>
        </div>

        <div className="grid w-full max-w-[90%] grid-cols-1 self-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:gap-x-[10%]">
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.centreName == null || formData.centreName == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            value={formData.centreName}
            name="centreName"
            onChange={handleChange}
          >
            <option selected disabled value="">
              Select Centre
            </option>
            {centres?.map((centre, index) => {
              return (
                <option value={centre.name} className="text-black">
                  {centre.name}
                </option>
              );
            })}
          </select>
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.courseName == null || formData.courseName == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            value={formData.courseName}
            name="courseName"
            onChange={handleChange}
          >
            <option selected disabled value="">
              Select Course
            </option>
            {courses.map((course, index) => {
              return (
                <option value={course} className="text-black">
                  {course}
                </option>
              );
            })}
          </select>
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.name == null || formData.name == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            value={formData.name}
            name="name"
            onChange={handleChange}
          >
            <option selected disabled>
              Select Student
            </option>
            {students.map((student, index) => {
              return (
                <option value={student.studentId} className="text-black">
                  Name: {student.name}, Parent: {student.parentName}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-x-6 self-center justify-self-center pb-7">
          <button
            type="button"
            onClick={() =>
              setFormData({
                centreName: "",
                courseName: "",
              } as StudentUpdateForm)
            }
            className="rounded bg-[#202B5D] px-8 py-3 text-white"
          >
            Cancel
          </button>
          <Link
            type="submit"
            href={{
              pathname: "/update-student-form",
              query: { studentId: formData.name },
            }}
            className="rounded bg-[#DCA200] px-8 py-3 text-white "
          >
            Proceed
          </Link>
        </div>
      </form>
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
    </MainPageTemplate>
  );
};
export default UpdateStudent;
