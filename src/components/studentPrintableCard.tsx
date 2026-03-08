"use client";

import Image from "next/image";
import bg from "../../public/student-print-bg.jpg";
import React, { forwardRef } from "react";

export interface Props {
  id?: string;
  name: string;
  address: string;
  parentName: string;
  parentOccupation: string;
  parentContactNumber1: string;
  parentContactNumber2?: string;
  idProof: string;
  idProofType: string;
  centreId: string;
  centreName?: string;
  courseNames: string[];
  classDays: string[];
  readdmission: boolean;
  imageUrl: string;
  dob: string;
}

const PrintableStudentCard = forwardRef<HTMLDivElement, Props>(
  (
    {
      name,
      address,
      parentName,
      parentOccupation,
      parentContactNumber1,
      parentContactNumber2,
      idProof,
      idProofType,
      centreId,
      courseNames,
      classDays,
      readdmission,
      imageUrl,
      dob,
      id,
      centreName,
    },
    ref
  ) => {
    return (
      <div
        className="m-0 h-[1123px] max-h-[1123px] w-[793px] max-w-[793px] overflow-hidden bg-white p-0"
        ref={ref}
      >
        <img
          src="student-print-bg.jpg"
          alt="A4 Print"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
        <div className="relative z-10 flex h-full flex-col px-20 pt-[260px]">
          <div className="grid grid-cols-4 grid-rows-[15] text-lg">
            <div className="col-span-3 py-1 pl-2 ">
              <strong>Id:</strong> {id}
            </div>
            <img
              src={imageUrl}
              alt="Student Photo"
              className="col-start-4 row-start-1 row-end-[15] h-fit w-fit m-4 mr-0 justify-self-end"
            />
            <div className="col-span-3 pl-2">
              <strong>Full Name:</strong> {name}
            </div>
            <div className="col-span-3 pl-2">
              <strong>Date Of Birth:</strong> {dob}
            </div>
            <div className="col-span-3 pl-2">
              <strong>ID Proof Type:</strong> {idProofType}
            </div>
            <div className="col-span-3 pl-2">
              <strong>ID Proof Number:</strong> {idProof}
            </div>
            <div className="col-span-3 pl-2">
              <strong>Centre Name:</strong> {centreName}
            </div>
            <div className="col-span-3 pl-2">
              <strong>Courses:</strong> {courseNames}
            </div>
            <div className="col-span-3 pl-2">
              <strong>Class Days:</strong> {classDays}
            </div>
            <div className="col-span-3 pl-2">
              <strong>Re-Admission:</strong> {readdmission}
            </div>
            <div className="col-span-3 pl-2">
              <strong>Parent Name:</strong> {parentName}
            </div>
            <div className="col-span-4 pl-2">
              <strong>Address:</strong> {address}
            </div>
            <div className="col-span-3 pl-2">
              <strong>Parent Occupation:</strong> {parentOccupation}
            </div>
            <div className="col-span-3 pl-2">
              <strong>Contact Number:</strong> {parentContactNumber1}
            </div>
            {parentContactNumber2 && <div className="col-span-3 pl-2">
              <strong>Alternative Contact Number:</strong> {parentContactNumber2}
            </div>}
          </div>
        </div>
        <style jsx global>{`
          @page {
            size: A4 portrait;
            margin: 0;
          }

          @media print {
            html,
            body {
              margin: 0;
              padding: 0;
            }

            .print-area,
            .print-area * {
              visibility: visible;
            }
          }
        `}</style>
      </div>
    );
  }
);

PrintableStudentCard.displayName = "PrintableStudentCard";
export default PrintableStudentCard;
