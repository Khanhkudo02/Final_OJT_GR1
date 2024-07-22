import React from "react";
import LogoutButton from "../Components/LogoutButton";

function Employee() {
  return (
    <div>
      <h1>This is employee page</h1>
      <LogoutButton></LogoutButton>
      <Sidebar />
    </div>
  );
}

export default Employee;
