import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import '../css/patient-schedule-notes.css'

const PatientScheduleNotes = ({patientData, handleEditPatientNotes, handleNoteAddition}) => {

  const [patientNote, setPatientNote] = useState({
    noteId: uuidv4(),
    note: undefined
  });

  const handleNoteChanges = (event) => {
    const {value} = event.target;

    setPatientNote((prev) => ({
      ...prev,
      note: value
    }));
  };

  const handleSaveNote = () => {
    handleNoteAddition(patientNote);
    handleEditPatientNotes();
  };

  const handleCancelNote = () => {
    handleEditPatientNotes();
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
          onChange={handleNoteChanges}
          value={patientNote.note}
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

export default PatientScheduleNotes;