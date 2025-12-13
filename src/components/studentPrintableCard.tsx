"use client";

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
        className="p-8 bg-white text-black w-full print:p-8 print:bg-white"
      >
        <h1 className="text-2xl font-bold text-center pb-3 border-b">
          Student Registration Details
        </h1>

        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* LEFT SECTION */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Student Details</h2>

            <p><strong>Full Name:</strong> {name}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Date of Birth:</strong> {dob}</p>
            <p><strong>ID Proof Type:</strong> {idProofType}</p>
            <p><strong>ID Proof Number:</strong> {idProof}</p>
            <p><strong>Centre:</strong> {centreId}</p>

            <p>
              <strong>Courses:</strong>{" "}
              {courseNames && courseNames.length > 0
                ? courseNames.join(", ")
                : "N/A"}
            </p>

            <p>
              <strong>Class Days:</strong>{" "}
              {classDays && classDays.length > 0
                ? classDays.join(", ")
                : "N/A"}
            </p>

            <p>
              <strong>Re-admission:</strong>{" "}
              {readdmission ? "Yes" : "No"}
            </p>

            <h2 className="text-xl font-semibold mt-6">Parent Details</h2>

            <p><strong>Parent Name:</strong> {parentName}</p>
            <p><strong>Parent Occupation:</strong> {parentOccupation}</p>
            <p><strong>Contact Number 1:</strong> {parentContactNumber1}</p>

            {parentContactNumber2 && (
              <p><strong>Alternative Contact:</strong> {parentContactNumber2}</p>
            )}
          </div>

          {/* PHOTO SECTION */}
          <div className="flex justify-center">
            <div className="w-40 h-48 border rounded overflow-hidden bg-gray-100 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Student Photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">No Photo</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintableStudentCard.displayName = "PrintableStudentCard";
export default PrintableStudentCard;
