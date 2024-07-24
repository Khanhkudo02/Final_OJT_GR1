import React, { useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../assets/style/Pages/PageCV.scss";
import avt from "../../public/images/avatar.jpg";

const loadFont = async (url) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
};

function PageCV() {
  useEffect(() => {
    const loadAndAddFont = async () => {
      const font = await loadFont("/fonts/times-new-roman/times.ttf");
      jsPDF.API.addFileToVFS("times.ttf", font);
      jsPDF.API.addFont("times.ttf", "Times", "normal");
    };
    loadAndAddFont();
  }, []);

  const handleDownloadPdf = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Add profile picture
    const img = new Image();
    img.src = avt; // Replace with the path to your image
    doc.addImage(img, "JPEG", 15, 20, 30, 30);

    // Header
    doc.setFont("Times", "normal");
    doc.setFontSize(24);
    doc.setTextColor(243, 156, 18);
    doc.text("Nguyễn Minh Anh", 50, 30);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Nhân viên Chăm sóc khách hàng", 50, 40);

    doc.setFontSize(12);
    doc.text("26/08/1999", 50, 50);
    doc.text("0123456789", 50, 55);
    doc.text("minhanhtopcv@gmail.com", 50, 60);
    doc.text("Số 47 đường Nguyễn Tuân, Hà Nội", 50, 65);
    doc.text("https://fb.com/minhanhtopcv", 50, 70);

    // Sections
    doc.setFontSize(16);
    doc.setTextColor(243, 156, 18);
    doc.text("HỌC VẤN", 15, 90);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("10/2017 -> 05/21", 15, 100);
    doc.text("TRƯỜNG ĐẠI HỌC TOPCV", 15, 105);
    doc.text("Chuyên ngành: Quản trị kinh doanh", 15, 110);
    doc.text("Điểm trung bình năm học 2019-2020: 8.0", 15, 115);

    doc.setTextColor(243, 156, 18);
    doc.text("KINH NGHIỆM LÀM VIỆC", 15, 130);

    doc.setTextColor(0, 0, 0);
    doc.text("07/2019 -> Hiện tại", 15, 140);
    doc.text("CÔNG TY CỔ PHẦN TOPCV VIỆT NAM", 15, 145);
    doc.text("Nhân viên chăm sóc khách hàng", 15, 150);
    doc.text(
      "Hỗ trợ khách hàng sử dụng dịch vụ (hơn 200 khách hàng/tháng)",
      15,
      155
    );
    doc.text(
      "Đào tạo khách hàng sử dụng hệ thống quản lý của công ty",
      15,
      160
    );
    doc.text(
      "Phối hợp với các bộ phận liên quan để giải quyết các vấn đề của khách hàng",
      15,
      165
    );

    doc.setTextColor(243, 156, 18);
    doc.text("HOẠT ĐỘNG", 15, 180);

    doc.setTextColor(0, 0, 0);
    doc.text("10/2015 -> 06/2019", 15, 190);
    doc.text("CLB KINH DOANH QUỐC TẾ ĐH NGOẠI THƯƠNG - IBE", 15, 195);
    doc.text("Thành viên", 15, 200);
    doc.text("Chia sẻ kiến thức chuyên ngành", 15, 205);
    doc.text(
      "Tham gia tổ chức các hội thảo doanh nghiệp và các sự kiện tuyển dụng",
      15,
      210
    );

    doc.setTextColor(243, 156, 18);
    doc.text("CHỨNG CHỈ", 15, 225);

    doc.setTextColor(0, 0, 0);
    doc.text("2018", 15, 235);
    doc.text("CHỨNG CHỈ TOEIC 700 ĐIỂM ĐƯỢC CẤP BỞI TOPCV", 15, 240);

    doc.setTextColor(243, 156, 18);
    doc.text("GIẢI THƯỞNG", 15, 255);

    doc.setTextColor(0, 0, 0);
    doc.text("2018", 15, 265);
    doc.text(
      "TOP 10 NHÂN VIÊN CHĂM SÓC KHÁCH HÀNG XUẤT SẮC QUÝ III NĂM 2018 CỦA CÔNG TY",
      15,
      270
    );

    doc.setTextColor(243, 156, 18);
    doc.text("MỤC TIÊU NGHỀ NGHIỆP", 105, 90);

    doc.setTextColor(0, 0, 0);
    doc.text(
      "Trở thành nhân viên Chăm sóc khách hàng cao cấp cho các doanh nghiệp.",
      105,
      100
    );
    doc.text(
      "Đóng góp vào sự phát triển và nâng cao năng lực chuyên môn để trở thành trưởng phòng",
      105,
      105
    );
    doc.text("Kinh doanh chuyên nghiệp trong vòng 5 năm tới.", 105, 110);

    doc.setTextColor(243, 156, 18);
    doc.text("THÔNG TIN THÊM", 105, 130);

    doc.setTextColor(0, 0, 0);
    doc.text("Có thể đi làm ngay", 105, 140);

    doc.setTextColor(243, 156, 18);
    doc.text("NGƯỜI THAM CHIẾU", 105, 155);

    doc.setTextColor(0, 0, 0);
    doc.text("Anh Cao Duy Sơn - Trưởng phòng Kinh doanh", 105, 165);
    doc.text("Công ty Cổ phần TOPCV Việt Nam", 105, 170);
    doc.text("Điện thoại: 0123456789", 105, 175);

    doc.setTextColor(243, 156, 18);
    doc.text("KỸ NĂNG", 105, 195);

    doc.setTextColor(0, 0, 0);
    doc.text("Tin học văn phòng", 105, 205);
    doc.text("Tiếng Anh", 105, 210);
    doc.text("Làm việc nhóm", 105, 215);
    doc.text("Giải quyết vấn đề", 105, 220);

    // Add dots for skills
    const skillDots = [6, 5, 5, 4]; // Number of dots for each skill
    skillDots.forEach((dots, index) => {
      for (let i = 0; i < dots; i++) {
        doc.circle(150 + i * 5, 204 + index * 5, 1.5, "FD");
      }
    });

    doc.save("cv.pdf");
  };

  return (
    <div>
      <div className="PDF-Button">
        <button className="download-btn" onClick={handleDownloadPdf}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default PageCV;
