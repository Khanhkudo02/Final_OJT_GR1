import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../assets/style/Pages/PageCV.scss";

const loadFont = async (url) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
};

function PageCV() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateContent, setTemplateContent] = useState(null);

  const handleTemplateChange = (e) => {
    const template = e.target.value;
    setSelectedTemplate(template);
  };

  // const exportPDF = () => {
  //   const doc = new jsPDF();
  //   if (selectedTemplate === "Template1") {
  //     TemplateCV1.generatePDF(doc);
  //   } else if (selectedTemplate === "Template2") {
  //     TemplateCV2.generatePDF(doc);
  //   }
  //   doc.save("CV.pdf");
  // };

  return (
    <div>
      <div className="PDF-Button">
        <select
          className="select-CV"
          onChange={handleTemplateChange}
          value={selectedTemplate}
        >
          <option className="option-CV" value="">
            Select a template
          </option>
          <option className="option-CV" value="Template1">
            Template CV1
          </option>
          <option className="option-CV" value="Template2">
            Template CV2
          </option>
        </select>
        <button className="download-btn" onClick={exportPDF}>
          Download PDF
        </button>
        <div>{templateContent}</div>
      </div>
    </div>
  );
}

export default PageCV;
