import Link from "next/link";
import React, { useRef, useState } from "react";
import { FaPen } from "react-icons/fa";

interface CentreTableProps {
  centres: CentreData[];
}
interface CentreData {
  name: string;
  id: string;
  location: string;
  faculties: {
    name: string;
  }[];
}

const CentreTable: React.FunctionComponent<CentreTableProps> = ({
  centres,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCentres = centres.filter((centre) => {
    const matchesSearch = centre.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
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
                ID
              </th>
              <th className="border-b border-r border-dashed p-2">Name</th>

              <th className="border-b border-r border-dashed p-2">Location</th>
              <th className="border-b border-r border-dashed p-2">
                Faculty Names
              </th>
              <th className="border-b border-r border-dashed p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {filteredCentres?.map((centre, index) => (
              <tr key={index} className="border-b border-dashed text-center">
                <td className="border border-dashed p-2">{centre.id}</td>
                <td className="border border-dashed p-2">{centre.name}</td>
                <td className="border border-dashed p-2">{centre.location}</td>
                <td className="border border-dashed p-2">
                  {centre.faculties.map((f) => f.name).join(", ") || "N/A"}
                </td>
                <td className="border border-dashed p-2 text-center text-[#DCA200]">
                  <Link
                    href={{
                      pathname: "/update-centre",
                      query: {
                        id: centre.id,
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
export default CentreTable;
