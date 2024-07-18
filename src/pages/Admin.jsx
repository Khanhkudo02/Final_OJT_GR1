import { Menu } from "antd";
import React from "react";

function Admin() {
  return (
    <div>
      <h1>This is Admin page</h1>
      <Menu
        item={[
          { lable: "Home" },
          { lable: "Home" },
          { lable: "Home" },
          { lable: "Home" },
          { lable: "Home" },
        ]}
      ></Menu>
    </div>
  );
}

export default Admin;
