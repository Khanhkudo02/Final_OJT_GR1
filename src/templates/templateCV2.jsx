import React from "react";

import "../assets/style/template/templateCV2.scss";

function templateCV2({ data }) {
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

export default templateCV2;