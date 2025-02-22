import Image from "next/image";
import { errorImg } from "public";
import React from "react";
import { MainPageTemplate } from "~/templates";
interface ErrorProps {
  errorString?: string;
}
const ErrorScreen: React.FunctionComponent<ErrorProps> = ({ errorString }) => {
  return (
    <MainPageTemplate>
      <div className="flex h-full w-full flex-col items-center justify-center self-center justify-self-center bg-white">
        <Image src={errorImg} alt="" className="h-24 w-24" />
        <p>{errorString ?? "Error Occured"}</p>
      </div>
    </MainPageTemplate>
  );
};

export default ErrorScreen;
