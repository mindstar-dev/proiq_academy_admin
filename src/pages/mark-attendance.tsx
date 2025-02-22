import React from "react";
import AttendanceTable from "~/components/attendanceTable";
import { MainPageTemplate } from "~/templates";

const MarkAttendacne: React.FunctionComponent = () => {
  return (
    <MainPageTemplate>
      <div className="container mx-auto p-6">
        <AttendanceTable />
      </div>
    </MainPageTemplate>
  );
};
export default MarkAttendacne;
