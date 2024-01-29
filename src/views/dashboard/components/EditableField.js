import React, { useState } from 'react';

const EditableField = ({ value, onChange, id }) => {
  const [editedValue, setEditedValue] = useState(value);

  const handleInputChange = (e) => {
    setEditedValue(e.target.value);
    onChange(e, id); // Call the parent component's onChange to update the state
  };

  return (
    <input
      style={{
        padding: "10px",
        borderRadius: "7px",
        borderColor: "green",
        backgroundColor: "#fcf9f9",
        borderLeftWidth: "0px",
        borderRightWidth: "0px",
        borderTopWidth: "0px",
        width: "100px",
      }}
      type="text"
      value={editedValue}
      onChange={handleInputChange}
    />
  );
};

export default EditableField;
