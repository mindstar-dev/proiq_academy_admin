import React from "react";
import StudentTable from "~/components/studentTable";
import { MainPageTemplate } from "~/templates";

const Student: React.FunctionComponent = () => {
  return (
    <MainPageTemplate>
      <StudentTable />
    </MainPageTemplate>
  );
};

export default Student;
