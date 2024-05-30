import React from "react";
import "../Css/DeleteCar.css";

export const DeleteCarYesorNo = () => {
  return (
    <div className="delete-car-yesor-no">
      <div className="overlap-wrapper">
        <div className="overlap">
          <p className="text-wrapper">Are you sure you want to delete this car?</p>
          <div className="group">
            <div className="overlap-group">
              <div className="div">Yes</div>
            </div>
          </div>
          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <div className="div">No</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
