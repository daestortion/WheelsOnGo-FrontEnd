import React from 'react';
import "../Css/PaymentPopup.css";
import qrcode from "../Images/qrcode.png";
import line1 from "../Images/line11.png";
import close from "../Images/close.png";
import back from "../Images/back.png";

export const PaymentPopup = () => {
  return (
    <div className="payment-popup">
      <div className="overlap-wrapper">
        <div className="overlap11">
          <div className="text-wrapper">Payment</div>
          <button className="back">
            <img className="vector" alt="Vector" src={back} />
          </button>
          <p className="pp">Scan the QR code to pay, then upload a screenshot of the receipt.</p>
          <p className="divv">by clicking, you are confirming that you have read,</p>
          
          <p className="understood-and-agree">
            <span className="span">understood and agree to the </span>
            <span className="text-wrapper-22">terms and conditions</span>
            <span className="span">.</span>
          </p>
          <input type="checkbox" className="rectangle11" />

          <div className="rectangle-2" />
          <div className="text-wrapper-3">carBrand carModel carYear</div>
          <div className="overlap-groupp">
            <div className="text-wrapper-444">rentPrice</div>
            <div className="text-wrapper-55">contactNumber</div>
            <img className="img" alt="Vector" src={line1} />
          </div>
          <div className="text-wrapper-6">Return Date:</div>
          <div className="text-wrapper-7">Total: Php</div>
          <div className="text-wrapper-8">Pick-up Date:</div>
          <div className="text-wrapper-9">Pick-up Location:</div>
          <div className="overlap-2">
            <div className="group">
              <div className="div-wrapper">
                <div className="text-wrapper-10">Upload</div>
              </div>
            </div>
            <div className="payment-screenshot">Payment&nbsp;&nbsp;Screenshot</div>
          </div>
          <div className="overlap-group-wrapper">
            <button className="overlap-33">
              <div className="text-wrapper-11">Next</div>
            </button>
          </div>
          <button className="close">
            <img className="vector-2" alt="Vector" src={close} />
          </button>
          <img className="image" alt="Image" src={qrcode} />
        </div>
      </div>
    </div>
  );
};



export default PaymentPopup;