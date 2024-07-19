import React from 'react'
import { fetchAllUser } from "../assets/script/TechnologyServices.js";
import ModalEditTechnology from "./ModalEditTechnology.jsx"

const TechnologyManagement = () => {
  return (
    <>
      {/* const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [dataTechnologyEdit, setDataTechnologyEdit] = useState({});
    const [listTechnology, setListTechnology] = useState([]);

    const handleEditTechnology = (technology) => {
      setDataTechnologyEdit(technology)
      setIsShowModalEdit(true);
    }

    const handleClose = () => {
      setIsShowModalEdit(false)
    }

    const handleEditTechnologyFromModal = (technology) => {
      let index = listTechnology.findIndex(item => item.id === technology.id)
      console.log(listTechnology)
      console.log(">>> index = ", index)
    } 
    
    const handleUpdateTable = (technology) => {
      setListTechnonoly([technology, ...listTechnology]);
    } */}

      <main>
        <section className="technology">
          <div className="technology-view"></div>
          <div className="technology-create"></div>
          <div className="technology-edit"></div>
          <div className="technology-delete"></div>
        </section>
      </main>

      {/* <ModalEditTechnology
      show={isShowModalEdit}
      dataTechnologyEdit={dataTechnologyEdit}
      handleClose={handleClose}
      handleEditTechnologyFromModal={handleEditTechnologyFromModal}
    /> */}
    </>
  );
}

export default TechnologyManagement