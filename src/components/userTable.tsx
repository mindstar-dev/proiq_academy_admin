import { $Enums } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { FaPen } from "react-icons/fa";

interface CentreTableProps {
  users: UserData[];
}
interface UserData {
  email: string;
  id: string;
  userType: string;
  phoneNumber: string;
  name: string;
  imageUrl: string;
  address: string;
  status: $Enums.UserStatus;
  centres: {
    name: string;
  }[];
  courses: {
    name: string;
  }[];
}

const UserTable: React.FunctionComponent<CentreTableProps> = ({ users }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setScrollLeft(tableContainerRef.current.scrollLeft);
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tableContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Speed factor
    tableContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle mouse up / leave
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  return (
    <div className="w-full py-6">
      <div
        className={`w-full overflow-x-auto ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        } select-none`}
        ref={tableContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <table className="min-w-full table-auto whitespace-nowrap">
          <thead>
            <tr className="border-b border-dashed">
              <th className="border-b border-l border-r border-dashed p-2">
                Image
              </th>
              <th className="border-b border-r border-dashed p-2">ID</th>
              <th className="border-b border-r border-dashed p-2">Name</th>
              <th className="border-b border-r border-dashed p-2">Email</th>
              <th className="border-b border-r border-dashed p-2">Phone No.</th>
              <th className="border-b border-r border-dashed p-2">Address</th>
              <th className="border-b border-r border-dashed p-2">User Type</th>
              <th className="border-b border-r border-dashed p-2">Centres</th>
              <th className="border-b border-r border-dashed p-2">Courses</th>
              <th className="border-b border-r border-dashed p-2">Status</th>
              <th className="border-b border-r border-dashed p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {users?.map((user, index) => (
              <tr
                key={index}
                className={`border-b-dashed border-b text-center ${
                  user.status !== $Enums.UserStatus.CONTINUE
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                <td
                  className={`border border-dashed p-2 ${
                    user.imageUrl.startsWith("http") ||
                    user.imageUrl.startsWith("https")
                      ? "min-w-28"
                      : ""
                  }`}
                >
                  {user.imageUrl.startsWith("http") ||
                  user.imageUrl.startsWith("https") ? (
                    <Image
                      src={user.imageUrl}
                      alt=""
                      width={100}
                      height={100}
                    />
                  ) : (
                    <></>
                  )}
                </td>

                <td className="border border-dashed p-2">{user.id}</td>
                <td className="border border-dashed p-2">{user.name}</td>
                <td className="border border-dashed p-2">{user.email}</td>
                <td className="border border-dashed p-2">{user.phoneNumber}</td>
                <td className="border border-dashed p-2">{user.address}</td>
                <td className="border border-dashed p-2">{user.userType}</td>
                <td className="border border-dashed p-2">
                  {user.centres.map((c) => c.name).join(", ") || "N/A"}
                </td>
                <td className="border border-dashed p-2">
                  {user.courses.map((c) => c.name).join(", ") || "N/A"}
                </td>
                <td className="border border-dashed p-2">{user.status}</td>
                <td className="border border-dashed p-2 text-center text-[#DCA200]">
                  <Link
                    href={{
                      pathname: "/update-user",
                      query: {
                        id: user.id,
                      },
                    }}
                    className="cursor-pointer"
                  >
                    <FaPen className="flex w-full" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UserTable;
