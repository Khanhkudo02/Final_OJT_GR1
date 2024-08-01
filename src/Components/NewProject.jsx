// import { UploadOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Checkbox,
//   DatePicker,
//   Form,
//   Input,
//   message,
//   Select,
//   Upload,
// } from "antd";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchAllLanguages } from "../service/LanguageServices";
// import { postCreateProject } from "../service/Project";
// import { fetchAllTechnology } from "../service/TechnologyServices";
// import dayjs from "dayjs";

// const { Option } = Select;
// const { TextArea } = Input;

// const NewProject = () => {
//   const [technologies, setTechnologies] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [form] = Form.useForm();
//   const [agreement, setAgreement] = useState(false);
//   const navigate = useNavigate();
//   const [imageFile, setImageFile] = useState(null);
//   const [fileList, setFileList] = useState([]);
//   const [startDate, setStartDate] = useState(null); // State to store selected start date
//   const [endDate, setEndDate] = useState(null); // State to store selected end date

//   const onFinish = async (values) => {
//     try {
//       const projectData = {
//         ...values,
//         startDate: values.startDate.format("YYYY-MM-DD"),
//         endDate: values.endDate.format("YYYY-MM-DD"),
//         technologies: values.technologies,
//         languages: values.languages,
//       };
//       await postCreateProject(projectData, imageFile);
//       message.success("Project added successfully");
//       navigate("/project-management");
//     } catch (error) {
//       message.error("Failed to add project");
//     }
//   };

//   const handleAgreementChange = (e) => {
//     setAgreement(e.target.checked);
//   };

//   const handleImageChange = ({ fileList }) => {
//     setFileList(fileList);
//     if (fileList.length > 0) {
//       setImageFile(fileList[fileList.length - 1].originFileObj);
//     } else {
//       setImageFile(null);
//     }
//   };

//   // Load technologies
//   useEffect(() => {
//     const loadTechnologies = async () => {
//       try {
//         const data = await fetchAllTechnology();
//         // Convert data from Firebase to format for Select
//         const techOptions = data.map((tech) => ({
//           label: tech.name,
//           value: tech.key, // Use key as value for Option
//         }));
//         setTechnologies(techOptions);
//       } catch (err) {
//         setError("Failed to fetch technologies");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadTechnologies();
//   }, []);

//   // Load languages
//   useEffect(() => {
//     const loadLanguages = async () => {
//       try {
//         const data = await fetchAllLanguages();
//         // Convert data from Firebase to format for Select
//         const languageOptions = data.map((lang) => ({
//           label: lang.name,
//           value: lang.key, // Use key as value for Option
//         }));
//         setLanguages(languageOptions);
//       } catch (err) {
//         setError("Failed to fetch languages");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadLanguages();
//   }, []);

//   const disabledStartDate = (startDate) => {
//     if (!endDate) {
//       return false;
//     }
//     return startDate && startDate.isAfter(endDate, "day");
//   };

//   const disabledEndDate = (endDate) => {
//     if (!startDate) {
//       return false;
//     }
//     return endDate && endDate.isBefore(startDate, "day");
//   };

//   const handleFieldBlur = async (fieldName) => {
//     try {
//       await form.validateFields([fieldName]);
//     } catch (error) {
//       console.error(`Validation failed for ${fieldName}:`, error);
//     }
//   };

//   const formatBudget = (value) => {
//     // Remove all non-numeric characters except "$" and "VND"
//     let numericValue = value.replace(/[^\d$VND]/g, "");

//     // Check if the value has "$" or "VND"
//     const hasDollarSign = numericValue.startsWith("$");
//     const hasVND = numericValue.endsWith("VND");

//     // Remove "$" and "VND" for formatting
//     if (hasDollarSign) {
//       numericValue = numericValue.slice(1);
//     }
//     if (hasVND) {
//       numericValue = numericValue.slice(0, -3);
//     }

//     // Format the number with commas
//     numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//     // Add "$" or "VND" back
//     if (hasDollarSign) {
//       numericValue = `$${numericValue}`;
//     }
//     if (hasVND) {
//       numericValue = `${numericValue}VND`;
//     }

//     return numericValue;
//   };

//   const handleBudgetChange = (e) => {
//     const { value } = e.target;
//     const formattedValue = formatBudget(value);
//     form.setFieldsValue({ budget: formattedValue });
//   };

//   const handleBudgetBlur = async () => {
//     const value = form.getFieldValue("budget");
//     if (!value.includes("$") && !value.includes("VND")) {
//       message.error("Budget must include either $ or VND");
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: "24px 0",
//         background: "#fff",
//         maxWidth: "1000px",
//         margin: "auto",
//       }}
//     >
//       <h2>New Project</h2>
//       <Form form={form} onFinish={onFinish}>
//         <Form.Item
//           label="Project Name"
//           name="name"
//           rules={[
//             { required: true, message: "Please input the project name!" },
//           ]}
//         >
//           <Input onBlur={() => handleFieldBlur("name")} />
//         </Form.Item>

//         <Form.Item
//           label="Description"
//           name="description"
//           rules={[
//             {
//               required: true,
//               message: "Please input the project description!",
//             },
//           ]}
//         >
//           <TextArea rows={4} onBlur={() => handleFieldBlur("description")} />
//         </Form.Item>

//         <Form.Item
//           label="Start Date"
//           name="startDate"
//           rules={[{ required: true, message: "Please select the start date!" }]}
//         >
//           <DatePicker
//             format="YYYY-MM-DD"
//             onChange={(date) => setStartDate(date)}
//             disabledDate={disabledStartDate}
//             onBlur={() => handleFieldBlur("startDate")}
//           />
//         </Form.Item>

//         <Form.Item
//           label="End Date"
//           name="endDate"
//           rules={[{ required: true, message: "Please select the end date!" }]}
//         >
//           <DatePicker
//             format="YYYY-MM-DD"
//             onChange={(date) => setEndDate(date)}
//             disabledDate={disabledEndDate}
//             onBlur={() => handleFieldBlur("endDate")}
//           />
//         </Form.Item>

//         <Form.Item
//           label="Client Name"
//           name="clientName"
//           rules={[{ required: true, message: "Please input the client name!" }]}
//         >
//           <Input onBlur={() => handleFieldBlur("clientName")} />
//         </Form.Item>

//         <Form.Item
//           label="Client Contact"
//           name="clientContact"
//           rules={[
//             {
//               required: true,
//               message: "Please input the client contact information!",
//             },
//           ]}
//         >
//           <Input onBlur={() => handleFieldBlur("clientContact")} />
//         </Form.Item>

//         <Form.Item
//           label="Project Manager"
//           name="projectManager"
//           rules={[
//             { required: true, message: "Please input the project manager!" },
//           ]}
//         >
//           <Input onBlur={() => handleFieldBlur("projectManager")} />
//         </Form.Item>

//         <Form.Item
//           label="Team Members"
//           name="teamMembers"
//           rules={[{ required: true, message: "Please list the team members!" }]}
//         >
//           <TextArea rows={2} onBlur={() => handleFieldBlur("teamMembers")} />
//         </Form.Item>

//         <Form.Item
//           label="Budget"
//           name="budget"
//           rules={[
//             { required: true, message: "Please input the project budget!" },
//           ]}
//         >
//           <Input
//             onBlur={handleBudgetBlur}
//             onChange={handleBudgetChange}
//             maxLength={20}
//           />
//         </Form.Item>

//         <Form.Item
//           label="Status"
//           name="status"
//           rules={[
//             { required: true, message: "Please select the project status!" },
//           ]}
//         >
//           <Select onBlur={() => handleFieldBlur("status")}>
//             <Option value="NOT STARTED">Not Started</Option>
//             <Option value="ONGOING">Ongoing</Option>
//             <Option value="COMPLETED">Completed</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label="Priority"
//           name="priority"
//           rules={[
//             { required: true, message: "Please select the project priority!" },
//           ]}
//         >
//           <Select onBlur={() => handleFieldBlur("priority")}>
//             <Option value="HIGH">High</Option>
//             <Option value="MEDIUM">Medium</Option>
//             <Option value="LOW">Low</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label="Category"
//           name="category"
//           rules={[
//             { required: true, message: "Please select the project category!" },
//           ]}
//         >
//           <Select
//             mode="multiple"
//             placeholder="Select categories"
//             onBlur={() => handleFieldBlur("category")}
//           >
//             <Option value="WEB DESIGN">Web Design</Option>
//             <Option value="MOBILE APP">Mobile App Development</Option>
//             <Option value="UI/UX">UI/UX</Option>
//           </Select>
//         </Form.Item>

//         {/* Select technologies */}
//         <Form.Item label="Technologies Used" name="technologies">
//           <Select
//             mode="multiple"
//             placeholder="Select technologies"
//             onBlur={() => handleFieldBlur("technologies")}
//           >
//             {technologies.map((tech) => (
//               <Option key={tech.value} value={tech.value}>
//                 {tech.label}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         {/* Select programming languages */}
//         <Form.Item label="Programming Languages Used" name="languages">
//           <Select
//             mode="multiple"
//             placeholder="Select languages"
//             onBlur={() => handleFieldBlur("languages")}
//           >
//             {languages.map((lang) => (
//               <Option key={lang.value} value={lang.value}>
//                 {lang.label}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item label="Attachments" name="attachments">
//           <Upload
//             fileList={fileList}
//             beforeUpload={() => false}
//             onChange={handleImageChange}
//             onBlur={() => handleFieldBlur("attachments")}
//           >
//             <Button icon={<UploadOutlined />}>Click to Upload</Button>
//           </Upload>
//         </Form.Item>

//         <Form.Item>
//           <Checkbox checked={agreement} onChange={handleAgreementChange}>
//             I have read the agreement
//           </Checkbox>
//           {!agreement && (
//             <div style={{ color: "red" }}>Should accept agreement</div>
//           )}
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" disabled={!agreement}>
//             Register
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default NewProject;
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllLanguages } from "../service/LanguageServices";
import { postCreateProject } from "../service/Project";
import { fetchAllTechnology } from "../service/TechnologyServices";
import { fetchAllEmployees } from "../service/EmployeeServices";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const NewProject = () => {
  const [technologies, setTechnologies] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [agreement, setAgreement] = useState(false);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [startDate, setStartDate] = useState(null); // State to store selected start date
  const [endDate, setEndDate] = useState(null); // State to store selected end date

  const onFinish = async (values) => {
    try {
      const projectData = {
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        technologies: values.technologies,
        languages: values.languages,
      };
      await postCreateProject(projectData, imageFile);
      message.success("Project added successfully");
      navigate("/project-management");
    } catch (error) {
      message.error("Failed to add project");
    }
  };

  const handleAgreementChange = (e) => {
    setAgreement(e.target.checked);
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setImageFile(fileList[fileList.length - 1].originFileObj);
    } else {
      setImageFile(null);
    }
  };

  // Load technologies
  useEffect(() => {
    const loadTechnologies = async () => {
      try {
        const data = await fetchAllTechnology();
        const techOptions = data.map((tech) => ({
          label: tech.name,
          value: tech.key, // Use key as value for Option
        }));
        setTechnologies(techOptions);
      } catch (err) {
        setError("Failed to fetch technologies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTechnologies();
  }, []);

  // Load languages
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const data = await fetchAllLanguages();
        const languageOptions = data.map((lang) => ({
          label: lang.name,
          value: lang.key, // Use key as value for Option
        }));
        setLanguages(languageOptions);
      } catch (err) {
        setError("Failed to fetch languages");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLanguages();
  }, []);

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchAllEmployees();
        const employeeOptions = data
          .filter((emp) => emp.role === "employee")
          .map((emp) => ({
            label: emp.name,
            value: emp.key, // Use key as value for Option
          }));
        setEmployees(employeeOptions);
      } catch (err) {
        setError("Failed to fetch employees");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  const disabledStartDate = (startDate) => {
    if (!endDate) {
      return false;
    }
    return startDate && startDate.isAfter(endDate, "day");
  };

  const disabledEndDate = (endDate) => {
    if (!startDate) {
      return false;
    }
    return endDate && endDate.isBefore(startDate, "day");
  };

  const handleFieldBlur = async (fieldName) => {
    try {
      await form.validateFields([fieldName]);
    } catch (error) {
      console.error(`Validation failed for ${fieldName}:`, error);
    }
  };

  const formatBudget = (value) => {
    let numericValue = value.replace(/[^\d$VND]/g, "");
    const hasDollarSign = numericValue.startsWith("$");
    const hasVND = numericValue.endsWith("VND");

    if (hasDollarSign) {
      numericValue = numericValue.slice(1);
    }
    if (hasVND) {
      numericValue = numericValue.slice(0, -3);
    }

    numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (hasDollarSign) {
      numericValue = `$${numericValue}`;
    }
    if (hasVND) {
      numericValue = `${numericValue}VND`;
    }

    return numericValue;
  };

  const handleBudgetChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatBudget(value);
    form.setFieldsValue({ budget: formattedValue });
  };

  const handleBudgetBlur = async () => {
    const value = form.getFieldValue("budget");
    if (!value.includes("$") && !value.includes("VND")) {
      message.error("Budget must include either $ or VND");
    }
  };

  return (
    <div
      style={{
        padding: "24px 0",
        background: "#fff",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <h2>New Project</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Project Name"
          name="name"
          rules={[
            { required: true, message: "Please input the project name!" },
          ]}
        >
          <Input onBlur={() => handleFieldBlur("name")} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input the project description!",
            },
          ]}
        >
          <TextArea rows={4} onBlur={() => handleFieldBlur("description")} />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select the start date!" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            onChange={(date) => setStartDate(date)}
            disabledDate={disabledStartDate}
            onBlur={() => handleFieldBlur("startDate")}
          />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select the end date!" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            onChange={(date) => setEndDate(date)}
            disabledDate={disabledEndDate}
            onBlur={() => handleFieldBlur("endDate")}
          />
        </Form.Item>

        <Form.Item
          label="Client Name"
          name="clientName"
          rules={[{ required: true, message: "Please input the client name!" }]}
        >
          <Input onBlur={() => handleFieldBlur("clientName")} />
        </Form.Item>

        <Form.Item
          label="Client Contact"
          name="clientContact"
          rules={[
            {
              required: true,
              message: "Please input the client contact information!",
            },
          ]}
        >
          <Input onBlur={() => handleFieldBlur("clientContact")} />
        </Form.Item>

        <Form.Item
          label="Project Manager"
          name="projectManager"
          rules={[
            { required: true, message: "Please input the project manager!" },
          ]}
        >
          <Input onBlur={() => handleFieldBlur("projectManager")} />
        </Form.Item>

        <Form.Item
          label="Team Members"
          name="teamMembers"
          rules={[
            { required: true, message: "Please select the team members!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select team members"
            onBlur={() => handleFieldBlur("teamMembers")}
          >
            {employees.map((emp) => (
              <Option key={emp.value} value={emp.value}>
                {emp.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Budget"
          name="budget"
          rules={[
            { required: true, message: "Please input the project budget!" },
          ]}
        >
          <Input
            onBlur={handleBudgetBlur}
            onChange={handleBudgetChange}
            maxLength={20}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[
            { required: true, message: "Please select the project status!" },
          ]}
        >
          <Select onBlur={() => handleFieldBlur("status")}>
            <Option value="NOT STARTED">Not Started</Option>
            <Option value="ONGOING">Ongoing</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Priority"
          name="priority"
          rules={[
            { required: true, message: "Please select the project priority!" },
          ]}
        >
          <Select onBlur={() => handleFieldBlur("priority")}>
            <Option value="HIGH">High</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="LOW">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[
            { required: true, message: "Please select the project category!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select categories"
            onBlur={() => handleFieldBlur("category")}
          >
            <Option value="WEB DESIGN">Web Design</Option>
            <Option value="MOBILE APP">Mobile App Development</Option>
            <Option value="UI/UX">UI/UX</Option>
          </Select>
        </Form.Item>

        {/* Select technologies */}
        <Form.Item label="Technologies Used" name="technologies">
          <Select
            mode="multiple"
            placeholder="Select technologies"
            onBlur={() => handleFieldBlur("technologies")}
          >
            {technologies.map((tech) => (
              <Option key={tech.value} value={tech.value}>
                {tech.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Select programming languages */}
        <Form.Item label="Programming Languages Used" name="languages">
          <Select
            mode="multiple"
            placeholder="Select languages"
            onBlur={() => handleFieldBlur("languages")}
          >
            {languages.map((lang) => (
              <Option key={lang.value} value={lang.value}>
                {lang.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Attachments" name="attachments">
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleImageChange}
            onBlur={() => handleFieldBlur("attachments")}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Checkbox checked={agreement} onChange={handleAgreementChange}>
            I have read the agreement
          </Checkbox>
          {!agreement && (
            <div style={{ color: "red" }}>Should accept agreement</div>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!agreement}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewProject;
