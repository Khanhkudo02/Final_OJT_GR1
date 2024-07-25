import React from "react";
import { Table, Button } from "antd";
import axios from "axios";
import { RestartAlt } from "@mui/icons-material";

const RestartPassword = () => {
  return (
    <main>
      <div>
      <h2>Account Inforgot</h2>
      <p>This is the account info page.</p>
    </div>
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

export default RestartPassword;
