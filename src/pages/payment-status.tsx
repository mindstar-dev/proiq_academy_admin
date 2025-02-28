import { $Enums } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import PaymentTable from "~/components/paymentTable";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
interface PaymentStatusForm {
  studentId: string;
  centreId: string;
  courseId: string;
  month: string;
}
interface PaymentData {
  student: {
    name: string;
    studentId: string;
    parentName: string;
  };
  course: {
    id: string;
    name: string;
  };
  centre: {
    id: string;
    name: string;
  };
  status: $Enums.PaymentStatus;
  amountPaid: number;
  paymentDate: Date;
  id: string;
}
const PaymentStatus: React.FunctionComponent = () => {
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<PaymentStatusForm>({
    centreId: "",
    courseId: "",
    month: "",
  } as PaymentStatusForm);
  const [filteredPaymentData, setFilteredPaymentData] =
    useState<PaymentData[]>();
  const { status, data: session } = useSession();

  const {
    data: centres,
    isError,
    isSuccess,
    isLoading,
  } = api.centre.getAllNamesByUserId.useQuery({
    id: session?.user.id as string,
    role: session?.user.role as string,
  });
  const {
    data: courses,
    isError: isCoursesError,
    isLoading: isCoursesLoading,
  } = api.course.getCourseByCentreId.useQuery({
    centreId: formData.centreId,
  });
  const {
    data: students,
    isError: isStudentsError,
    isSuccess: isStudentsSuccess,
    isLoading: isStudentsLoading,
  } = api.student.getByCentreAndCourseId.useQuery({
    centreId: formData.centreId,
    courseId: formData.courseId,
  });
  const {
    data: paymentData,
    isError: isPaymentDataError,
    isLoading: isPaymentDataLoading,
  } = api.payment.getAllMonthlyPayments.useQuery({
    month: formData.month,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (paymentData) {
      // Filter the payment data whenever the form data changes
      const filteredData = paymentData.filter((payment) => {
        return (
          (!formData.courseId || payment.course.id === formData.courseId) &&
          (!formData.centreId || payment.centre.id === formData.centreId) &&
          (!formData.studentId ||
            payment.student.studentId === formData.studentId)
        );
      });
      console.log(filteredData);
      setFilteredPaymentData(filteredData);
    }
  }, [
    formData.courseId,
    formData.centreId,
    formData.studentId,
    formData.month,
  ]);
  if (status == "unauthenticated") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (
    status == "loading" ||
    isLoading ||
    isCoursesLoading ||
    isStudentsLoading
  ) {
    return <LoadingScreen />;
  }
  if (errorString != "" || isError || isCoursesError || isStudentsError) {
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
      <div className="flex w-full flex-col">
        <div className="relative mt-4 flex w-full flex-row items-center justify-end px-[5%] py-7 lg:flex-col lg:px-[10%]">
          <h1 className=" text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
            Payment Status
          </h1>
          <Link
            className="rounded-full bg-[#FCD56C] px-4 py-2 text-[#202B5D] shadow-md hover:bg-[#FABA09] lg:self-end"
            href="payment-collection"
          >
            Payment Collection
          </Link>
        </div>
        <div className="grid w-4/5 grid-cols-1 gap-x-4 self-center py-7 lg:grid-cols-2">
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
            <option selected disabled value="">
              Select Centre
            </option>
            {centres?.map((centre, index) => {
              return (
                <option value={centre.id} className="text-black">
                  {centre.name}
                </option>
              );
            })}
          </select>
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.courseId == null || formData.courseId == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            value={formData.courseId}
            name="courseId"
            onChange={handleChange}
          >
            <option selected disabled value="">
              Select Course
            </option>
            {courses.map((course, index) => {
              return (
                <option value={course.id} className="text-black">
                  {course.name}
                </option>
              );
            })}
          </select>
          <input
            placeholder="Select Date"
            type="month"
            name="month"
            onChange={handleChange}
            value={formData.month}
            className="h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.studentId == null || formData.studentId == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            value={formData.studentId}
            name="studentId"
            onChange={handleChange}
          >
            <option selected disabled>
              Select Student
            </option>
            {students.map((student, index) => {
              return (
                <option value={student.studentId} className="text-black">
                  Name: {student.name}, Parent: {student.parentName}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-span-2 mt-4 flex w-4/5 flex-col justify-end gap-x-6 gap-y-4 self-center  lg:flex-row">
          <button
            className="w-48 self-end rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]"
            onClick={() => {
              setFormData({
                centreId: "",
                courseId: "",
                month: "",
              } as PaymentStatusForm);
              setFilteredPaymentData(undefined);
              console.log(formData);
            }}
          >
            Clear
          </button>
        </div>
        <div className="mt-4 flex w-4/5 flex-col justify-start gap-x-6 gap-y-4 self-center lg:w-4/5 lg:flex-row">
          {filteredPaymentData ? (
            <PaymentTable payments={filteredPaymentData} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </MainPageTemplate>
  );
};

export default PaymentStatus;
