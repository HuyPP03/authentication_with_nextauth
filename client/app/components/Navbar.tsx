import React from "react";
import Header from "./Header";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-2">
      <Header />
      {children}
    </div>
  );
};

export default Navbar;
