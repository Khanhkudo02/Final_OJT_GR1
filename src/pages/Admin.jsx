import React from "react";
import Sidebar from "../Components/Sidebar";

function Admin() {
  return (
    <div>
      <Menu
        item={[
          { lable: "Home" },
          { lable: "Home" },
          { lable: "Home" },
          { lable: "Home" },
          { lable: "Home" },
        ]}
      ></Menu>
      <Sidebar />
    </div>
  );
}

export default Admin;
