import { Modal } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CustomDropdown from "~/components/customDropdown";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import SuccessPopup from "~/components/successPopup";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
import { deleteImage } from "~/utils/deleteImage";
import { uploadFile } from "~/utils/uploadImage";
interface StudentForm {
  studentId: string;
  name: string;
  address: string;
  parentName: string;
  parentOccupation: string;
  parentContactNumber1: string;
  parentContactNumber2?: string;
  idProof: string;
  idProofType: string;
  centreId: string;
  courseNames: string[];
  courseDuration: string;
  classDays: string[];
  classTiming: string;
  readdmission: boolean;
  imageUrl: string;
}
export default function UpdateStudentForm() {
  const [formData, setFormData] = useState<StudentForm>({} as StudentForm);
  const router = useRouter();
  const { studentId } = router.query ?? " ";
  const {
    data: studentData,
    isError: isStudentDataError,
    isLoading: isStudentDataLoading,
  } = api.student.getById.useQuery({
    studentId: studentId as string,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  // const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", formData);
  //   updateStudent.mutate(formData);
  // };
  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    if (file) {
      event.preventDefault();
      try {
        const imageUrl = await uploadFile(
          file,
          formData.name,
          "student-images"
        );
        await deleteImage(formData.imageUrl, "student-images");
        if (imageUrl) {
          updateStudent.mutate({ ...formData, imageUrl: imageUrl });
        }
      } catch (error) {
        setErrorString("Failed to upload file");
      }
    } else {
      updateStudent.mutate({ ...formData, imageUrl: "" });
    }
  };
  const handleLocalFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setFile(file);
      };
      reader.readAsDataURL(file);
    }
  };
  const triggerFileInput = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.click();
  };
  const updateStudent = api.student.update.useMutation({
    onError(error) {
      setErrorString(error.message);
    },
    onSuccess() {
      setIsSuccess(true);
    },
  });
  const { status, data: session } = useSession();
  const {
    data: centres,
    isError,
    isSuccess,
    isLoading,
  } = api.centre.getAllCentreByUserId.useQuery({
    id: session?.user.id ?? "",
    role: session?.user.role ?? "",
  });
  const {
    data: courses,
    isError: isCoursesError,
    isLoading: isCoursesLoading,
  } = api.course.getCourseByCentreName.useQuery({
    centreName: formData?.centreId ?? "",
  });
  useEffect(() => {
    if (studentData) {
      setImage(studentData.imageUrl);
      setFormData(studentData as StudentForm);
    }
  }, [studentData]);
  if (status == "unauthenticated") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (
    isLoading ||
    isCoursesLoading ||
    isStudentDataLoading ||
    status == "loading"
  ) {
    return <LoadingScreen />;
  }
  if (errorString != "" || isError || isStudentDataError || isCoursesError) {
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
        className="flex w-full flex-col justify-center gap-y-7"
      >
        <div className="flex gap-x-4 self-center px-[10%] pt-7">
          <h1 className="self-center py-7 text-3xl">
            Update Student <span className="text-[#DCA200]"> Data</span>
          </h1>
          <div className="relative h-24 w-24 self-center">
            {/* Hidden file input */}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLocalFileSelection}
            />

            {/* Image placeholder (clickable) */}
            <div
              className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-300"
              onClick={triggerFileInput}
            >
              {image ? (
                <img
                  src={image}
                  alt="Uploaded"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600">+</span>
              )}
            </div>

            {/* Edit button (clickable) */}
            <button
              type="button"
              className="absolute bottom-0 right-0 rounded-full bg-gray-500 p-1 text-white shadow-md hover:bg-gray-600"
              onClick={triggerFileInput}
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
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.centreId == null || formData.centreId == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            value={formData.centreId}
            name="centreId"
            onChange={handleChange}
          >
            <option selected value={""}>
              Select Centre
            </option>
            {centres?.map((centre) => {
              return (
                <option
                  value={centre.name}
                  className="text-black"
                  key={centre.name}
                >
                  {centre.name}
                </option>
              );
            })}
          </select>

          <CustomDropdown
            className="w-full"
            selectedValues={formData.courseNames}
            setSelectedValues={(value) =>
              setFormData({ ...formData, courseNames: value })
            }
            placeHolder="Select Courses"
            values={courses}
          />
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
            <option selected value="">
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
          <input
            name="parentContactNumber1"
            type="number"
            value={formData.parentContactNumber1}
            onChange={handleChange}
            placeholder="Contact Number 1"
            className="h-12 w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
          <input
            name="parentContactNumber2"
            value={formData.parentContactNumber2}
            type="number"
            onChange={handleChange}
            placeholder="Alternative Contact Number"
            className="none h-12 w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
        </div>
        <div className="flex gap-x-6 self-center justify-self-center pb-7">
          <button
            type="button"
            onClick={() => {
              // setFormData({} as StudentForm);
              // router.back();
              console.log("formData", formData);
            }}
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
            message="Student updated succesfully"
          />
        </Modal>
      </form>
    </MainPageTemplate>
  );
}
