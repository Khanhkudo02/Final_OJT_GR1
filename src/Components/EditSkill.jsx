import React, { useState, useEffect } from "react";
import { Input, Select, Upload, Button, Layout } from "antd";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
    putUpdateSkill,
    fetchSkillById,
} from "../service/SkillServices";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { Header } = Layout;

const EditSkill = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const loadSkill = async () => {
            try {
                console.log(`Loading skill with ID: ${id}`);
                const skill = await fetchSkillById(id);
                if (skill) {
                    console.log("Loaded skill:", skill);
                    setName(skill.name || "");
                    setDescription(skill.description || "");
                    setStatus(skill.status || "");
                } else {
                    toast.error("Skill not found.");
                }
            } catch (error) {
                toast.error("Failed to fetch skill data.");
            }
        };

        loadSkill();
    }, [id]);

    const handleUpdateSkill = async () => {
        if (!name || !description || !status) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            await putUpdateSkill(
                id,
                name,
                description,
                status,
                imageFile
            );
            toast.success("Skill updated successfully!");
            navigate("/position-management");
        } catch (error) {
            toast.error("Failed to update skill.");
            console.error("Error details:", error);
        }
    };

    return (
        <div>
            <h2>{t("EditSkill")}</h2>

            <div className="form-group">
                <label>{t("name")}</label>
                <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>{t("Description")}</label>
                <Input.TextArea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>{t("Status")}</label>
                <Select
                    placeholder="Select Status"
                    value={status}
                    onChange={(value) => setStatus(value)}
                >
                    <Option value="active">{t("active")}</Option>
                    <Option value="inactive">{t("inactive")}</Option>
                </Select>
            </div>
            <Button
                type="primary"
                onClick={handleUpdateSkill}
                disabled={!name || !description || !status}
            >
                {t("save")}
            </Button>
            <Button
                style={{ marginLeft: 8 }}
                onClick={() => navigate("/position-management")}
            >
                {t("BacktoPositionManagement")}
            </Button>
        </div>
    );
};

export default EditSkill;