import { useSession } from "next-auth/react";
import { useState } from "react";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import StudentTable from "~/components/studentTable";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";

interface ViewStudentForm {
  centreIds: string[];
  courseNames: string[];
}
const CourseCompletedStudents: React.FunctionComponent = () => {
  const { status, data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: students,
    isError: isStudentsError,
    isLoading: isStudentsLoading,
  } = api.student.getAllCompleted.useQuery();

  if (status == "unauthenticated" || session?.user.role != "Admin") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (isStudentsError) {
    return <ErrorScreen errorString="Error fetching students" />;
  }
  if (status == "loading" || isStudentsLoading) {
    return <LoadingScreen />;
  }
  const filteredStudents = students.filter((student) => {
    const isNameMatched =
      searchQuery.trim() === "" ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase());
    return isNameMatched;
  });
  return (
    <MainPageTemplate>
      <div className="flex w-full max-w-full flex-col items-center justify-start gap-y-7">
        <div className="relative mt-4 flex w-full max-w-full flex-row items-center justify-end px-[5%] py-7 lg:flex-col lg:px-[10%]">
          <h1 className=" text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
            Course Completed Student <span className="text-[#DCA200]"> List</span>
          </h1>
          {/* <Link
            className="rounded-full bg-[#FCD56C] px-4 py-2 text-[#202B5D] shadow-md hover:bg-[#FABA09] lg:self-end"
            href="/student-registration"
          >
            Register Student
          </Link> */}
        </div>

        <div className="w-full px-[5%] py-7  lg:px-[10%]">
          {/* <CustomDropdown
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
          /> */}
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
      </div>
      {/* <Modal
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
      </Modal>*/}
    </MainPageTemplate>
  );
};

export default CourseCompletedStudents;
