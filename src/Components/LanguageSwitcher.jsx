import React from "react";
import { useTranslation } from "react-i18next";
import { Select } from "antd";

const { Option } = Select;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (value) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select defaultValue={i18n.language} onChange={handleChange}>
        <Option value="vi">Tiếng Việt</Option>
        <Option value="en">English</Option>
    </Select>
  );
};

export default LanguageSwitcher;
