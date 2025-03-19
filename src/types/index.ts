import { $Enums } from "@prisma/client";
import { z } from "zod";

export const PostInput = z.object({
  name: z.string({ required_error: "Name can't be empty" }),
});

export const UserInput = z.object({
  email: z
    .string({ required_error: "Email can't be empty" })
    .email("Invalid email"),
  name: z.string({ required_error: "Name can't be empty" }),
  password: z.string({ required_error: "Password can't be empty" }),
  userType: z.string({ required_error: "User type can't be empty" }),
  imageUrl: z.string({ required_error: "Image URL can't be empty" }),
  phoneNumber: z.string({ required_error: "Phone number can't be empty" }),
  centres: z.array(z.string({ required_error: "Centre ID can't be empty" })),
  status: z.string({ required_error: "Status can't be empty" }).optional(),
  dob: z.date({ required_error: "DOB can't be empty" }),
  idProof: z.string({ required_error: "ID proof can't be empty" }),
  idProofType: z.string({ required_error: "ID proof type can't be empty" }),
  address: z.string({ required_error: "Address can't be empty" }),
});
export const UserUpdateInput = z.object({
  id: z.string({ required_error: "User ID can't be empty" }),
  email: z
    .string({ required_error: "Email can't be empty" })
    .email("Invalid email"),
  name: z.string({ required_error: "Name can't be empty" }),
  userType: z.string({ required_error: "User type can't be empty" }),
  imageUrl: z.string({ required_error: "Image URL can't be empty" }),
  phoneNumber: z.string({ required_error: "Phone number can't be empty" }),
  centres: z.array(z.string({ required_error: "Centre ID can't be empty" })),
  status: z.string({ required_error: "Status can't be empty" }).optional(),
  dob: z.date({ required_error: "DOB can't be empty" }),
  idProof: z.string({ required_error: "ID proof can't be empty" }),
  idProofType: z.string({ required_error: "ID proof type can't be empty" }),
  address: z.string({ required_error: "Address can't be empty" }),
});

export const DemoInput = z.object({
  id: z.string({ required_error: "ID can't be empty" }),
});

export const StudentInput = z.object({
  studentId: z.string().optional(),
  name: z.string({ required_error: "Name can't be empty" }),
  address: z.string({ required_error: "Address can't be empty" }),
  parentName: z.string({ required_error: "Parent name can't be empty" }),
  parentOccupation: z.string({
    required_error: "Parent occupation can't be empty",
  }),
  parentContactNumber1: z.string({
    required_error: "Parent contact number 1 can't be empty",
  }),
  parentContactNumber2: z.string().optional(),
  idProof: z.string({ required_error: "ID proof can't be empty" }),
  idProofType: z.string({ required_error: "ID proof type can't be empty" }),
  centreId: z.string({ required_error: "Centre ID can't be empty" }),
  status: z.string({ required_error: "Status can't be empty" }).optional(),
  dob: z.date({ required_error: "DOB can't be empty" }),
  classDays: z.array(z.string(), {
    required_error: "Class days can't be empty",
  }),
  courseNames: z.array(z.string(), {
    required_error: "Course name can't be empty",
  }),
  readdmission: z.boolean().optional(),
  imageUrl: z.string({ required_error: "Image URL can't be empty" }),
});

export const StudentClassInput = z.object({
  studentId: z.string({ required_error: "Student ID can't be empty" }),
  classId: z.string({ required_error: "Class ID can't be empty" }),
});

export const CourseInput = z.object({
  name: z.string({ required_error: "Subject can't be empty" }),
  centreNames: z.array(z.string(), {
    required_error: "Centres can't be empty",
  }),
  facultyNames: z.array(z.string(), {
    required_error: "Faculties can't be empty",
  }),
});
export const UpdateCourseInput = z.object({
  id: z.string({ required_error: "Course ID can't be empty" }),
  name: z.string({ required_error: "Subject can't be empty" }),
  centreNames: z.array(z.string(), {
    required_error: "Centres can't be empty",
  }),
  facultyNames: z.array(z.string(), {
    required_error: "Faculties can't be empty",
  }),
});
export const CentreInput = z.object({
  name: z.string({ required_error: "Name can't be empty" }),
  location: z.string({ required_error: "Location can't be empty" }),
});
export const UpdateCentreInput = z.object({
  id: z.string({ required_error: "Centre ID can't be empty" }),
  name: z.string({ required_error: "Name can't be empty" }),
  location: z.string({ required_error: "Location can't be empty" }),
});

export const AttendanceInput = z.array(
  z.object({
    studentId: z.string({ required_error: "Student ID can't be empty" }),
    courseId: z.string({ required_error: "Course ID can't be empty" }),
    centreId: z.string({ required_error: "Centre ID can't be empty" }),
    date: z.date({ required_error: "Date can't be empty" }),
    status: z.nativeEnum($Enums.AttendanceStatus, {
      required_error: "Attendance status can't be empty",
    }),
    centre: z.object({
      name: z.string({ required_error: "Centre name can't be empty" }),
    }),
    course: z.object({
      name: z.string().nullable().optional(), // Matches `string | undefined`
    }),
    student: z.object({
      name: z.string({ required_error: "Student name can't be empty" }),
      parentName: z.string({ required_error: "Parent name can't be empty" }),
    }),
  })
);
export const GetAttendanceInput = z.object({
  courseId: z.string({ required_error: "Class ID can't be empty" }),
  centreId: z.string({ required_error: "Centre ID can't be empty" }),
  date: z.date({ required_error: "Date can't be empty" }),
});
export const PaymentInput = z.object({
  studentId: z.string({ required_error: "Student ID can't be empty" }),
  centreId: z.string({ required_error: "Centre ID can't be empty" }),
  courseId: z.string({ required_error: "Course ID can't be empty" }),
  amountPaid: z.number({ required_error: "Amount paid can't be empty" }),
  paymentDate: z.date({ required_error: "Payment date can't be empty" }),
  status: z.enum(["PAID", "PENDING", "PARTIAL"], {
    required_error: "Payment status can't be empty",
  }),
  paymentFor: z.string({ required_error: "Payment Type can't be empty" }),
});
export const MonthlyPaymentInput = z.object({
  centreId: z.string({ required_error: "Centre ID can't be empty" }),
  courseId: z.string({ required_error: "Course ID can't be empty" }),
  studentId: z.string().optional(),
  month: z
    .string({ required_error: "Month can't be empty" })
    .regex(/^\d{4}-\d{2}$/),
});
export const ReaddmissionInput = z.object({
  studentData: z.array(
    z.object({
      studentId: z.string({ required_error: "Student ID can't be empty" }),
      readdmission: z
        .boolean({
          required_error: "Readdmission can't be empty",
        })
        .optional(),
      readdmissionPaymentStatus: z
        .boolean({
          required_error: "Readdmission Payment Status can't be empty",
        })
        .optional(),
    })
  ),
  readdmissionPaymentAmount: z.number({
    required_error: "Readdmission Payment Amount can't be empty",
  }),
  centreId: z.string({ required_error: "Centre ID can't be empty" }),
  courseId: z.string({
    required_error: "Course Id can't be empty",
  }),
  readdmissionCourseId: z.string({
    required_error: "Readdmission Course Id can't be empty",
  }),
});
