import React from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

import '../css/patient-schedule-notes.css'

const EditPatientNotes = ({patientData, handleEditNote, editId, handleUpdatedNote}) => {

  const [patientNote, setPatientNote] = useState({
    noteId: editId,
    noteDate: undefined,
    note: undefined
  });

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; 
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    const date = `${month}/${day}/${year} ${hours}:${minutes}`

    const noteValue = patientData.notes.find((note) => {
      return note.noteId === editId;
    });

    setPatientNote((prev) => ({
      ...prev,
      noteDate: date,
      note: noteValue.note
    }));
  }, [patientData]);

  const handleNoteChanges = (event) => {
    const {value} = event.target;

    setPatientNote((prev) => ({
      ...prev,
      note: value
    }));
  };

  const handleSaveNote = () => {
    handleUpdatedNote(patientNote);
    handleEditNote();
  };

  const handleCancelNote = () => {
    handleEditNote();
  };

  return (
    <div>
      <div className="p-notes-title-cont p-3">
        <div className="p-notes-title">
          Shceduling Notes for <span className="p-notes-name">{patientData.firstName}</span>:
        </div>
        <button onClick={handleCancelNote} type="button" className="btn-close close-all close-p-notes me-1" aria-label="Close"></button>
      </div>
      <div className="container">
        <div className="d-flex justify-content-center my-3">
          <textarea
          id="patientNote"
          name="patientNote"
          placeholder="Jane Doe cannot be seen before 10am."
          className="form-control p-note-text"
          value={patientNote.note}
          onChange={handleNoteChanges}
          rows={5}
        />
        </div>
        <div className="d-flex justify-content-end my-2">
          <button disabled={!patientNote.note} onClick={handleSaveNote} className="save-p-note btn">Save</button>
        </div>
      </div>
    </div>
  )
};

export default EditPatientNotes;