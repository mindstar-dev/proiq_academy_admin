import React from "react";
import { SideBar, TopBar } from "~/components";
interface TemplateProps {
  children?: JSX.Element | JSX.Element[];
}

const MainPageTemplate: React.FunctionComponent<TemplateProps> = ({
  children,
}) => {
  return (
    <div className="flex h-full w-full overflow-auto">
      <SideBar />
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-[90%] w-[90%] flex-col overflow-auto rounded-lg border border-black">
          <TopBar />
          <div className="flex h-full w-full flex-wrap overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainPageTemplate;
