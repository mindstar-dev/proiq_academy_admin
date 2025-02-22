import { useSession } from "next-auth/react";
import React, { ChangeEventHandler, useState } from "react";
import CustomDropdown from "~/components/customDropdown";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
interface StudentForm {
  name: string;
  address: string;
  parentName: string;
  parentOccupation: string;
  parentContactNumber1: string;
  parentContactNumber2?: string;
  idProof: string;
  idProofType: string;
  centreId: string;
  courseName: string;
  courseDuration: string;
  classDays: string[];
  classTiming: string;
  readdmission: boolean;
  imageUrl: string;
}
export default function StudentRegistration() {
  const [formData, setFormData] = useState<StudentForm>({
    imageUrl: "demo URl",
  } as StudentForm);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [errorString, setErrorString] = useState("");
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    createStudent.mutate(formData);
    // Add further form submission logic here (e.g., API call)
  };
  const createStudent = api.student.create.useMutation({
    onError(error, variables, context) {
      setErrorString(error.message);
    },
  });
  const { status, data: session } = useSession();
  const {
    data: centres,
    isError,
    isSuccess,
    isLoading,
  } = api.centre.getAll.useQuery();
  if (status == "unauthenticated" || session?.user.role != "admin") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (isLoading || status == "loading") {
    return <LoadingScreen />;
  }
  if (isError) {
    return <ErrorScreen errorString={errorString} />;
  }
  return (
    <MainPageTemplate>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col justify-center gap-y-7"
      >
        <div className="flex gap-x-4 self-center px-[10%] pt-7">
          <h1 className="self-center py-7 text-3xl">
            Student <span className="text-[#DCA200]"> Registration</span>
          </h1>
          <div className="relative h-24 w-24 self-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300"></div>
            <button
              type="button"
              className="absolute bottom-0 right-0 rounded-full bg-gray-500 p-1 text-white shadow-md hover:bg-gray-600"
            >
              ✏️
            </button>
          </div>
        </div>
        <div className="w-full bg-[#FABA09] bg-opacity-60 px-[10%] py-4 text-2xl">
          Student Details
        </div>
        <div className="grid w-full max-w-[90%] grid-cols-1 self-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:gap-x-[10%]">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />

          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
            className="col-span-1 h-12 w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:col-span-2 lg:justify-self-end"
          />
          <select
            name="idProofType"
            value={formData.idProofType}
            onChange={handleChange}
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.idProofType == null || formData.idProofType == ""
                ? "text-gray-400"
                : "text-black"
            }`}
          >
            <option selected disabled value="">
              Select ID Proof
            </option>
            <option value="Aadhar" className="text-black">
              Aadhar
            </option>
            <option value="PAN" className="text-black">
              PAN
            </option>
            <option value="Passport" className="text-black">
              Passport
            </option>
          </select>
          <input
            name="idProof"
            value={formData.idProof}
            onChange={handleChange}
            placeholder="ID proof number"
            className="h-12 w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none"
          />
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.courseName == null || formData.courseName == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            value={formData.courseName}
            onChange={handleChange}
            name="courseName"
          >
            <option selected disabled value="">
              Select Course
            </option>
            <option value="Course 1" className="text-black">
              Course 1
            </option>
            <option value="Course 2" className="text-black">
              Course 2
            </option>
            <option value="Course 3" className="text-black">
              Course 3
            </option>
          </select>
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.courseDuration == null || formData.courseDuration == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            value={formData.courseDuration}
            onChange={handleChange}
            name="courseDuration"
          >
            <option selected disabled value="">
              Select Course Duration
            </option>
            <option value="3 Months" className="text-black">
              3 Months
            </option>
            <option value="6 Months" className="text-black">
              6 Months
            </option>
            <option value="1 Year" className="text-black">
              1 Year
            </option>
          </select>
          <CustomDropdown
            className="w-full"
            selectedValues={formData.classDays}
            setSelectedValues={(value) =>
              setFormData({ ...formData, classDays: value })
            }
            placeHolder="Select Class Days"
            values={[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ]}
          />

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
            <option selected disabled>
              Select Centre
            </option>
            {centres.map((centre, index) => {
              return (
                <option value={centre} className="text-black">
                  {centre}
                </option>
              );
            })}
          </select>
          <input
            name="classTiming"
            value={formData.classTiming}
            onChange={handleChange}
            placeholder="Select Class Time"
            type="time"
            className="h-12 w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none"
          />
        </div>
        <div className="w-full bg-[#FABA09] bg-opacity-60 px-[10%] py-4 text-2xl">
          Parent Details
        </div>
        <div className="grid w-full max-w-[90%] grid-cols-1 self-center lg:grid-cols-2 lg:gap-x-[10%]">
          <input
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            placeholder="Parent Name"
            className="h-12 w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
          <input
            name="parentOccupation"
            value={formData.parentOccupation}
            onChange={handleChange}
            placeholder="Parent Occupation"
            className="h-12 w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
          <input
            name="parentContactNumber1"
            value={formData.parentContactNumber1}
            onChange={handleChange}
            placeholder="Contact 1"
            className="h-12 w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
          <input
            name="parentContactNumber2"
            value={formData.parentContactNumber2}
            onChange={handleChange}
            placeholder="Contact 2"
            className="h-12 w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
        </div>
        <div className="flex gap-x-6 self-center justify-self-center pb-7">
          <button
            type="button"
            onClick={() => setFormData({} as StudentForm)}
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
    </MainPageTemplate>
  );
}
