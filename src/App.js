import React, { useState, useEffect, useCallback } from "react";

import { useMediaPredicate } from "react-media-hook";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

import { initialValues, editedData } from "./services/helpers";
import {
  FormSlim,
  FormWide,
  Table,
  TableCopiesList,
  Modal,
} from "./components";

const App = () => {
  //  < ---------- useState ---------- >
  const [inputValues, setInputValues] = useState(initialValues);
  const [editedValues, setEditedValues] = useState(editedData);

  const [tableData, setTableData] = useState([]);
  const [tableDataCopy, setTableDataCopy] = useState([]);

  const [checked, setCheckbox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rowElementID, setRowElementID] = useState(null);

  //  < ---------- useCallback ---------- >
  // close modal
  const handleCloseModal = useCallback((e) => {
    handleResetModal();
    setShowModal(false);
  }, []);
  // close modal on press Escape
  const handleCloseModalOnEscape = useCallback(
    (e) => {
      e.keyCode === 27 && handleCloseModal();
    },
    [handleCloseModal]
  );
  // close modal on overlay click
  const handleOverlayClick = useCallback(({ target }) => {
    if (target.classList.contains("overlay")) setShowModal(false);
  }, []);

  //  < ---------- useMedia ---------- >
  const tabletUp = useMediaPredicate("(min-width: 768px)");

  //  < ---------- useEffect ---------- >
  useEffect(() => {
    document.addEventListener("keydown", handleCloseModalOnEscape, false);
    document.addEventListener("mousedown", handleOverlayClick, false);

    return () => {
      document.removeEventListener("keydown", handleCloseModalOnEscape, false);
      document.removeEventListener("mousedown", handleOverlayClick, false);
    };
  }, [handleCloseModalOnEscape, handleOverlayClick]);

  //  < ----- FORM ----- >
  // get input values
  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name.includes("modal")) {
      setEditedValues((prevState) => ({ ...prevState, [name]: value }));
      return;
    }
    setInputValues((prevState) => ({ ...prevState, [name]: value }));
  };
  // reset form input fields
  const handleReset = () => setInputValues({ ...initialValues });
  // submit form data
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, surname, age, city } = inputValues;

    if ((name !== "" && surname !== "" && age !== "", city !== "")) {
      const contact = {
        id: uuidv4(),
        name,
        surname,
        age,
        city,
      };

      setTableData([...tableData, contact]);
      handleReset();
    }
  };
  // hide input placeholder
  const onFocus = ({ target }) => (target.placeholder = "");
  // show input placeholder
  const onBlur = ({ target }) =>
    (target.placeholder =
      target.name.charAt(0).toUpperCase() + target.name.slice(1));

  //  < ----- TABLE ----- >
  // delete row(original table)
  const handleDeleteRow = (id) => {
    setTableData(tableData.filter((item) => item.id !== id));
  };
  // delete row(copied table)
  const handleDeleteRowCopy = (id) => {
    setTableDataCopy(
      tableDataCopy.map((item) => {
        return item.filter((itm) => itm.id !== id);
      })
    );
  };
  // edit table row (open modal)
  const handleEditRow = (id) => {
    setShowModal(!showModal);
    setRowElementID(id);
  };
  // copy table & state
  const handleCopyTable = () => {
    let setNewID = [];
    if (tableData.length > 0) {
      setNewID = tableData.map((contact) => {
        const { name, surname, age, city } = contact;
        return {
          id: uuidv4(),
          name,
          surname,
          age,
          city,
        };
      });
    }

    setTableDataCopy((prev) => [...prev, setNewID]);
  };
  // delete last table copy
  const handleDeleteLastTableCopy = () => {
    setTableDataCopy(tableDataCopy.slice(0, -1));
  };
  // delete table copy
  const handleDeleteTable = (e) => {
    if (e.target.attributes.getNamedItem("data-index") === null) {
      return;
    }
    if (e.target.tagName === "BUTTON") {
      const index = parseInt(
        e.target.attributes.getNamedItem("data-index").value
      );
      setTableDataCopy(tableDataCopy.filter((item, idx) => idx !== index));
    }
  };

  //  < ----- MODAL ----- >
  // toggle checkbox
  const toggleCheckbox = () => {
    setCheckbox(!checked);
  };
  // reset modal form input fields
  const handleResetModal = () => setEditedValues({ ...editedData });
  // save editing changes
  const handleModalSubmit = (e) => {
    e.preventDefault();
    const { modalName, modalSurname, modalCity } = editedValues;

    setTableDataCopy(
      tableDataCopy.map((item) => {
        return item.map((itemIn) => {
          if (itemIn.id === rowElementID) {
            return {
              id: itemIn.id,
              name: modalName,
              surname: modalSurname,
              city: modalCity,
              age: itemIn.age,
            };
          }
          return itemIn;
        });
      })
    );

    setCheckbox(false);
    handleCloseModal();
  };

  return (
    <main className="main">
      <div className="container">
        {/* FORMS */}
        <section className="forms">
          <FormSlim
            motion={motion}
            onFocus={onFocus}
            onBlur={onBlur}
            inputValues={inputValues}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
          <FormWide
            motion={motion}
            onFocus={onFocus}
            onBlur={onBlur}
            inputValues={inputValues}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </section>

        {/* TABLES */}
        <section className="tables">
          <Table
            motion={motion}
            tabletUp={tabletUp}
            tableData={tableData}
            handleEditRow={handleEditRow}
            handleDeleteRow={handleDeleteRow}
            handleCopyTable={handleCopyTable}
            handleDeleteLastTableCopy={handleDeleteLastTableCopy}
          />
          <TableCopiesList
            motion={motion}
            tabletUp={tabletUp}
            tableDataCopy={tableDataCopy}
            handleEditRow={handleEditRow}
            handleDeleteRowCopy={handleDeleteRowCopy}
            handleDeleteTable={handleDeleteTable}
          />
        </section>

        {/* MODAL */}
        {showModal && (
          <Modal
            motion={motion}
            editedValues={editedValues}
            onFocus={onFocus}
            onBlur={onBlur}
            checked={checked}
            handleModalSubmit={handleModalSubmit}
            toggleCheckbox={toggleCheckbox}
            handleCloseModal={handleCloseModal}
            handleChange={handleChange}
          />
        )}
      </div>
    </main>
  );
};

export default App;
