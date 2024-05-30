import React from "react";
import "../Css/DeleteCar.css";

const DeleteCarPopup = ({ confirmDelete, cancelDelete }) => {
  return (
    <div className="delete-car-yesor-no">
      <div className="overlap-wrapper">
        <div className="overlap">
          <p className="text-wrapper">Are you sure you want to delete this car?</p>
          <div className="group" onClick={confirmDelete}>
            <div className="overlap-group">
              <div className="div">Yes</div>
            </div>
          </div>
          <div className="overlap-group-wrapper" onClick={cancelDelete}>
            <div className="overlap-group">
              <div className="div">No</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCarPopup;
