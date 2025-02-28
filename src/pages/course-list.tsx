import { Modal } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { ChangeEventHandler, useState } from "react";
import CourseTable from "~/components/courseTable";
import CustomDropdown from "~/components/customDropdown";
import ErrorPopup from "~/components/errorPopup";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import SuccessPopup from "~/components/successPopup";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
interface CourseForm {
  centreNames: string[];
}
const CourseList: React.FunctionComponent = () => {
  const [formData, setFormData] = useState<CourseForm>({} as CourseForm);
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);
  const { status, data: session } = useSession();

  const {
    data: centres,
    isError,
    isLoading,
  } = api.centre.getAllNames.useQuery();
  const {
    data: courses,
    isError: isCoursesError,
    isLoading: isCoursesLoading,
  } = api.course.getAll.useQuery();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    isCoursesError
  ) {
    return <LoadingScreen />;
  }

  return (
    <MainPageTemplate>
      <div className="flex w-full flex-col items-center justify-start gap-y-7">
        <div className="relative mt-4 flex w-full flex-row items-center justify-end px-[5%] py-7 lg:flex-col lg:px-[10%]">
          <h1 className=" text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
            Course <span className="text-[#DCA200]"> List</span>
          </h1>
          <Link
            className="rounded-full bg-[#FCD56C] px-4 py-2 text-[#202B5D] shadow-md hover:bg-[#FABA09] lg:self-end"
            href="create-course"
          >
            Create Course
          </Link>
        </div>

        <CustomDropdown
          className="w-4/5"
          selectedValues={formData.centreNames}
          setSelectedValues={(value) =>
            setFormData({ ...formData, centreNames: value })
          }
          placeHolder="Select Centres"
          values={centres}
        />
        <div className="w-4/5">
          <CourseTable
            courses={courses}
            selectedCentres={formData.centreNames}
          />
        </div>
        <div className="flex gap-x-6 self-center justify-self-center pb-7">
          <button
            type="button"
            onClick={() => setFormData({} as CourseForm)}
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
export default CourseList;
