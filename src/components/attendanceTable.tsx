import React, { useState } from "react";

const studentsData = [
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241034",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241056",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241034",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241056",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241034",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241056",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241034",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241056",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241034",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241056",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241034",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241056",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
  {
    id: "203241008",
    name: "A Sharma",
    subject: "Abacus",
    date: "22-01-2025",
    time: "2:35 PM",
  },
];

const AttendanceTable: React.FunctionComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = studentsData.filter(
    (student) =>
      student.id.includes(searchQuery) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
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
        <h1 className="self-center text-3xl md:absolute md:left-1/2 md:-translate-x-1/2">
          Attendacne
        </h1>
      </div>
      {/* Search Bar */}

      {/* Scrollable Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto whitespace-nowrap">
          <thead>
            <tr className="border-b border-dashed">
              <th className="border-b border-l border-r border-dashed p-2">
                ID
              </th>
              <th className="border-b border-r border-dashed p-2">Name</th>
              <th className="border-b border-r border-dashed p-2">Subject</th>
              <th className="border-b border-r border-dashed p-2">Date</th>
              <th className="border-b border-r border-dashed p-2">Time</th>
              <th className="border-b border-r border-dashed p-2">Present</th>
              <th className="border-b border-r border-dashed p-2">Absent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {filteredStudents.map((student, index) => (
              <tr key={index} className="border-b border-dashed">
                <td className="border border-dashed p-2">{student.id}</td>
                <td className="border border-dashed p-2">{student.name}</td>
                <td className="border border-dashed p-2">{student.subject}</td>
                <td className="border border-dashed p-2">{student.date}</td>
                <td className="border border-dashed p-2">{student.time}</td>
                <td className="border border-dashed p-2 text-center text-green-500">
                  ☑️
                </td>
                <td className="border border-dashed p-2 text-center text-red-500">
                  ☐
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AttendanceTable;
