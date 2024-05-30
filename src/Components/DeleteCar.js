import React from "react";
import "../Css/DeleteCar.css";

const DeleteCarPopup = ({ confirmDelete, cancelDelete }) => {
  return (
    <div className="delete-car-yesor-no">
      <div className="overlap-wrapper45">
        <div className="overlap43">
          <p className="text-wrapper12">Are you sure you want to delete this car?</p>
          <div className="group98" onClick={confirmDelete}>
            <div className="overlap-group67">
              <div className="div34">Yes</div>
            </div>
          </div>
          <div className="overlap-group-wrapper123" onClick={cancelDelete}>
            <div className="overlap-group67">
              <div className="div34">No</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCarPopup;
