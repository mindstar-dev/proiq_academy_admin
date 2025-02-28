import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
interface AttendanceForm {
  centreId: string;
  courseId: string;
  date: string;
}
const Attendance: React.FunctionComponent = () => {
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<AttendanceForm>({
    centreId: "",
    courseId: "",
    date: "",
  } as AttendanceForm);

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
  } = api.course.getCourseByCentreId.useQuery({
    centreId: formData.centreId,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  if (status == "unauthenticated") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (status == "loading" || isLoading || isCoursesLoading) {
    return <LoadingScreen />;
  }
  if (errorString != "" || isError || isCoursesError) {
    return (
      <ErrorScreen
        errorString={errorString}
        onClick={() => {
          setErrorString("");
        }}
      />
    );
  }
  console.log("user", session);
  return (
    <MainPageTemplate>
      <div className="flex w-full flex-col">
        <h1 className="self-center py-7 text-3xl">Attendence</h1>
        <div className="grid w-full grid-cols-1 gap-x-4 self-center py-7 lg:w-4/5 lg:grid-cols-2">
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.centreId == null || formData.centreId == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            value={formData.centreId}
            name="centreId"
            onChange={handleChange}
          >
            <option selected disabled value="">
              Select Centre
            </option>
            {centres?.map((centre, index) => {
              return (
                <option value={centre.id} className="text-black">
                  {centre.name}
                </option>
              );
            })}
          </select>
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.courseId == null || formData.courseId == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            value={formData.courseId}
            name="courseId"
            onChange={handleChange}
          >
            <option selected disabled value="">
              Select Course
            </option>
            {courses.map((course, index) => {
              return (
                <option value={course.id} className="text-black">
                  {course.name}
                </option>
              );
            })}
          </select>
          <input
            placeholder="Select Date"
            type="datetime-local"
            name="date"
            onChange={handleChange}
            value={formData.date}
            className="h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-x-6 gap-y-4 self-center lg:w-4/5 lg:flex-row lg:px-10">
          <Link
            className="flex w-48 justify-center rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]"
            href={{
              pathname: "check-attendance",
              query: {
                centreId: formData.centreId,
                courseId: formData.courseId,
                date: new Date(formData.date).toString(),
              },
            }}
          >
            Check Attendence
          </Link>

          <Link
            className="flex w-48 justify-center rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]"
            href={{
              pathname: "mark-attendance",
              query: {
                centreId: formData.centreId,
                courseId: formData.courseId,
                date: new Date(formData.date).toString(),
              },
            }}
          >
            Mark Attendence
          </Link>
        </div>
      </div>
    </MainPageTemplate>
  );
};

export default Attendance;
