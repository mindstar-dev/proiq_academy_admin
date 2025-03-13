import { Modal } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { ChangeEventHandler, useState } from "react";
import CentreTable from "~/components/centreTable";
import CourseTable from "~/components/courseTable";
import CustomDropdown from "~/components/customDropdown";
import ErrorPopup from "~/components/errorPopup";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import SuccessPopup from "~/components/successPopup";
import UserTable from "~/components/userTable";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";

const UserList: React.FunctionComponent = () => {
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);
  const { status, data: session } = useSession();

  const { data: users, isError, isLoading } = api.user.getAll.useQuery();

  if (status == "unauthenticated" || session?.user.role != "Admin") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (status == "loading" || isLoading || isError) {
    return <LoadingScreen />;
  }

  return (
    <MainPageTemplate>
      <div className="flex w-full flex-col items-center justify-start gap-y-7">
        <div className="relative mt-4 flex w-full flex-row items-center justify-end px-[5%] py-7 lg:flex-col lg:px-[10%]">
          <h1 className=" text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
            User <span className="text-[#DCA200]"> List</span>
          </h1>
          <Link
            className="rounded-full bg-[#FCD56C] px-4 py-2 text-[#202B5D] shadow-md hover:bg-[#FABA09] lg:self-end"
            href="user-creation"
          >
            Create User
          </Link>
        </div>

        <div className="w-4/5">
          <UserTable users={users} />
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
export default UserList;
