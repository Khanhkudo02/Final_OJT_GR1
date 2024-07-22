import React from "react";
import LogoutButton from "../Components/LogoutButton";

function Employee() {
  return (
    <div>
      <h1>This is employee page</h1>
      <Sidebar />
      <LogoutButton></LogoutButton>
    </div>
  );
}

export default Employee;
