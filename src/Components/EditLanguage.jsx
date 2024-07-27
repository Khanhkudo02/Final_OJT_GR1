import React, { useState, useEffect } from "react";
import { Input, Select, Button } from "antd";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { putUpdateLanguage, fetchLanguageById } from "../service/LanguageServices";

const { Option } = Select;

const EditLanguage = () => {
    const { id } = useParams(); // Get ID from URL
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                console.log(`Loading language with ID: ${id}`);
                const language = await fetchLanguageById(id);
                if (language) {
                    console.log("Loaded language:", language);
                    setName(language.name || "");
                    setDescription(language.description || "");
                    setStatus(language.status || "");
                } else {
                    toast.error("Language not found.");
                }
            } catch (error) {
                toast.error("Failed to fetch language data.");
            }
        };

        loadLanguage();
    }, [id]);

    const handleUpdateLanguage = async () => {
        if (!name || !description || !status) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            await putUpdateLanguage(id, name, description, status);
            toast.success("Language updated successfully!");
            navigate("/programming-language");
        } catch (error) {
            toast.error("Failed to update language.");
            console.error("Error details:", error);
        }
    };

    return (
        <div>
            <h2>Edit Language</h2>

            <div className="form-group">
                <label>Name</label>
                <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Description</label>
                <Input.TextArea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Status</label>
                <Select
                    placeholder="Select Status"
                    value={status}
                    onChange={(value) => setStatus(value)}
                >
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                </Select>
            </div>
            <Button
                type="primary"
                onClick={handleUpdateLanguage}
                disabled={!name || !description || !status}
            >
                Save
            </Button>
            <Button
                style={{ marginLeft: 8 }}
                onClick={() => navigate("/programing-language")}
            >
                Back to Language Management
            </Button>
        </div>
    );
};

export default EditLanguage;
