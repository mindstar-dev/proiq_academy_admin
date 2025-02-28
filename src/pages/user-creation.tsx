import { useSession } from "next-auth/react";
import React, { useState } from "react";
import CustomDropdown from "~/components/customDropdown";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
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
        <h1 className="self-center py-7 text-3xl">User Creation</h1>
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
    </MainPageTemplate>
  );
};

export default UserCreation;
