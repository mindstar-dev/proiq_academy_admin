import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
import { AttendanceTable } from "~/components";
interface AttendanceStatusForm {
  centreId: string;
  courseId: string;
  date: string;
}
const Checkattendance: React.FunctionComponent = () => {
  const router = useRouter();
  const { centreId, courseId, date } = router.query;
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);

  const { status, data: session } = useSession();
  const {
    data: attendance,
    isError,
    isSuccess,
    isLoading,
  } = api.attendance.getDynamicattendance.useQuery({
    centreId: centreId as string,
    courseId: courseId as string,
    date: new Date(date as string),
  });
  if (status == "unauthenticated") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (status == "loading" || isLoading) {
    return <LoadingScreen />;
  }
  if (errorString != "" || isError) {
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
      <div className="container mx-auto p-6">
        <AttendanceTable
          attendance={attendance}
          date={new Date(date as string)}
        />
      </div>
    </MainPageTemplate>
  );
};
export default Checkattendance;
