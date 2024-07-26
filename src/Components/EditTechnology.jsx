// import React, { useState, useEffect } from 'react';
// import { Input, Select, Button, Upload, message } from 'antd';
// import { useParams, useNavigate } from 'react-router-dom';
// import { putUpdateTechnology, fetchTechnologyById } from '../service/TechnologyServices';
// import { PlusOutlined } from '@ant-design/icons';

// const { Option } = Select;

// const EditTechnology = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState("");
//   const [imageFile, setImageFile] = useState(null);

//   useEffect(() => {
//     const loadTechnology = async () => {
//       try {
//         const technology = await fetchTechnologyById(id);
//         if (technology) {
//           setName(technology.name || "");
//           setDescription(technology.description || "");
//           setStatus(technology.status || "");
//         } else {
//           message.error("Technology not found.");
//         }
//       } catch (error) {
//         message.error("Failed to fetch technology data.");
//       }
//     };

//     loadTechnology();
//   }, [id]);

//   const handleUpdateTechnology = async () => {
//     if (!name || !description || !status) {
//       message.error("Please fill in all fields.");
//       return;
//     }

//     try {
//       await putUpdateTechnology(id, name, description, status, imageFile);
//       message.success("Technology updated successfully!");
//       navigate("/technology-management");
//     } catch (error) {
//       message.error("Failed to update technology.");
//     }
//   };

//   const handleImageChange = ({ file }) => {
//     if (file.type === "image/png" || file.type === "image/svg+xml") {
//       setImageFile(file.originFileObj);
//     } else {
//       message.error("Only PNG and SVG images are allowed.");
//     }
//   };

//   const beforeUpload = (file) => {
//     handleImageChange({ file });
//     return false;
//   };

//   return (
//     <div>
//       <h2>Edit Technology</h2>
//       <div className="form-group">
//         <label>Name</label>
//         <Input
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//       </div>
//       <div className="form-group">
//         <label>Description</label>
//         <Input.TextArea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//       </div>
//       <div className="form-group">
//         <label>Status</label>
//         <Select
//           placeholder="Select Status"
//           value={status}
//           onChange={(value) => setStatus(value)}
//         >
//           <Option value="active">Active</Option>
//           <Option value="inactive">Inactive</Option>
//         </Select>
//       </div>
//       <div className="form-group">
//         <label>Upload Image (PNG or SVG only)</label>
//         <Upload
//           name="image"
//           listType="picture"
//           showUploadList={false}
//           beforeUpload={beforeUpload}
//           onChange={handleImageChange}
//         >
//           <Button icon={<PlusOutlined />}>Upload</Button>
//         </Upload>
//       </div>
//       <Button
//         type="primary"
//         onClick={handleUpdateTechnology}
//         disabled={!name || !description || !status}
//       >
//         Save
//       </Button>
//       <Button style={{ marginLeft: 8 }} onClick={() => navigate("/technology-management")}>
//         Back to Technology Management
//       </Button>
//     </div>
//   );
// };

// export default EditTechnology;
