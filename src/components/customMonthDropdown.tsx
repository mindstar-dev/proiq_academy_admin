import React, { useRef, useState, useEffect } from "react";

interface CustomDropdownProps {
  setSelectedValues: (months: Date[]) => void;
  values?: Date[]; // 👈 make optional
  className?: string;
  placeHolder?: string;
}

const CustomMonthDropdown: React.FC<CustomDropdownProps> = ({
  setSelectedValues,
  values = [], // 👈 default to empty array
  className,
  placeHolder = "Select Months",
}) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ---------------- Generate Months ---------------- */
  const monthObjects = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(year, index + 1, 0);
    return {
      label: date.toLocaleString("default", { month: "long" }),
      date,
    };
  });

  /* ---------------- Handle Select ---------------- */
  const handleSelect = (monthIndex: number) => {
    const newDate = new Date(year, monthIndex + 1, 0);

    const exists = values.some(
      (d) => d.getTime() === newDate.getTime()
    );

    if (exists) {
      setSelectedValues(
        values.filter((d) => d.getTime() !== newDate.getTime())
      );
    } else {
      setSelectedValues([...values, newDate]);
    }
  };

  /* ---------------- Outside Click ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full ${className ?? ""} flex flex-col gap-4 lg:grid lg:grid-cols-2`}
    >
      {/* Dropdown Button */}
      <div
        className="flex min-h-12 cursor-pointer items-center justify-between border-b border-b-[#919191]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={values.length ? "text-black" : "text-gray-500"}>
          {values.length
            ? [...values]
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date) =>
                  date.toLocaleString("default", { month: "short" })
                )
                .join(", ")
            : placeHolder}
        </span>
        <span>▼</span>
      </div>

      {/* Year Input */}
      <input
        type="number"
        min="1900"
        max="2100"
        value={year}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          setYear(isNaN(val) ? currentYear : val);
          setSelectedValues([]); // clear safely
        }}
        className="h-12 w-full border-b border-b-[#919191] pl-1 focus:outline-none"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-14 z-10 w-full rounded-md border bg-white shadow-md">
          {monthObjects.map((month, index) => {
            const isChecked = values.some(
              (d) => d.getTime() === month.date.getTime()
            );

            return (
              <label
                key={index}
                className="flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleSelect(index)}
                  className="h-4 w-4"
                />
                {month.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomMonthDropdown;