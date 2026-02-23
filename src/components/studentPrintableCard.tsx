"use client";

import Image from "next/image";
import bg from "../../public/print-bg.png";
import React, { forwardRef } from "react";

export interface Props {
  name: string;
  address: string;
  parentName: string;
  parentOccupation: string;
  parentContactNumber1: string;
  parentContactNumber2?: string;
  idProof: string;
  idProofType: string;
  centreId: string;
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
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="w-full bg-white p-8 text-black print:bg-white print:p-8"
      >
        <div className="fixed z-10 max-h-full w-full">
          <Image
            src={bg}
            alt="print bg"
            className="fixed z-0  max-h-full w-full "
          />
          <h1 className="pb-3 text-center text-xl font-bold top-32 relative">
            Student Registration Details
          </h1>
          <div className="z-10 mt-6 grid grid-cols-3 gap-2 left-32 top-32 relative">
            {/* LEFT SECTION */}
            <div className="z-10 col-span-2 space-y-2">

              <p className="text-md">
                <strong>Full Name:</strong> {name}
              </p>
              <p className="text-md">
                <strong>Address:</strong> {address}
              </p>
              <p className="text-md">
                <strong>Date of Birth:</strong> {dob}
              </p>
              <p className="text-md">
                <strong>ID Proof Type:</strong> {idProofType}
              </p>
              <p className="text-md">
                <strong>ID Proof Number:</strong> {idProof}
              </p>
              <p className="text-md"> 
                <strong>Centre:</strong> {centreId}
              </p>

              <p className="text-md">
                <strong>Courses:</strong>{" "}
                {courseNames && courseNames.length > 0
                  ? courseNames.join(", ")
                  : "N/A"}
              </p>

              <p className="text-md">
                <strong>Class Days:</strong>{" "}
                {classDays && classDays.length > 0
                  ? classDays.join(", ")
                  : "N/A"}
              </p>

              <p className="text-md">
                <strong>Re-admission:</strong> {readdmission ? "Yes" : "No"}
              </p>
              <p className="text-md">
                <strong>Parent Name:</strong> {parentName}
              </p>
              <p className="text-md">
                <strong>Parent Occupation:</strong> {parentOccupation}
              </p >
              <p className="text-md">
                <strong>Contact Number 1:</strong> {parentContactNumber1}
              </p>

              {parentContactNumber2 && (
                <p className="text-md">
                  <strong>Alternative Contact:</strong> {parentContactNumber2}
                </p>
              )}
            </div>

            {/* PHOTO SECTION */}
            <div className="z-10 flex justify-center relative right-48">
              <div className="flex h-48 w-40 items-center justify-center overflow-hidden rounded border bg-gray-100">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Student Photo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-500">No Photo</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintableStudentCard.displayName = "PrintableStudentCard";
export default PrintableStudentCard;
