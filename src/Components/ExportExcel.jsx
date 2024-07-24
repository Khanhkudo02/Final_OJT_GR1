import React from "react";
import { Button } from "antd";
import * as XLSX from "xlsx";

const ExportExcel = ({ data, fileName }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // Apply styles to the header
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: 0 }; // First row, all columns
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (!worksheet[cell_ref]) continue;
      if (typeof worksheet[cell_ref].s === "undefined")
        worksheet[cell_ref].s = {};
      worksheet[cell_ref].s.fill = { fgColor: { rgb: "4F81BD" } };
      worksheet[cell_ref].s.font = { color: { rgb: "FFFFFF" }, bold: true };
    }

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate a download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Button type="primary" onClick={exportToExcel}>
      Export to Excel
    </Button>
  );
};

export default ExportExcel;
