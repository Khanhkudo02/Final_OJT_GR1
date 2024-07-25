import React, { useState } from "react";
import { Modal, Button, Input, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { postCreateTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as databaseRef, set } from "firebase/database";
import { database, storage } from "../firebaseConfig";

const { Option } = Select;

const ModalAddTechnology = ({ open, handleClose }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("active");
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleUpload = () => {
        if (image) {
            const storageReference = storageRef(storage, `images/${image.name}`);
            uploadBytes(storageReference, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    setImageURL(url);
                    saveImageURLToDatabase(url);
                });
            });
        }
    };

    const saveImageURLToDatabase = (url) => {
        const productRef = databaseRef(database, "products/" + Date.now());
        set(productRef, {
            imageURL: url,
            createdAt: Date.now(),
        });
    };

    const handleSubmit = async () => {
        try {
            setUploading(true);

            let uploadedImageURL = imageURL;
            if (image) {
                await handleUpload();
                uploadedImageURL = imageURL;
            }

            await postCreateTechnology(name, description, status, uploadedImageURL);

            handleClose();
            toast.success("Technology added successfully!");
            setName("");
            setDescription("");
            setStatus("active");
            setImage(null);
            setImagePreview("");
        } catch (error) {
            toast.error("Failed to add technology.");
            console.error("Error uploading image or adding technology:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal
            title="Add New Technology"
            open={open}
            onCancel={() => {
                handleClose();
                setImagePreview("");
                setStatus("active");
            }}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Close
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={uploading}
                >
                    Save
                </Button>,
            ]}
        >
            <div className="body-add">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <Input
                        type="text"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <Select
                        value={status}
                        onChange={(value) => setStatus(value)}
                        placeholder="Select Status"
                    >
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </div>
                <div className="mb-3">
                    <Upload
                        accept=".jpg,.jpeg,.png"
                        beforeUpload={(file) => {
                            handleImageChange({ target: { files: [file] } });
                            return false;
                        }}
                        listType="picture"
                    >
                        <Button>
                            <PlusOutlined />
                            Upload Image
                        </Button>
                    </Upload>
                    {imagePreview && (
                        <img src={imagePreview} alt="Image Preview" width="100%" />
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ModalAddTechnology;
