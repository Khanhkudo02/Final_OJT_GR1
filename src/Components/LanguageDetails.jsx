import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLanguageById } from "../service/LanguageServices";
import { Button, Spin, message } from 'antd';
import "../Components/LanguageDetails.scss";

const LanguageDetails = () => {
    const { id } = useParams();
    const [language, setLanguage] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const data = await fetchLanguageById(id);
                setLanguage(data);
                setLoading(false);
            } catch (error) {
                message.error('Failed to fetch language details.');
                setLoading(false);
            }
        };

        loadLanguage();
    }, [id]);

    if (loading) return <Spin size="large" />;

    return (
        <div className="language-details">
            <h2>Language Details</h2>
            {language ? (
                <div>
                    <p><strong>Name:</strong> {language.name}</p>
                    <p><strong>Description:</strong> {language.description}</p>
                    <p><strong>Status:</strong> {language.status}</p>
                    <Button type="primary" onClick={() => navigate("/language-management")}>
                        Back to Language Management
                    </Button>
                </div>
            ) : (
                <p>Language not found.</p>
            )}
        </div>
    );
};

export default LanguageDetails;
