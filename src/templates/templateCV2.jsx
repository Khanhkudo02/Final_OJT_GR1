import React from "react";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import "../assets/style/template/templateCV2.scss";

const generatePDF = (doc) => {
  // const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor('#1e73be');
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('Sharad Loyal', 10, 15);
  doc.setFontSize(18);
  doc.text('Senior Account Manager', 10, 25);

  // Content
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  // Left Column
  const leftColumnStartX = 10;
  const leftColumnStartY = 40;
  let yOffset = leftColumnStartY;

  // Info
  const info = `Customer-oriented account manager with 8 years of experience overseeing 25+ medium and large clients and successfully managing client relationships. Certified Business Relationship Manager (CBRM). Skilled with Salesforce and Zahn CRM. 100% client satisfaction for 6 straight years.`;
  doc.text(info, leftColumnStartX, yOffset, { maxWidth: 130 });
  yOffset += doc.getTextDimensions(info).h + 10;

  // Experience
  doc.setFontSize(14);
  doc.text('Experience', leftColumnStartX, yOffset);
  yOffset += 6;
  doc.setFontSize(12);
  const experiences = [
    {
      title: 'Account Manager',
      company: 'Bharti Airtel Limited, Mumbai',
      period: '2016-10 - present',
      details: [
        'Maintained a 100% Net Promoter Score (NPS) rating during the entire span of employment.',
        'Built and maintained new and existing relationships assigned by the account executive.',
        'Negotiated contracts with clients and established a timeline of performance according to policies.',
        'In charge of cross-divisional projects with a creative team ensuring all parties are well briefed and implement within schedule.'
      ],
      achievements: [
        'Increased revenue by 459% or more year-over-year for 4 years straight.',
        'Managed the accounts of 25+ medium and large business clients.'
      ]
    },
    {
      title: 'Junior Account Manager',
      company: 'Nori PLC PLC, Mumbai',
      period: '2014-09 - 2016-08',
      details: [
        'Assisted key account manager and senior account managers in administering large advertising accounts.',
        'Helped maintain positive, productive, and profitable client relationships.',
        'Managed 5 client accounts per year.'
      ]
    }
  ];
  experiences.forEach(exp => {
    doc.setFontSize(12);
    doc.text(exp.title, leftColumnStartX, yOffset);
    yOffset += 6;
    doc.text(exp.company, leftColumnStartX, yOffset);
    yOffset += 6;
    doc.text(exp.period, leftColumnStartX, yOffset);
    yOffset += 6;
    exp.details.forEach(detail => {
      doc.text(`- ${detail}`, leftColumnStartX + 5, yOffset);
      yOffset += 6;
    });
    if (exp.achievements) {
      doc.text('Key Achievements:', leftColumnStartX, yOffset);
      yOffset += 6;
      exp.achievements.forEach(ach => {
        doc.text(`- ${ach}`, leftColumnStartX + 5, yOffset);
        yOffset += 6;
      });
    }
    yOffset += 10;
  });

  // Education
  doc.setFontSize(14);
  doc.text('Education', leftColumnStartX, yOffset);
  yOffset += 6;
  doc.setFontSize(12);
  const education = [
    {
      degree: 'JB Institute of Management Studies, MBA in Sales Management',
      period: '2010-09 - 2012-06',
      grade: 'CGPA: 9.4/10'
    },
    {
      degree: 'IIM Ahmedabad, Bachelors in Business Administration',
      period: '2006-09 - 2010-06',
      coursework: 'Relevant Coursework: Managerial Accounting, Operations Management, Business Account Management, Macroeconomics, Microeconomics, Financial Management.'
    }
  ];
  education.forEach(edu => {
    doc.text(edu.degree, leftColumnStartX, yOffset);
    yOffset += 6;
    doc.text(edu.period, leftColumnStartX, yOffset);
    yOffset += 6;
    if (edu.grade) {
      doc.text(edu.grade, leftColumnStartX, yOffset);
      yOffset += 6;
    }
    if (edu.coursework) {
      doc.text(edu.coursework, leftColumnStartX, yOffset, { maxWidth: 130 });
      yOffset += doc.getTextDimensions(edu.coursework).h + 6;
    }
    yOffset += 10;
  });

  // Skills
  doc.setFontSize(14);
  doc.text('Key skills', leftColumnStartX, yOffset);
  yOffset += 6;
  doc.setFontSize(12);
  const skills = [
    'Sales & Negotiation Sells',
    'CRM Software (e.g., Salesforce, HubSpot)',
    'Excellent Communication',
    'Ability to devise creative ideas to attract the target customers attention',
    'Customer Service Orientation'
  ];
  skills.forEach(skill => {
    doc.text(`- ${skill}`, leftColumnStartX + 5, yOffset);
    yOffset += 6;
  });
  yOffset += 10;

  // Certificates
  doc.setFontSize(14);
  doc.text('Certificates', leftColumnStartX, yOffset);
  yOffset += 6;
  doc.setFontSize(12);
  const certificates = [
    'Certified Business Relationship Manager (CBRM)',
    'NAND Benefits Account Manager Certification (RAMC)'
  ];
  certificates.forEach(cert => {
    doc.text(`- ${cert}`, leftColumnStartX + 5, yOffset);
    yOffset += 6;
  });

  // Right Column
  const rightColumnStartX = pageWidth / 2 + 10;
  yOffset = leftColumnStartY;

  // Personal Info
  doc.addImage('/public/images/avatar.jpg', 'JPEG', rightColumnStartX, yOffset, 40, 40);
  yOffset += 45;
  const personalInfo = [
    { label: 'Address', value: '69, Bandra, Raipur - 322123' },
    { label: 'Phone', value: '+91 04 73370896' },
    { label: 'E-mail', value: 'SharadLoyal@gmail.com' },
    { label: 'Age', value: '33' },
    { label: 'LinkedIn', value: 'linkedin.com/in/ShLoyal' },
    { label: 'Nationality', value: 'Indian' }
  ];
  doc.setFontSize(14);
  doc.text('Personal Info', rightColumnStartX, yOffset);
  yOffset += 6;
  doc.setFontSize(12);
  personalInfo.forEach(info => {
    doc.text(`${info.label}: ${info.value}`, rightColumnStartX, yOffset);
    yOffset += 6;
  });
  yOffset += 10;

  // Languages
  doc.setFontSize(14);
  doc.text('Languages', rightColumnStartX, yOffset);
  yOffset += 6;
  doc.setFontSize(12);
  const languages = [
    { language: 'Hindi', level: 'Mother tongue' },
    { language: 'English', level: 'C2' },
    { language: 'Spanish', level: 'B2' }
  ];
  languages.forEach(lang => {
    doc.text(`${lang.language} - ${lang.level}`, rightColumnStartX, yOffset);
    yOffset += 6;
  });
};

// const generatePDF = (doc) => {
//   const pageWidth = doc.internal.pageSize.getWidth();

//   // Header
//   doc.setFillColor('#1e73be');
//   doc.rect(0, 0, pageWidth, 30, 'F');
//   doc.setFontSize(24);
//   doc.setTextColor(255, 255, 255);
//   doc.text('Sharad Loyal', 10, 15);
//   doc.setFontSize(18);
//   doc.text('Senior Account Manager', 10, 25);

//   // Content
//   doc.setFontSize(12);
//   doc.setTextColor(0, 0, 0);

//   // Left Column
//   const leftColumnStartX = 10;
//   const leftColumnStartY = 40;
//   let yOffset = leftColumnStartY;

//   // Info
//   const info = `Customer-oriented account manager with 8 years of experience overseeing 25+ medium and large clients and successfully managing client relationships. Certified Business Relationship Manager (CBRM). Skilled with Salesforce and Zahn CRM. 100% client satisfaction for 6 straight years.`;
//   doc.text(info, leftColumnStartX, yOffset, { maxWidth: 130 });
//   yOffset += doc.getTextDimensions(info).h + 10;

//   // Experience
//   doc.setFontSize(14);
//   doc.text('Experience', leftColumnStartX, yOffset);
//   yOffset += 6;
//   doc.setFontSize(12);
//   const experiences = [
//     {
//       title: 'Account Manager',
//       company: 'Bharti Airtel Limited, Mumbai',
//       period: '2016-10 - present',
//       details: [
//         'Maintained a 100% Net Promoter Score (NPS) rating during the entire span of employment.',
//         'Built and maintained new and existing relationships assigned by the account executive.',
//         'Negotiated contracts with clients and established a timeline of performance according to policies.',
//         'In charge of cross-divisional projects with a creative team ensuring all parties are well briefed and implement within schedule.'
//       ],
//       achievements: [
//         'Increased revenue by 459% or more year-over-year for 4 years straight.',
//         'Managed the accounts of 25+ medium and large business clients.'
//       ]
//     },
//     {
//       title: 'Junior Account Manager',
//       company: 'Nori PLC PLC, Mumbai',
//       period: '2014-09 - 2016-08',
//       details: [
//         'Assisted key account manager and senior account managers in administering large advertising accounts.',
//         'Helped maintain positive, productive, and profitable client relationships.',
//         'Managed 5 client accounts per year.'
//       ]
//     }
//   ];
//   experiences.forEach(exp => {
//     doc.setFontSize(12);
//     doc.text(exp.title, leftColumnStartX, yOffset);
//     yOffset += 6;
//     doc.text(exp.company, leftColumnStartX, yOffset);
//     yOffset += 6;
//     doc.text(exp.period, leftColumnStartX, yOffset);
//     yOffset += 6;
//     exp.details.forEach(detail => {
//       doc.text(`- ${detail}`, leftColumnStartX + 5, yOffset);
//       yOffset += 6;
//     });
//     if (exp.achievements) {
//       doc.text('Key Achievements:', leftColumnStartX, yOffset);
//       yOffset += 6;
//       exp.achievements.forEach(ach => {
//         doc.text(`- ${ach}`, leftColumnStartX + 5, yOffset);
//         yOffset += 6;
//       });
//     }
//     yOffset += 10;
//   });

//   // Education
//   doc.setFontSize(14);
//   doc.text('Education', leftColumnStartX, yOffset);
//   yOffset += 6;
//   doc.setFontSize(12);
//   const education = [
//     {
//       degree: 'JB Institute of Management Studies, MBA in Sales Management',
//       period: '2010-09 - 2012-06',
//       grade: 'CGPA: 9.4/10'
//     },
//     {
//       degree: 'IIM Ahmedabad, Bachelors in Business Administration',
//       period: '2006-09 - 2010-06',
//       coursework: 'Relevant Coursework: Managerial Accounting, Operations Management, Business Account Management, Macroeconomics, Microeconomics, Financial Management.'
//     }
//   ];
//   education.forEach(edu => {
//     doc.text(edu.degree, leftColumnStartX, yOffset);
//     yOffset += 6;
//     doc.text(edu.period, leftColumnStartX, yOffset);
//     yOffset += 6;
//     if (edu.grade) {
//       doc.text(edu.grade, leftColumnStartX, yOffset);
//       yOffset += 6;
//     }
//     if (edu.coursework) {
//       doc.text(edu.coursework, leftColumnStartX, yOffset, { maxWidth: 130 });
//       yOffset += doc.getTextDimensions(edu.coursework).h + 6;
//     }
//     yOffset += 10;
//   });

//   // Skills
//   doc.setFontSize(14);
//   doc.text('Key skills', leftColumnStartX, yOffset);
//   yOffset += 6;
//   doc.setFontSize(12);
//   const skills = [
//     'Sales & Negotiation Sells',
//     'CRM Software (e.g., Salesforce, HubSpot)',
//     'Excellent Communication',
//     'Ability to devise creative ideas to attract the target customers attention',
//     'Customer Service Orientation'
//   ];
//   skills.forEach(skill => {
//     doc.text(`- ${skill}`, leftColumnStartX + 5, yOffset);
//     yOffset += 6;
//   });
//   yOffset += 10;

//   // Certificates
//   doc.setFontSize(14);
//   doc.text('Certificates', leftColumnStartX, yOffset);
//   yOffset += 6;
//   doc.setFontSize(12);
//   const certificates = [
//     'Certified Business Relationship Manager (CBRM)',
//     'NAND Benefits Account Manager Certification (RAMC)'
//   ];
//   certificates.forEach(cert => {
//     doc.text(`- ${cert}`, leftColumnStartX + 5, yOffset);
//     yOffset += 6;
//   });

//   // Right Column
//   const rightColumnStartX = pageWidth / 2 + 10;
//   yOffset = leftColumnStartY;

//   // Personal Info
//   doc.addImage('/public/images/avatar.jpg', 'JPEG', rightColumnStartX, yOffset, 40, 40);
//   yOffset += 45;
//   const personalInfo = [
//     { label: 'Address', value: '69, Bandra, Raipur - 322123' },
//     { label: 'Phone', value: '+91 04 73370896' },
//     { label: 'E-mail', value: 'SharadLoyal@gmail.com' },
//     { label: 'Age', value: '33' },
//     { label: 'LinkedIn', value: 'linkedin.com/in/ShLoyal' },
//     { label: 'Nationality', value: 'Indian' }
//   ];
//   doc.setFontSize(14);
//   doc.text('Personal Info', rightColumnStartX, yOffset);
//   yOffset += 6;
//   doc.setFontSize(12);
//   personalInfo.forEach(info => {
//     doc.text(`${info.label}: ${info.value}`, rightColumnStartX, yOffset);
//     yOffset += 6;
//   });
//   yOffset += 10;

//   // Languages
//   doc.setFontSize(14);
//   doc.text('Languages', rightColumnStartX, yOffset);
//   yOffset += 6;
//   doc.setFontSize(12);
//   const languages = [
//     { language: 'Hindi', level: 'Mother tongue' },
//     { language: 'English', level: 'C2' },
//     { language: 'Spanish', level: 'B2' }
//   ];
//   languages.forEach(lang => {
//     doc.text(`${lang.language} - ${lang.level}`, rightColumnStartX, yOffset);
//     yOffset += 6;
//   });
// };


function templateCV2() {
  return (
    <div className="App">
      <div className="header">
        <h1>Sharad Loyal</h1>
        <h2>Senior Account Manager</h2>
      </div>
      <div className="content">
        <div className="left-column">
          <div className="info">
            <p>
              Customer-oriented account manager with 8 years of experience
              overseeing 25+ medium and large clients and successfully managing
              client relationships. Certified Business Relationship Manager
              (CBRM). Skilled with Salesforce and Zahn CRM. 100% client
              satisfaction for 6 straight years.
            </p>
          </div>
          <div className="experience">
            <h3>Experience</h3>
            <div className="experience-item">
              <h4>Account Manager</h4>
              <p>Bharti Airtel Limited, Mumbai</p>
              <p>2016-10 - present</p>
              <ul>
                <li>
                  Maintained a 100% Net Promoter Score (NPS) rating during the
                  entire span of employment.
                </li>
                <li>
                  Built and maintained new and existing relationships assigned
                  by the account executive.
                </li>
                <li>
                  Negotiated contracts with clients and established a timeline
                  of performance according to policies.
                </li>
                <li>
                  In charge of cross-divisional projects with a creative team
                  ensuring all parties are well briefed and implement within
                  schedule.
                </li>
              </ul>
              <p>
                <strong>Key Achievements</strong>
              </p>
              <ul>
                <li>
                  Increased revenue by 459% or more year-over-year for 4 years
                  straight.
                </li>
                <li>
                  Managed the accounts of 25+ medium and large business clients.
                </li>
              </ul>
            </div>
            <div className="experience-item">
              <h4>Junior Account Manager</h4>
              <p>Nori PLC PLC, Mumbai</p>
              <p>2014-09 - 2016-08</p>
              <ul>
                <li>
                  Assisted key account manager and senior account managers in
                  administering large advertising accounts.
                </li>
                <li>
                  Helped maintain positive, productive, and profitable client
                  relationships.
                </li>
                <li>Managed 5 client accounts per year.</li>
              </ul>
            </div>
          </div>
          <div className="education">
            <h3>Education</h3>
            <div className="education-item">
              <p>
                <strong>
                  JB Institute of Management Studies, MBA in Sales Management
                </strong>
              </p>
              <p>2010-09 - 2012-06</p>
              <p>CGPA: 9.4/10</p>
            </div>
            <div className="education-item">
              <p>
                <strong>
                  IIM Ahmedabad, Bachelors in Business Administration
                </strong>
              </p>
              <p>2006-09 - 2010-06</p>
              <p>
                Relevant Coursework: Managerial Accounting, Operations
                Management, Business Account Management, Macroeconomics,
                Microeconomics, Financial Management.
              </p>
            </div>
          </div>
          <div className="skills">
            <h3>Key skills</h3>
            <ul>
              <li>Sales & Negotiation Sells</li>
              <li>CRM Software (e.g., Salesforce, HubSpot)</li>
              <li>Excellent Communication</li>
              <li>
                Ability to devise creative ideas to attract the target customers
                attention
              </li>
              <li>Customer Service Orientation</li>
            </ul>
          </div>
          <div className="certificates">
            <h3>Certificates</h3>
            <ul>
              <li>Certified Business Relationship Manager (CBRM)</li>
              <li>NAND Benefits Account Manager Certification (RAMC)</li>
            </ul>
          </div>
        </div>
        <div className="right-column">
          <div className="personal-info">
            <img src="/public/images/avatar.jpg" alt="Sharad Loyal" />
            <div className="info">
              <h3>Personal Info</h3>
              <p>
                <strong>Address:</strong> 69, Bandra, Raipur - 322123
              </p>
              <p>
                <strong>Phone:</strong> +91 04 73370896
              </p>
              <p>
                <strong>E-mail:</strong> SharadLoyal@gmail.com
              </p>
              <p>
                <strong>Age:</strong> 33
              </p>
              <p>
                <strong>LinkedIn:</strong> linkedin.com/in/ShLoyal
              </p>
              <p>
                <strong>Nationality:</strong> Indian
              </p>
            </div>
          </div>
          <div className="languages">
            <h3>Languages</h3>
            <ul>
              <li>
                Hindi - <span>Mother tongue</span>
              </li>
              <li>
                English - <span>C2</span>
              </li>
              <li>
                Spanish - <span>B2</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

templateCV2.generatePDF = generatePDF;

export default templateCV2;