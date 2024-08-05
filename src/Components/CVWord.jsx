import React from 'react';
import { saveAs } from "file-saver";
import { message } from "antd";
import { ref, onValue } from "firebase/database"; // Import ref và onValue từ Firebase Database
import { database } from "../firebaseConfig";
import { Packer, Document, Paragraph, TextRun } from "docx";

const CVWord = async (employee) => {
  try {
    // Fetch the employee's projects from Firebase
    const fetchEmployeeProjects = async () => {
      const projectsRef = ref(database, "projects");
      const snapshot = await new Promise((resolve) =>
        onValue(projectsRef, (snap) => resolve(snap.val()))
      );
      const projectsData = snapshot;
      const projects = [];
      for (const key in projectsData) {
        projects.push({ key, ...projectsData[key] });
      }
      return projects.filter((project) =>
        project.teamMembers?.includes(employee.id) // Sử dụng ID của nhân viên
      );
    };

    const employeeProjects = await fetchEmployeeProjects();

    // Create the Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Employee Information Section
            new Paragraph({
              children: [
                new TextRun({
                  text: `Employee Name: ${employee.name || "N/A"}`,
                  size: 24,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Position: ${employee.position || "N/A"}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Department: ${employee.department || "N/A"}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({}), // Blank paragraph for spacing

            // Projects Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Projects",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...employeeProjects.length > 0
              ? employeeProjects.map((project) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Project Name: ${project.name || "N/A"}`,
                        size: 24,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Status: ${project.status || "N/A"}`,
                        size: 24,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Start Date: ${project.startDate || "N/A"}`,
                        size: 24,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `End Date: ${project.endDate || "N/A"}`,
                        size: 24,
                      }),
                    ],
                  }),
                  new Paragraph({}), // Add a blank paragraph for spacing
                ])
              : [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Chưa tham gia project",
                        size: 24,
                      }),
                    ],
                  }),
                ],

            // Additional Information Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "ADDITIONAL INFORMATION",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Additional notes or details can be added here.",
                  size: 24,
                }),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${employee.name || "Employee"}.docx`);
  } catch (error) {
    console.error("Error exporting to Word:", error);
    message.error("Failed to export data to Word.");
  }
}

export default CVWord