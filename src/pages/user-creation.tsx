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
interface FormData {
  name: string;
  email: string;
  userType: string;
  password: string;
  imageUrl: string;
  centres: string[];
  phoneNumber: string;
}

const UserCreation: React.FunctionComponent = () => {
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);
  const createUser = api.user.create.useMutation();
  const [formData, setFormData] = useState<FormData>({
    imageUrl: "demo",
  } as FormData);
  const { status, data: session } = useSession();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    createUser.mutate(formData);
    console.log(formData);
  };
  const {
    data: centres,
    isError,
    isSuccess,
    isLoading,
  } = api.centre.getAllNames.useQuery();
  if (status == "unauthenticated" || session?.user.role != "Admin") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (isLoading || status == "loading") {
    return <LoadingScreen />;
  }
  if (isError) {
    return (
      <ErrorScreen errorString="Error Occurred please refresh this screen" />
    );
  }
  return (
    <MainPageTemplate>
      <div className="flex w-full flex-col">
        <div className="relative mt-4 flex w-full flex-row items-center justify-end px-[5%] py-7 lg:flex-col lg:px-[10%]">
          <h1 className=" text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
            User <span className="text-[#DCA200]">User Creation</span>
          </h1>
          <Link
            className="rounded-full bg-[#FCD56C] px-4 py-2 text-[#202B5D] shadow-md hover:bg-[#FABA09] lg:self-end"
            href="user-list"
          >
            View All Users
          </Link>
        </div>
        <div className="relative h-24 w-24 self-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300"></div>
          <button className="absolute bottom-0 right-0 rounded-full bg-gray-500 p-1 text-white shadow-md hover:bg-gray-600">
            ✏️
          </button>
        </div>

        <div className="grid grid-cols-1 py-7 lg:grid-cols-2">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="h-12 w-4/5 justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none "
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="h-12 w-4/5 justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="h-12 w-4/5 justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none"
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
            selectedValues={formData.centres}
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
            className="h-12 w-4/5 justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none"
          />
        </div>
        <div className="flex gap-x-6 self-center justify-self-center">
          <button className="rounded bg-[#202B5D] px-8 py-3 text-white">
            Cancel
          </button>
          <button
            className="rounded bg-[#DCA200] px-8 py-3 text-white"
            onClick={handleSubmit}
          >
            Save
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

export default UserCreation;
