import React from "react";
import { Menu } from "antd";

function Users() {
  return (
    <div>
      <h1>This is employee page</h1>
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

export default Users;
