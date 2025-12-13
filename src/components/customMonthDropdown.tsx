import React, { useEffect, useRef, useState } from "react";

interface CustomDropdownProps {
  setSelectedValues: (months: Date[]) => void;
  className?: string;
  placeHolder?: string;
}

interface MonthObject {
  month: string;
  date: Date;
}

const CustomMonthDropdown: React.FunctionComponent<CustomDropdownProps> = ({
  setSelectedValues,
  className,
  placeHolder = "Select Months",
}) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute months based on the selected year
  const lastDaysOfMonths: Date[] = Array.from({ length: 12 }, (_, month) => {
    return new Date(year, month + 1, 0);
  });

  const monthObjects: MonthObject[] = lastDaysOfMonths.map((date) => ({
    month: date.toLocaleString("default", { month: "long" }),
    date,
  }));

  // Notify parent on change
  useEffect(() => {
    setSelectedValues(selectedDates);
    console.log("Selected Dates:", selectedDates);
  }, [selectedDates]);

  const handleSelect = (monthIndex: number) => {
    const newDate = new Date(year, monthIndex + 1, 0); // Last day of the selected month in selected year

    setSelectedDates((prev) =>
      prev.some((d) => d.getTime() === newDate.getTime())
        ? prev.filter((d) => d.getTime() !== newDate.getTime())
        : [...prev, newDate]
    );
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative w-full justify-self-center ${className} flex flex-col gap-x-4 self-center lg:grid lg:grid-cols-2`}
      ref={dropdownRef}
    >
      {/* Dropdown Button */}
      <div
        className={`flex min-h-12 cursor-pointer items-center justify-between border-b border-b-[#919191]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`${
            selectedDates.length > 0 ? "text-black" : "text-gray-500"
          }`}
        >
          {selectedDates.length > 0
            ? selectedDates
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
        placeholder="Select Year"
        min="1900"
        max="2100"
        step="1"
        value={year}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          setYear(isNaN(val) ? currentYear : val);
          setSelectedDates([]);
        }}
        className="h-12 w-full min-w-full justify-self-center border-b border-b-[#919191] pl-1 focus:outline-none lg:justify-self-end"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-14 z-10 w-full rounded-md border bg-white shadow-md">
          {monthObjects.map((month, index) => {
            const generatedDate = new Date(year, index + 1, 0);
            const isChecked = selectedDates.some(
              (d) => d.getTime() === generatedDate.getTime()
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
                {month.month}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomMonthDropdown;
