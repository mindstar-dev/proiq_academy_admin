import { Modal } from "@mui/material";
import { $Enums } from "@prisma/client";
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
interface UserForm {
  status: $Enums.UserStatus;
  name: string;
  email: string;
  userType: string;
  imageUrl: string;
  phoneNumber: string;
  centres: string[];
  address: string;
  id: string;
  idProof: string;
  idProofType: string;
  dob: string;
}
export default function UpdateUser() {
  const [formData, setFormData] = useState<UserForm>({} as UserForm);
  const router = useRouter();
  const { id } = router.query ?? " ";
  const {
    data: userData,
    isError: isUserDataError,
    isLoading: isUserDataLoading,
  } = api.user.getByIdWithArray.useQuery({
    id: id as string,
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
  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dob = new Date(formData.dob);
    if (file) {
      try {
        const imageUrl = await uploadFile(
          file,
          formData.name,
          "student-images"
        );
        await deleteImage(formData.imageUrl, "student-images");
        if (imageUrl) {
          updateUser.mutate({ ...formData, imageUrl: imageUrl, dob: dob });
        }
      } catch (error) {
        setErrorString("Failed to upload file");
      }
    } else {
      updateUser.mutate({ ...formData, imageUrl: "", dob: dob });
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
  const updateUser = api.user.update.useMutation({
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
  } = api.centre.getAllNames.useQuery();

  useEffect(() => {
    if (userData && userData !== null && userData !== undefined) {
      setImage(userData.imageUrl);
      const formattedDob = userData.dob
        ? new Date(userData.dob).toISOString().split("T")[0]
        : "";
      setFormData({ ...userData, dob: formattedDob ?? "" });
    }
  }, [userData]);
  if (status == "unauthenticated") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (isLoading || isUserDataLoading || status == "loading") {
    return <LoadingScreen />;
  }
  if (errorString != "" || isError || isUserDataError) {
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
        <div className="grid grid-cols-1 py-7 lg:grid-cols-2">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="h-12 w-4/5 justify-self-center border-b border-b-[#919191]  focus:outline-none "
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="h-12 w-4/5 justify-self-center border-b border-b-[#919191]  focus:outline-none"
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="h-12 w-4/5 justify-self-center border-b border-b-[#919191]  focus:outline-none"
          />
          <input
            name="dob"
            placeholder="Date Of Birth"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className={`h-12 w-4/5 justify-self-center border-b border-b-[#919191]  focus:outline-none ${
              formData.dob == null || formData.dob == ""
                ? "text-gray-400"
                : "text-black"
            }`}
          />

          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className={`h-12 w-4/5 justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.userType == null || formData.userType == ""
                ? "text-gray-400"
                : "text-black"
            }`}
          >
            <option disabled value="" selected>
              Select User Type
            </option>
            <option value="Teacher" className="text-black">
              Teacher
            </option>
            <option value="Admin" className="text-black">
              Admin
            </option>
          </select>
          <CustomDropdown
            selectedValues={userData?.centres ?? []}
            setSelectedValues={(value) =>
              setFormData({ ...formData, centres: value })
            }
            placeHolder="Select Centres"
            values={centres as []}
          />
          <input
            name="phoneNumber"
            placeholder="Contact Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="h-12 w-4/5 justify-self-center border-b border-b-[#919191]  focus:outline-none"
          />
          <select
            name="idProofType"
            value={formData.idProofType}
            onChange={handleChange}
            className={`h-12 w-4/5 justify-self-center border-b border-b-[#919191] focus:outline-none ${
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
            <option value=" Voter card" className="text-black">
              Voter card
            </option>
          </select>
          <input
            name="idProof"
            value={formData.idProof}
            onChange={handleChange}
            placeholder="ID proof number"
            className="h-12 w-4/5 justify-self-center border-b border-b-[#919191]  focus:outline-none"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`h-12 w-4/5 justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.status == null ? "text-gray-400" : "text-black"
            }`}
          >
            <option value={$Enums.UserStatus.CONTINUE} className="text-black">
              CONTINUE
            </option>
            <option
              value={$Enums.UserStatus.DISCONTINUE}
              className="text-black"
            >
              DISCONTINUE
            </option>
            <option
              value={$Enums.UserStatus.COURSE_COMPLETE}
              className="text-black"
            >
              COURSE_COMPLETE
            </option>
          </select>
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
