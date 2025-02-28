import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
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
  const [formData, setFormData] = useState<AttendanceForm>({
    centreId: "",
    courseId: "",
    date: "",
  });

  const { status, data: session } = useSession();
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  const {
    data: centres,
    isError,
    isLoading,
  } = api.centre.getAllCentreByUserId.useQuery({
    id: session?.user.id ?? "",
    role: session?.user.role ?? "",
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

  // Set session loaded flag after session data is available
  useEffect(() => {
    if (status !== "loading") {
      setIsSessionLoaded(true);
    }
  }, [status]);

  if (!isSessionLoaded) {
    return <LoadingScreen />;
  }

  if (status === "unauthenticated") {
    return (
      <ErrorScreen errorString="You don't have permission to access this screen" />
    );
  }

  if (status === "loading" || isLoading || isCoursesLoading) {
    return <LoadingScreen />;
  }

  if (errorString !== "" || isError || isCoursesError) {
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
      <div className="flex w-full flex-col">
        <h1 className="self-center py-7 text-3xl">Attendance</h1>
        <div className="grid w-full grid-cols-1 gap-x-4 self-center py-7 lg:w-4/5 lg:grid-cols-2">
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.centreId === "" ? "text-gray-400" : "text-black"
            }`}
            value={formData.centreId}
            name="centreId"
            onChange={handleChange}
          >
            <option selected disabled value="">
              Select Centre
            </option>
            {centres?.map((centre) => (
              <option value={centre.id} className="text-black" key={centre.id}>
                {centre.name}
              </option>
            ))}
          </select>
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.courseId === "" ? "text-gray-400" : "text-black"
            }`}
            value={formData.courseId}
            name="courseId"
            onChange={handleChange}
          >
            <option selected disabled value="">
              Select Course
            </option>
            {courses?.map((course) => (
              <option value={course.id} className="text-black" key={course.id}>
                {course.name}
              </option>
            ))}
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
            Check Attendance
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
            Mark Attendance
          </Link>
        </div>
      </div>
    </MainPageTemplate>
  );
};

export default Attendance;
