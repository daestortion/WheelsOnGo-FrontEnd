import React from 'react';
import "../Css/PaymentPopup.css";
import vector7 from "../Images/vector7.png";
import qrcode from "../Images/InstaPay.png";
import close from "../Images/close.svg";
import previous from "../Images/previous.png";

export const PaymentPopup = () => {
  return (
    <div className="payment-popup">
      <div className="overlap-wrapper">
        <div className="pp-overlap">
          <div className="text-wrapper">Payment</div>
          <div className="back">
            <img className="vector" alt="Vector" src={previous}/>
          </div>
          <p className="div">by clicking, you are confirming that you have read,</p>
          <p className="pp">Scan the QR code to pay, then upload a screenshot of the receipt.</p>
          <p className="understood-and-agree">
            <span className="span">understood and agree to the </span>
            <span className="text-wrapper-2">terms and conditions</span>
            <span className="span">.</span>
          </p>
          <div className="pp-rectangle" />
          <div className="rectangle-2" />
          <div className="text-wrapper-3">carBrand carModel carYear</div>
          <div className="pp-overlap-group">
            <div className="text-wrapper-4">rentPrice</div>
            <div className="text-wrapper-5">contactNumber</div>
            <img className="img" alt="Vector" src={vector7} />
          </div>
          <div className="text-wrapper-6">Return Date:</div>
          <div className="text-wrapper-7">Total: Php</div>
          <div className="text-wrapper-8">Pick-up Date:</div>
          <div className="text-wrapper-9">Pick-up Location:</div>
          <div className="overlap-2">
            <div className="group">
              <div className="pp-div-wrapper">
                <div className="text-wrapper-10">Upload</div>
              </div>
            </div>
            <div className="payment-screenshot">Payment&nbsp;&nbsp;Screenshot</div>
          </div>
          <div className="overlap-group-wrapper">
            <div className="overlap-3">
              <div className="text-wrapper-11">Next</div>
            </div>
          </div>
          <div className="close">
            <img className="vector-2" alt="Vector" src={close} />
          </div>
          <img className="image" alt="Image" src={qrcode} />
        </div>
      </div>
    </div>
  );
};


export default PaymentPopup;