import React, { useEffect, useRef, useState } from "react";
interface CustomDropdownProps {
  selectedValues: string[];
  values: string[];
  setSelectedValues: (centres: string[]) => void;
  className?: string;
  placeHolder?: string;
}
const CustomDropdown: React.FunctionComponent<CustomDropdownProps> = ({
  selectedValues = [],
  setSelectedValues,
  values,
  className,
  placeHolder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleSelect = (item: string) => {
    setSelectedValues(
      selectedValues.includes(item)
        ? selectedValues.filter((c) => c !== item)
        : [...selectedValues, item]
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
      className={`relative w-4/5 justify-self-center ${className}`}
      ref={dropdownRef}
    >
      {/* Dropdown Button */}
      <div
        className="flex h-12 cursor-pointer items-center justify-between border-b border-b-[#919191]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`${
            selectedValues.length > 0 ? "text-black" : "text-gray-500"
          }`}
        >
          {selectedValues.length > 0 ? selectedValues.join(", ") : placeHolder}
        </span>
        <span>▼</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-14 w-full rounded-md border bg-white shadow-md">
          {values.map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(value)}
                onChange={() => handleSelect(value)}
                className="h-4 w-4"
              />
              {value}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
