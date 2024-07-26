import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../assets/style/template/templateCV1.scss";
import avt from "../../public/images/avatar.jpg";

const generatePDF = (doc) => {
  // Add avatar
  const img = new Image();
  img.src = "/public/images/avatar.jpg"; // Adjust the path as needed
  doc.addImage(img, "JPEG", 10, 10, 30, 30); // Adjust position and size

  // Set up colors and fonts
  const leftSectionMargin = 10;
  const rightSectionMargin = 110; // Start position for right section
  const sectionWidth = 90; // Width of each section
  const sectionHeight = 290; // Height of the content area

  // Background colors
  const leftBackgroundColor = [30, 115, 190]; // Blue
  const rightBackgroundColor = [255, 255, 255]; // White

  // Text colors
  const leftTextColor = [255, 255, 255]; // White
  const rightTextColor = [0, 0, 0]; // Black

  // Add left section background
  doc.setFillColor(...leftBackgroundColor);
  doc.rect(leftSectionMargin, 50, sectionWidth, sectionHeight, "F");

  // Add right section background
  doc.setFillColor(...rightBackgroundColor);
  doc.rect(rightSectionMargin, 50, sectionWidth * 2, sectionHeight, "F");

  // Add name and contact details to the left section
  doc.setFont("Arial", "normal");
  doc.setFontSize(24);
  doc.setTextColor(...leftTextColor); // White color for name
  doc.text("Michelle Robinson", leftSectionMargin + 5, 30);

  doc.setFontSize(16);
  doc.text("Graphic Designer", leftSectionMargin + 5, 40);

  doc.setFontSize(12);
  doc.text("14585 10th Ave, Whitestone, NY", leftSectionMargin + 5, 50);
  doc.text("+1 212-941-7824", leftSectionMargin + 5, 55);
  doc.text("info@urmailaddress.com", leftSectionMargin + 5, 60);

  // Add sections to the left section
  const leftSections = [
    {
      title: "About Me",
      content: "Motivated with 8 years of area of expertise...",
      y: 80,
    },
    {
      title: "Website & Social Links",
      content:
        "Facebook: facebook.com/robinson\nBehance: behance.net/robinson\nTwitter: twitter.com/robinson",
      y: 110,
    },
    {
      title: "References",
      content:
        "Mr. Michel Robinson\nGraphic and Web Designer\n+1 212-941-7824\ninfo@urmailname.com",
      y: 160,
    },
    { title: "Languages", content: "English, UR Language", y: 200 },
    { title: "Additional Details", content: "Driving License: Full", y: 220 },
  ];

  leftSections.forEach((section) => {
    doc.setFontSize(16);
    doc.setTextColor(...leftTextColor); // White text
    doc.text(section.title, leftSectionMargin + 5, section.y);

    doc.setFontSize(12);
    doc.text(section.content, leftSectionMargin + 5, section.y + 10);
  });

  // Add sections to the right section
  doc.setFontSize(16);
  doc.setTextColor(...rightTextColor); // Black text
  doc.text("Work Experience", rightSectionMargin + 5, 80);

  const workExperience = [
    {
      title: "Senior Graphic Designer at GlowPixel Ltd, Orlando (2015 - 2016)",
      content: "Customer-oriented Graphic Designer with a strong history...",
    },
    {
      title: "Graphic Designer at Lorem Ipsum, New York (2014 - 2015)",
      content: "Customer-oriented Graphic Designer with a strong history...",
    },
    {
      title:
        "Graphic & Web Designer at Pixelate Agency, New Jersey (2013 - 2014)",
      content: "Customer-oriented Graphic Designer with a strong history...",
    },
  ];

  let yPosition = 90;
  workExperience.forEach((job) => {
    doc.setFontSize(12);
    doc.text(job.title, rightSectionMargin + 5, yPosition);
    doc.text(job.content, rightSectionMargin + 5, yPosition + 10);
    yPosition += 20;
  });

  // Add Education section
  doc.setFontSize(16);
  doc.text("Education", rightSectionMargin + 5, yPosition);

  const education = [
    {
      title: "Master in Web Develop at University of UK, Toronto (2010 - 2012)",
      content: "Customer-oriented Graphic Designer with a strong history...",
    },
    {
      title:
        "Bachelor in Graphic Design at College of Art, New Ark (2006 - 2010)",
      content: "Customer-oriented Graphic Designer with a strong history...",
    },
  ];

  yPosition += 10;
  education.forEach((edu) => {
    doc.setFontSize(12);
    doc.text(edu.title, rightSectionMargin + 5, yPosition);
    doc.text(edu.content, rightSectionMargin + 5, yPosition + 10);
    yPosition += 20;
  });

  // Add Skills section
  doc.setFontSize(16);
  doc.text("Skills", rightSectionMargin + 5, yPosition);

  const skills = [
    { name: "Adobe Photoshop", level: 80 },
    { name: "Adobe Illustrator", level: 75 },
    { name: "Adobe InDesign", level: 70 },
    { name: "HTML/CSS", level: 85 },
    { name: "WordPress", level: 60 },
  ];

  yPosition += 10;
  skills.forEach((skill) => {
    doc.setFontSize(12);
    doc.text(skill.name, rightSectionMargin + 5, yPosition);

    // Draw skill bar
    doc.setFillColor(200, 200, 200); // Light gray
    doc.rect(rightSectionMargin + 55, yPosition - 5, 50, 4, "F");
    doc.setFillColor(0, 0, 255); // Blue
    doc.rect(
      rightSectionMargin + 55,
      yPosition - 5,
      (50 * skill.level) / 100,
      4,
      "F"
    );

    yPosition += 10;
  });

  // Add Hobbies section
  doc.setFontSize(16);
  doc.text("Hobbies", rightSectionMargin + 5, yPosition);

  doc.setFontSize(12);
  doc.text(
    "Art, Traveling, Photography, Sports, Movie",
    rightSectionMargin + 5,
    yPosition + 10
  );

  // Add Publications section
  doc.setFontSize(16);
  doc.text("Publications", rightSectionMargin + 5, yPosition + 30);

  doc.setFontSize(12);
  doc.text(
    "Complex cognition: The psychology of human thought, Oxford University Press, New York, NY, 2001",
    rightSectionMargin + 5,
    yPosition + 40
  );

  // Save the PDF
  doc.save("CV.pdf");
};

function templateCV1() {
  return (
    <div className="container" id="cv-page">
      <div className="left">
        {/* Avatar */}
        <div className="image-container">
          <img
            className="image"
            src="/public/images/avatar.jpg"
            alt="Profile"
          />
        </div>
        {/* Info */}
        <div className="section bottom-left">
          <h2 className="section-title">About Me</h2>
          <p className="text">Motivated with 8 years of area of expertise...</p>
        </div>
        {/* Website & link */}
        <div className="section bottom-left">
          <h2 className="section-title">Website & Social Links</h2>
          <p className="text">Facebook: facebook.com/robinson</p>
          <p className="text">Behance: behance.net/robinson</p>
          <p className="text">Twitter: twitter.com/robinson</p>
        </div>
        {/* Reference */}
        <div className="section bottom-left">
          <h2 className="section-title">References</h2>
          <ul className="list">
            <li className="list-item">
              <p className="text">Mr. Michel Robinson</p>
              <p className="text">Graphic and Web Designer</p>
              <p className="text">+1 212-941-7824</p>
              <p className="text">info@urmailname.com</p>
            </li>
          </ul>
        </div>
        {/* Language */}
        <div className="section bottom-left">
          <h2 className="section-title">Languages</h2>
          <p className="text">English, UR Language</p>
        </div>
        {/* Addition details */}
        <div className="section bottom-left">
          <h2 className="section-title">Additional Details</h2>
          <p className="text">Driving License: Full</p>
        </div>
      </div>

      <div className="right">
        {/* Name and contact method */}
        <div className="header bottom-right">
          <div>
            <h1 className="name">Michelle Robinson</h1>
            <p className="title">Graphic Designer</p>
          </div>
          <div className="contact">
            <p className="text">14585 10th Ave, Whitestone, NY</p>
            <p className="text">+1 212-941-7824</p>
            <p className="text">info@urmailaddress.com</p>
          </div>
        </div>
        {/* Work experience */}
        <div className="section bottom-right">
          <h2 className="section-title">Work Experience</h2>
          <ul className="list">
            <li className="list-item">
              <p className="text">
                Senior Graphic Designer at GlowPixel Ltd, Orlando (2015 - 2016)
              </p>
              <p className="text">
                Customer-oriented Graphic Designer with a strong history...
              </p>
            </li>
            <li className="list-item">
              <p className="text">
                Graphic Designer at Lorem Ipsum, New York (2014 - 2015)
              </p>
              <p className="text">
                Customer-oriented Graphic Designer with a strong history...
              </p>
            </li>
            <li className="list-item">
              <p className="text">
                Graphic & Web Designer at Pixelate Agency, New Jersey (2013 -
                2014)
              </p>
              <p className="text">
                Customer-oriented Graphic Designer with a strong history...
              </p>
            </li>
          </ul>
        </div>
        {/* Education */}
        <div className="section bottom-right">
          <h2 className="section-title">Education</h2>
          <ul className="list">
            <li className="list-item">
              <p className="text">
                Master in Web Develop at University of UK, Toronto (2010 - 2012)
              </p>
              <p className="text">
                Customer-oriented Graphic Designer with a strong history...
              </p>
            </li>
            <li className="list-item">
              <p className="text">
                Bachelor in Graphic Design at College of Art, New Ark (2006 -
                2010)
              </p>
              <p className="text">
                Customer-oriented Graphic Designer with a strong history...
              </p>
            </li>
          </ul>
        </div>
        {/* Skill */}
        <div className="section bottom-right">
          <h2 className="section-title">Skills</h2>
          <div className="skills">
            <div className="skill">
              <p className="text">Adobe Photoshop</p>
              <div className="skill-bar">
                <div className="skill-level" style={{ width: "80%" }} />
              </div>
            </div>
            <div className="skill">
              <p className="text">Adobe Illustrator</p>
              <div className="skill-bar">
                <div className="skill-level" style={{ width: "75%" }} />
              </div>
            </div>
            <div className="skill">
              <p className="text">Adobe InDesign</p>
              <div className="skill-bar">
                <div className="skill-level" style={{ width: "70%" }} />
              </div>
            </div>
            <div className="skill">
              <p className="text">HTML/CSS</p>
              <div className="skill-bar">
                <div className="skill-level" style={{ width: "85%" }} />
              </div>
            </div>
            <div className="skill">
              <p className="text">WordPress</p>
              <div className="skill-bar">
                <div className="skill-level" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>
        {/* Hobbies */}
        <div className="section bottom-right">
          <h2 className="section-title">Hobbies</h2>
          <p className="text">Art, Traveling, Photography, Sports, Movie</p>
        </div>
        {/* Publication */}
        <div className="section bottom-right">
          <h2 className="section-title">Publications</h2>
          <p className="text">
            Complex cognition: The psychology of human thought, Oxford
            University Press, New York, NY, 2001
          </p>
        </div>
      </div>
    </div>
  );
}

templateCV1.generatePDF = generatePDF;

export default templateCV1;
