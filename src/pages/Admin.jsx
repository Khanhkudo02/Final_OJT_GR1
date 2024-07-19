import React from "react";
import { Menu } from "antd";

function Admin() {
  return (
    <div>
      <Menu
        item={[
          { lable: "Account" },
          { lable: "Project" },
          { lable: "Technology" },
          { lable: "Position" },
          { lable: "Language" },
          { lable: "Employee" },
        ]}
      ></Menu>
    </div>
  );
}

export default Admin;
