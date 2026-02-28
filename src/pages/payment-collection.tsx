import { Modal } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import CustomMonthDropdown from "~/components/customMonthDropdown";
import ErrorScreen from "~/components/errorScreen";
import LoadingScreen from "~/components/loadingScreen";
import SuccessPopup from "~/components/successPopup";
import { MainPageTemplate } from "~/templates";
import { api } from "~/utils/api";
interface PaymentCollectionForm {
  studentId: string;
  centreId: string;
  courseId: string;
  amountPaid: string;
  status: string;
  paymentFor: string;
  paymentMonths: Date[];
}
const PaymentCollection: React.FunctionComponent = () => {
  const [errorString, setErrorString] = useState("");
  const [isScuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<PaymentCollectionForm>({
    centreId: "",
    courseId: "",
  } as PaymentCollectionForm);
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
  const createPayment = api.payment.create.useMutation({
    onError(error) {
      setErrorString(error.message);
    },
    onSuccess() {
      setIsSuccess(true);
      setFormData({centreId: "",
      courseId: "", amountPaid: '', paymentMonths: [] as Date[], paymentFor: '', } as PaymentCollectionForm);
    },
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "studentId") {
      const tempCourseName = students?.find((student) => student.studentId === value)?.course[0]?.name;
      const tempCourseId = courses?.find((course) => course.name === tempCourseName)?.id;
      setFormData((prev) => ({
        ...prev,
        studentId: value,
        courseId: tempCourseId ?? "",
      }));
      return;
    }
    else if (name === "courseId") {
      setFormData((prev) => ({
        ...prev,
        studentId: '',
        courseId: value ?? "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "paymentFor" && { studentId: "" }), // Reset studentId when paymentFor changes
    }));
  };

  const handleSubmit =  (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      amountPaid: Number(formData.amountPaid), // Ensure it's a number

      status: formData.status as "PAID" | "PENDING" | "PARTIAL", // Type assertion
    };

     createPayment.mutate(formattedData);

    
  };
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
        <div className="relative flex w-full flex-row items-center justify-end px-[5%] py-7 lg:flex-col lg:px-[10%]">
          <h1 className="text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
            Payment Collection
          </h1>
          <Link
            className="rounded-full bg-[#FCD56C] px-4 py-2 text-[#202B5D] shadow-md hover:bg-[#FABA09] lg:self-end"
            href="payment-status"
          >
            Payment Status
          </Link>
        </div>
        <form
          className="flex w-4/5 flex-col gap-x-4 self-center py-7 lg:grid lg:grid-cols-2"
          onSubmit={handleSubmit}
        >
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
            <option selected value=''>
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
            <option selected value="">
              Select Student
            </option>
            {students
              ?.filter((student) =>
                formData.paymentFor === "Readdmission Fees"
                  ? student.readdmission
                  : true
              )
              .map((student) => (
                <option
                  value={student.studentId}
                  className="text-black"
                  key={student.studentId}
                >
                  {student.name}, Parent: {student.parentName}
                </option>
              ))}
          </select>

          <div className="w-full lg:col-span-2">
            {formData.paymentFor !== "Readdmission Fees" && (
              <CustomMonthDropdown
                setSelectedValues={(dateArray) => {
                  setFormData({ ...formData, paymentMonths: dateArray });
                }}
                values={formData.paymentMonths}
              />
            )}
          </div>
          <select
            className={`h-12 w-full justify-self-center border-b border-b-[#919191] focus:outline-none ${
              formData.status == null || formData.status == ""
                ? "text-gray-400"
                : "text-black"
            }`}
            name="status"
            onChange={handleChange}
          >
            <option selected value=''>
              Payment Type
            </option>
            <option value="PARTIAL" className="text-black">
              PARTIAL
            </option>
            <option value="PAID" className="text-black">
              PAID
            </option>
            <option value="PENDING" className="text-black">
              PENDING
            </option>
          </select>
          <input
            name="amountPaid"
            onChange={handleChange}
            placeholder="Payable Amount"
            value={formData.amountPaid}
            type="number"
            className="h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
          />
          <div className="col-span-2 mt-4 flex w-full flex-col justify-end gap-x-6 gap-y-4 self-center lg:w-full lg:flex-row">
            <button
              className="w-48 self-end rounded-lg bg-[#FCD56C] p-6 text-[#202B5D]"
              type="submit"
            >
              Pay Fees
            </button>
          </div>
        </form>
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
            setFormData({
              centreId: "",
              courseId: "",
              paymentMonths: [] as Date[],
            } as PaymentCollectionForm);
          }}
          message="Payment Collected succesfully"
        />
      </Modal>
    </MainPageTemplate>
  );
};

export default PaymentCollection;
