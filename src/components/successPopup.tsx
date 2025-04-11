import React from "react";
import Image from "next/image";
import { successImg } from "public";
interface SuccessPopupProps {
  message: string;
  onClick?: () => void;
}
const SuccessPopup: React.FunctionComponent<SuccessPopupProps> = (props) => {
  return (
    <div className="flex h-2/5 w-4/5 flex-col items-center justify-evenly bg-white md:w-3/5 lg:w-2/5">
      <Image src={successImg} alt="" className="h-24 w-24" />
      <p>{props.message}</p>
      <button
        className="h-10 w-24 bg-[#F36562] text-white"
        onClick={props.onClick}
      >
        Ok
      </button>
    </div>
  );
};

export default SuccessPopup;
