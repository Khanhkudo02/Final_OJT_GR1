// ProjectTracking.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../firebaseConfig";
import { Table } from "antd";
import dayjs from "dayjs";

const ProjectTracking = () => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyRef = ref(database, `projectHistory/${id}`);
        const snapshot = await get(historyRef);
        const data = snapshot.val();
        const formattedData = data
          ? Object.entries(data).map(([key, value]) => ({ key, ...value }))
          : [];
        setHistory(formattedData);
      } catch (error) {
        console.error("Failed to fetch project history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => dayjs(timestamp).format("DD/MM/YYYY HH:mm:ss"),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <h2>Project History</h2>
      <Table columns={columns} dataSource={history} loading={loading} />
    </div>
  );
};

export default ProjectTracking;
