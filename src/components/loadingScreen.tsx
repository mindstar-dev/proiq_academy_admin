import Image from "next/image";
import { loadingImg } from "public";
import React from "react";
import { MainPageTemplate } from "~/templates";
const LoadingScreen: React.FunctionComponent = () => {
  return (
    <MainPageTemplate>
      <div className="flex h-full w-full flex-col items-center justify-center self-center justify-self-center bg-white">
        <Image src={loadingImg} alt="" className="h-24 w-24 animate-spin" />
        <p>Loading</p>
      </div>
    </MainPageTemplate>
  );
};
export default LoadingScreen;
