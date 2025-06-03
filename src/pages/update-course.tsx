import { Modal } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CustomDropdown from "~/components/customDropdown";
import ErrorPopup from "~/components/errorPopup";
import ErrorScreen from "~/components/errorScreen";
import LoadingPopup from "~/components/loadingPopup";
import LoadingScreen from "~/components/loadingScreen";
import SuccessPopup from "~/components/successPopup";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
interface CourseForm {
  name: string;
  centreNames: string[];
  facultyNames: string[];
}
const UpdateCourse: React.FunctionComponent = () => {
  const [formData, setFormData] = useState<CourseForm>({} as CourseForm);
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const router = useRouter();
  const { id } = router.query ?? " ";
  const { status, data: session } = useSession();
  const {
    data: courseData,
    isError: isCourseDataError,
    isLoading: isCourseDataLoading,
  } = api.course.getById.useQuery({
    id: id as string,
  });
  const {
    data: centres,
    isError,
    isLoading: isCentreDataLoading,
  } = api.centre.getAllNames.useQuery();
  const {
    data: users,
    isError: isUsersError,
    isLoading: isUsersLoading,
  } = api.user.getAll.useQuery();
  useEffect(() => {
    if (courseData) {
      setFormData({
        name: courseData.name,
        facultyNames: courseData.faculty,
        centreNames: courseData.centre,
      });
    }
  }, [courseData, id]);
  const filteredUserNames: string[] =
    users
      ?.filter((user) =>
        user.centres?.some((centre: { name: string }) =>
          formData.centreNames?.includes(centre.name)
        )
      )
      .map((user) => `${user.name}, ${user.email}`) || [];
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    updateCourse.mutate({ ...formData, id: courseData!.id });
  };

  const updateCourse = api.course.update.useMutation({
    onMutate() {
      setisLoading(true);
    },
    onError(error) {
      setisLoading(false);
      setErrorString(error.message);
    },
    onSuccess() {
      setisLoading(false);
      setIsSuccess(true);
    },
  });

  if (status == "unauthenticated" || session?.user.role != "Admin") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (
    status == "loading" ||
    isCentreDataLoading ||
    isUsersLoading ||
    isCourseDataLoading
  ) {
    return <LoadingScreen />;
  }
  if (isError || isUsersError || isCourseDataError) {
    return (
      <ErrorScreen
        errorString="Error Occured"
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
        <div className="relative mt-4 flex w-full flex-row items-center justify-end px-[5%] py-7 lg:flex-col lg:px-[10%]">
          <h1 className=" text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
            Update <span className="text-[#DCA200]"> Course Data</span>
          </h1>
          <Link
            className="rounded-full bg-[#FCD56C] px-4 py-2 text-[#202B5D] shadow-md hover:bg-[#FABA09] lg:self-end"
            href="course-list"
          >
            View All Courses
          </Link>
        </div>
        <div className="grid w-full max-w-[90%] grid-cols-1 self-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:gap-x-[10%]">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Course Name"
            className="h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:col-span-2 lg:justify-self-end"
          />
          <CustomDropdown
            className="w-full"
            selectedValues={formData.centreNames}
            setSelectedValues={(value) =>
              setFormData({ ...formData, centreNames: value })
            }
            placeHolder="Select Centres"
            values={centres}
          />
          <CustomDropdown
            className="w-full"
            selectedValues={formData.facultyNames}
            setSelectedValues={(value) =>
              setFormData({
                ...formData,
                facultyNames: value,
              })
            }
            placeHolder="Select Faculties"
            values={filteredUserNames}
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
          <button
            type="submit"
            className="rounded bg-[#DCA200] px-8 py-3 text-white"
          >
            Save
          </button>
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
            router.replace("/course-list");
            setIsSuccess(false);
          }}
          message="Course updated succesfully"
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
        open={isLoading}
        onClose={() => {
          setisLoading(false);
        }}
        className="flex h-full w-full items-center justify-center"
      >
        <LoadingPopup />
      </Modal>
    </MainPageTemplate>
  );
};
export default UpdateCourse;
