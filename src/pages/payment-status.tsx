import { $Enums } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import PaymentTable from "~/components/paymentTable";
import PrintablePaymentTable from "~/components/printablePaymentTable";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
interface PaymentStatusForm {
  studentId: string;
  centreId: string;
  courseId: string;
  paymentFor: string;
  startingMonth: string;
  endingMonth: string;
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
  paymentFor: string;
  paymentMonths: Date[];
  dateTime: Date;
  id: string;
}
const PaymentStatus: React.FunctionComponent = () => {
  const [errorString, setErrorString] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<PaymentStatusForm>({
    centreId: "",
    courseId: "",
    startingMonth: "",
    endingMonth: "",
  } as PaymentStatusForm);
  const [filteredPaymentData, setFilteredPaymentData] =
    useState<PaymentData[]>();
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
  } = api.course.getCourseByCentreId.useQuery({
    centreId: formData.centreId,
  });
  const {
    data: students,
    isError: isStudentsError,
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
    startingMonth: formData.startingMonth,
    endingMonth: formData.endingMonth,
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
            payment.student.studentId === formData.studentId) &&
          (!formData.paymentFor || payment.paymentFor === formData.paymentFor)
        );
      });
      setFilteredPaymentData(filteredData);
    }
  }, [
    formData.courseId,
    formData.centreId,
    formData.studentId,
    formData.startingMonth,
    formData.paymentFor,
    paymentData,
  ]);
  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: "Payment Receipt",
    
  });
  if (status == "unauthenticated") {
    return (
      <ErrorScreen errorString="You dont have permission to access this screen" />
    );
  }
  if (
    status == "loading" ||
    isLoading ||
    isCoursesLoading ||
    isStudentsLoading ||
    isPaymentDataLoading
  ) {
    return <LoadingScreen />;
  }
  if (
    errorString != "" ||
    isError ||
    isCoursesError ||
    isStudentsError ||
    isPaymentDataError
  ) {
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
              formData.paymentFor == null || formData.paymentFor == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            name="paymentFor"
            onChange={handleChange}
            value={formData.paymentFor}
          >
            <option selected disabled value="">
              Payment For
            </option>
            <option value="Course Fees" className="text-black">
              Course Fees
            </option>
            <option value="Readdmission Fees" className="text-black">
              Readdmission Fees
            </option>
            <option value="New Addmission Fees" className="text-black">
              New Addmission Fees
            </option>
          </select>
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
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none `}
            value={formData.courseId}
            name="courseId"
            onChange={handleChange}
          >
            <option selected value="">
              All
            </option>
            {courses.map((course) => {
              return (
                <option
                  value={course.id}
                  className="text-black"
                  key={course.id}
                >
                  {course.name}
                </option>
              );
            })}
          </select>
          <div className="relative w-full">
            <label
              htmlFor="startingMonth"
              className={`absolute left-1 top-1/2 -translate-y-1/2 transform text-gray-400 transition-all ${
                formData.startingMonth
                  ? "top-2 text-xs text-black"
                  : "bg-white text-base"
              }`}
            >
              {formData.startingMonth ? "" : "Select Starting Month"}
            </label>
            <input
              id="startingMonth"
              type="month"
              name="startingMonth"
              onChange={handleChange}
              value={formData.startingMonth}
              className="h-12 w-full border-b border-b-[#919191] pl-1 focus:outline-none"
            />
          </div>
          <div className="relative w-full">
            <label
              htmlFor="endingMonth"
              className={`text-g ray-400 absolute left-1 top-1/2 -translate-y-1/2  transform text-gray-400  transition-all ${
                formData.endingMonth
                  ? "top-2 text-xs text-black"
                  : "bg-white text-base"
              }`}
            >
              {formData.endingMonth ? "" : "Select Ending Month"}
            </label>
            <input
              placeholder="Select Ending Month"
              type="month"
              name="endingMonth"
              onChange={handleChange}
              value={formData.endingMonth}
              className=" h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
            />
          </div>

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
            {students.map((student) => {
              return (
                <option
                  value={student.studentId}
                  className="text-black"
                  key={student.studentId}
                >
                  {student.name}, Parent: {student.parentName}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-span-2 mt-4 flex w-4/5 flex-col justify-end gap-x-6 gap-y-4 self-center  lg:flex-row">
          <button
            className="w-48 self-end rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]"
            onClick={() => {
              handlePrint();
            }}
          >
            Print
          </button>
          <button
            className="w-48 self-end rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]"
            onClick={() => {
              setFormData({
                centreId: "",
                courseId: "",
                startingMonth: "",
              } as PaymentStatusForm);
              setFilteredPaymentData(undefined);
              console.log(formData);
            }}
          >
            Clear
          </button>
        </div>
        <div
          className="mt-4 flex w-4/5 flex-col justify-start gap-x-6 gap-y-4 self-center pb-4 lg:w-4/5 lg:flex-row"
          ref={tableRef}
        >
          {filteredPaymentData ? (
            <>
              <PaymentTable payments={filteredPaymentData} />
              <PrintablePaymentTable payments={filteredPaymentData} ref={tableRef}/>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </MainPageTemplate>
  );
};

export default PaymentStatus;
