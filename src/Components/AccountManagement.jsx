import React from "react";
import { Table, Button } from "antd";
import axios from "axios";

const AccountManagement = () => {
  return (
    <main>
      <section className="account">
        <div className="account-view"></div>
        <div className="account-create"></div>
        <div className="account-eidt"></div>
        <div className="account-delete"></div>
      </section>

      <section className="reset"></section>
    </main>
  );
};

export default AccountManagement;
