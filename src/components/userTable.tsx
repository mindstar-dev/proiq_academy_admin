import Image from "next/image";
import React, { useRef, useState } from "react";

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
      <div className="relative flex w-full flex-col-reverse items-start justify-start gap-y-2 py-7 lg:flex-row">
        <div className="mb-4 flex space-x-2 self-start">
          <input
            type="text"
            placeholder="Search Student"
            className="w-full rounded-md border p-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="rounded-md bg-yellow-500 px-4 py-2 text-white">
            🔍
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto" ref={tableContainerRef}>
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
              <th className="border-b border-r border-dashed p-2">User Type</th>
              <th className="border-b border-r border-dashed p-2">Centres</th>
              <th className="border-b border-r border-dashed p-2">Courses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {users?.map((user, index) => (
              <tr key={index} className="border-b border-dashed text-center">
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

                <td className="border border-dashed p-2">
                  {user.id.slice(0, 8)}
                </td>
                <td className="border border-dashed p-2">{user.name}</td>
                <td className="border border-dashed p-2">{user.email}</td>
                <td className="border border-dashed p-2">{user.phoneNumber}</td>
                <td className="border border-dashed p-2">{user.userType}</td>
                <td className="border border-dashed p-2">
                  {user.centres.map((c) => c.name).join(", ") || "N/A"}
                </td>
                <td className="border border-dashed p-2">
                  {user.courses.map((c) => c.name).join(", ") || "N/A"}
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
