import React from 'react';

const Btn = ({ onClick }) => {
    return (
        <button
            style={{
            width: "77px",
            height: "32px",
            background: "transparent",
            color: "#3c7d3c",
            marginTop: "-10px",
            borderRadius: "4px",
            borderColor: "#3c7d3c",
            transition: "background 0.3s, color 0.3s",
            cursor: "pointer",
            }}
            // Apply styles on button click
            onClick={onClick}
            // Apply hover styles
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#3c7d3c";
              e.currentTarget.style.color = "white";
            }}
            // Reset styles on mouse leave
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#3c7d3c";
            }}
        >
            Valider
        </button>
    );
};
export default Btn;