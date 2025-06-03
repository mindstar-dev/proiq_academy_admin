import React from "react";
import Image from "next/image";
import { loadingImg } from "public";

const LoadingPopup: React.FunctionComponent = () => {
  return (
    <div className="flex h-2/5 w-4/5 flex-col items-center justify-evenly bg-white md:w-3/5 lg:w-2/5">
      <Image src={loadingImg} alt="" className="h-24 w-24 animate-spin" />
      <p>Loading</p>
    </div>
  );
};

export default LoadingPopup;
