import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import MarkAttendanceTable from "~/components/markAttendanceTable";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";

const Markattendance: React.FunctionComponent = () => {
  const router = useRouter();
  const { centreId, courseId, date } = router.query;
  const [errorString, setErrorString] = useState("");

  const { status } = useSession();
  const {
    data: attendance,
    isError,

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
        <MarkAttendanceTable
          attendance={attendance}
          date={new Date(date!.toLocaleString())}
        />
      </div>
    </MainPageTemplate>
  );
};
export default Markattendance;
