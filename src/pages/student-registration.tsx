import { Modal } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import CustomDropdown from "~/components/customDropdown";
import ErrorPopup from "~/components/errorPopup";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import SuccessPopup from "~/components/successPopup";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
import { uploadFile } from "~/utils/uploadImage";
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
  courseNames: string[];
  classDays: string[];
  readdmission: boolean;
  imageUrl: string;
  dob: string;
}
export default function StudentRegistration() {
  const initialFormState: StudentForm = {
    name: "",
    address: "",
    parentName: "",
    parentOccupation: "",
    parentContactNumber1: "",
    parentContactNumber2: "",
    idProof: "",
    idProofType: "",
    centreId: "",
    courseNames: [],
    classDays: [],
    readdmission: false,
    imageUrl: "",
    dob: "",
  };
  const [formData, setFormData] = useState<StudentForm>(initialFormState);
  const [previousFormData, setPreviousFormData] = useState<StudentForm | null>(
    null
  );
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === "centreId") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        courseNames: [],
      });
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    const dob = new Date(formData.dob);
    event.preventDefault();
    if (file) {
      try {
        const imageUrl = await uploadFile(
          file,
          formData.name,
          "student-images"
        );
        if (previousFormData == formData) {
          setErrorString("Data already inserted");
          return;
        }
        if (imageUrl) {
          !isProcessing
            ? createStudent.mutate({
                ...formData,
                imageUrl: imageUrl,
                dob: dob,
              })
            : null;
        }
      } catch (error) {
        setErrorString("Failed to upload file");
      }
    } else {
      !isProcessing
        ? createStudent.mutate({ ...formData, imageUrl: "", dob: dob })
        : null;
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
  const createStudent = api.student.create.useMutation({
    onError(error) {
      setErrorString(error.message);
      setIsProcessing(false);
    },
    onMutate() {
      setIsProcessing(true);
    },
    onSuccess() {
      setFormData(initialFormState);
      setPreviousFormData(formData);
      setIsProcessing(false);
      setFile(null);
      setImage(null);
      setIsSuccess(true);
    },
  });
  const { status, data: session } = useSession();
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
  } = api.course.getCourseNameByCentreId.useQuery({
    centreId: formData.centreId,
  });
  if (status == "unauthenticated") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (isLoading || isCoursesLoading || status == "loading") {
    return <LoadingScreen />;
  }
  if (isError || isCoursesError) {
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
        <div className="relative flex w-full min-w-full flex-row justify-center gap-x-4 self-center px-[10%] pt-7">
          <h1 className="self-center py-7 text-3xl">
            Student <span className="text-[#DCA200]"> Registration</span>
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
          <Link
            className="absolute right-[10%] rounded-full bg-[#FCD56C] px-4 py-2 text-[#202B5D] shadow-md hover:bg-[#FABA09] lg:self-end"
            href="student-list"
          >
            View All Students
          </Link>
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
            className="col-span-1 h-12 w-full justify-self-center border-b border-b-[#919191]   focus:outline-none lg:col-span-2 lg:justify-self-end"
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
            className="col-span-1 h-12 w-full justify-self-center border-b border-b-[#919191]   focus:outline-none lg:col-span-2 lg:justify-self-end"
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
              Select ID Proof Type
            </option>
            <option value="Aadhar" className="text-black">
              Aadhar
            </option>
            <option value="Birth certificate" className="text-black">
              Birth certificate
            </option>
          </select>

          <input
            name="idProof"
            value={formData.idProof}
            onChange={handleChange}
            placeholder="ID proof number"
            className="h-12 w-full justify-self-center border-b border-b-[#919191]   focus:outline-none"
          />
          <input
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            placeholder="ID proof number"
            type="date"
            className={`h-12 w-full justify-self-center border-b border-b-[#919191]  focus:outline-none ${
              formData.dob == null || formData.dob == ""
                ? "text-gray-400"
                : "text-black"
            }`}
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
            <option selected value="">
              Select Centre
            </option>
            {centres?.map((centre) => {
              return (
                <option
                  value={centre.id}
                  className="text-black"
                  key={centre.id}
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
            className="h-12 w-full justify-self-center border-b border-b-[#919191]   focus:outline-none lg:justify-self-end"
          />
          <input
            name="parentOccupation"
            value={formData.parentOccupation}
            onChange={handleChange}
            placeholder="Parent Occupation"
            className="h-12 w-full justify-self-center border-b border-b-[#919191]   focus:outline-none lg:justify-self-end"
          />
          <input
            name="parentContactNumber1"
            type="number"
            value={formData.parentContactNumber1}
            onChange={handleChange}
            placeholder="Contact Number 1"
            className="h-12 w-full justify-self-center border-b border-b-[#919191]   focus:outline-none lg:justify-self-end"
          />
          <input
            name="parentContactNumber2"
            value={formData.parentContactNumber2}
            type="number"
            onChange={handleChange}
            placeholder="Alternative Contact Number"
            className="none h-12 w-full justify-self-center border-b border-b-[#919191]   focus:outline-none lg:justify-self-end"
          />
        </div>
        <div className="flex gap-x-6 self-center justify-self-center pb-7">
          <button
            type="button"
            onClick={() => {
              setFormData(initialFormState);
              setFile(null);
              setImage(null);
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
            message="Student registered succesfully"
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
      </form>
    </MainPageTemplate>
  );
}
