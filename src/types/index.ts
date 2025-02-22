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
});

export const DemoInput = z.object({
  id: z.string({ required_error: "ID can't be empty" }),
});

export const StudentInput = z.object({
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
  courseDuration: z.string({
    required_error: "Course duration can't be empty",
  }),
  classDays: z.array(z.string(), {
    required_error: "Class days can't be empty",
  }),
  classTiming: z.string({ required_error: "Class timing can't be empty" }),
  courseName: z.string({ required_error: "Course name can't be empty" }),
  readdmission: z.boolean().optional(),
  imageUrl: z.string({ required_error: "Image URL can't be empty" }),
});

export const StudentClassInput = z.object({
  studentId: z.string({ required_error: "Student ID can't be empty" }),
  classId: z.string({ required_error: "Class ID can't be empty" }),
});

export const ClassInput = z.object({
  subject: z.string({ required_error: "Subject can't be empty" }),
  centreId: z.string({ required_error: "Centre ID can't be empty" }),
  facultyId: z.string({ required_error: "Faculty ID can't be empty" }),
  facultyName: z.string({ required_error: "Faculty name can't be empty" }),
});

export const CentreInput = z.object({
  name: z.string({ required_error: "Name can't be empty" }),
  location: z.string({ required_error: "Location can't be empty" }),
});

export const AttendanceInput = z.object({
  studentId: z.string({ required_error: "Student ID can't be empty" }),
  classId: z.string({ required_error: "Class ID can't be empty" }),
  centreId: z.string({ required_error: "Centre ID can't be empty" }),
  date: z.date({ required_error: "Date can't be empty" }),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"], {
    required_error: "Attendance status can't be empty",
  }),
});

export const PaymentInput = z.object({
  studentId: z.string({ required_error: "Student ID can't be empty" }),
  centreId: z.string({ required_error: "Centre ID can't be empty" }),
  amountPaid: z.number({ required_error: "Amount paid can't be empty" }),
  paymentDate: z.date({ required_error: "Payment date can't be empty" }),
  status: z.enum(["PAID", "PENDING", "PARTIAL"], {
    required_error: "Payment status can't be empty",
  }),
});
