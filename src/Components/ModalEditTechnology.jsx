import { useState } from "react";
import { Modal, Button } from "bootstrap";
import { putUpdateTechnology } from "../service/TechnologyServices.js";
import { toast } from 'react-toastify';

const ModalEditTechnology = () => {
    const { show, handleClose, dataUserTechnology } = props;
    const [name, setName] = useState("");
    const [description, setDecription] = useState("");
    const [status, setStatus] = useState("");

    const handleEditTechnology = () => {
        let res = await putUpdateTechnology(name, description, status);
        if (res && res.updateAt) {
            handleEditUserFromModal({
                name: name,
                id: dataTechnologyEdit.id
            })
        }
        console.log(res)
    }

    useEffect(() => {
        if (show) {
            setName(dataTechnologyEdit.name);
            setDecription(dataTechnologyEdit.description);
            setStatus(dataTechnologyEdit.status)
        }
    }, [dataTechnologyEdit])

    console.log(">>> check props: ", dataTechnologyEdit)

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Technology</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-edit">
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" value={name} onChange={(event) => setName(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Decription</label>
                        <input type="text" className="form-control" value={description} onChange={(event) => setDescription(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <input type="text" className="form-control" value={status} onChange={(event) => setStatus(event.target.value)} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleEditTechnology()}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalEditTechnology;