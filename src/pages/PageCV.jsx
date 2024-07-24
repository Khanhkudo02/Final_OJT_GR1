import React from "react";
import "../assets/style/Pages/PageCV.scss";
import { PDFDocument, rgb, PageSizes } from "pdf-lib";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

function PageCV() {
  // Trái phải bằng nhau
  // const createPDF = async () => {
  //   const leftSection = document.querySelector(".left");
  //   const rightSection = document.querySelector(".right");

  //   // Chụp ảnh các phần nội dung HTML
  //   const leftCanvas = await html2canvas(leftSection, { scale: 2 }); // Tăng chất lượng ảnh
  //   const rightCanvas = await html2canvas(rightSection, { scale: 2 });

  //   const leftImgData = leftCanvas.toDataURL("image/png");
  //   const rightImgData = rightCanvas.toDataURL("image/png");

  //   // Tạo tài liệu PDF
  //   const pdfDoc = await PDFDocument.create();
  //   const page = pdfDoc.addPage(PageSizes.A4);

  //   const { width, height } = page.getSize();

  //   // Thêm ảnh vào tài liệu PDF
  //   const leftImg = await pdfDoc.embedPng(leftImgData);
  //   const rightImg = await pdfDoc.embedPng(rightImgData);

  //   const leftImgDims = leftImg.scale(1);
  //   const rightImgDims = rightImg.scale(2);

  //   const leftWidth = width / 2; // Đặt chiều rộng của phần trái
  //   const rightWidth = width / 2; // Đặt chiều rộng của phần phải

  //   // Thêm phần trái vào trang PDF
  //   page.drawImage(leftImg, {
  //     x: 0,
  //     y: 0,
  //     width: leftWidth,
  //     height: height,
  //   });

  //   // Thêm phần phải vào trang PDF
  //   page.drawImage(rightImg, {
  //     x: leftWidth,
  //     y: 0,
  //     width: rightWidth,
  //     height: height,
  //   });

  //   // Lưu tệp PDF
  //   const pdfBytes = await pdfDoc.save();
  //   saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "cv.pdf");
  // };

  // 1 phải bằng 2 trái
  const createPDF = async () => {
    const leftSection = document.querySelector(".left");
    const rightSection = document.querySelector(".right");

    // Chụp ảnh các phần nội dung HTML
    const leftCanvas = await html2canvas(leftSection, { scale: 2 }); // Tăng chất lượng ảnh
    const rightCanvas = await html2canvas(rightSection, { scale: 2 });

    const leftImgData = leftCanvas.toDataURL("image/png");
    const rightImgData = rightCanvas.toDataURL("image/png");

    // Tạo tài liệu PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);

    const { width, height } = page.getSize();

    // Thêm ảnh vào tài liệu PDF
    const leftImg = await pdfDoc.embedPng(leftImgData);
    const rightImg = await pdfDoc.embedPng(rightImgData);

    const leftImgDims = leftImg.scale(1);
    const rightImgDims = rightImg.scale(1);

    const leftWidth = width / 3; // Đặt chiều rộng của phần trái
    const rightWidth = (2 * width) / 3; // Đặt chiều rộng của phần phải

    // Thêm phần trái vào trang PDF
    page.drawImage(leftImg, {
      x: 0,
      y: 0,
      width: leftWidth,
      height: height,
    });

    // Thêm phần phải vào trang PDF
    page.drawImage(rightImg, {
      x: leftWidth,
      y: 0,
      width: rightWidth,
      height: height,
    });

    // Lưu tệp PDF
    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "cv.pdf");
  };

  return (
    <>
      {/* Button to change file from JSX to PDF */}
      <div className="PDF-Button">
        <button onClick={createPDF} className="download-btn">
          Download PDF
        </button>
      </div>
    </>
  );
}

export default PageCV;
