import React, { useRef, useState } from "react";
import "../Css/ApplyOwnerPopup.css";
import close from "../Images/close.svg";
import Loading from "../Components/Loading.js";

const ApplyOwnerPopup = ({ closePopup, confirmRegister }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [isCheckboxEnabled, setIsCheckboxEnabled] = useState(false);
  const [isAcceptEnabled, setIsAcceptEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const termsBodyRef = useRef(null);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleYesClick = async () => {
    if (isChecked) {
        setIsLoading(true); // Show loading state

        try {
            await confirmRegister(); // Assuming this is an async function
        } catch (error) {
            console.error("Error during registration:", error);
        } finally {
            setIsLoading(false); // Hide loading state after registration process ends
        }
    } else {
        // console.log("Please agree to the terms and conditions first.");
    }
  };

  const handleNoClick = () => {
    closePopup();
  };

  const toggleTermsPopup = () => {
    setShowTermsPopup(!showTermsPopup);
  };

  const handleAcceptTerms = () => {
    setIsCheckboxEnabled(true);
    setIsChecked(true);
    setShowTermsPopup(false);
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = termsBodyRef.current;
    
    // Adding a small buffer of 5px to reliably detect scroll to bottom
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setIsAcceptEnabled(true);
    }
  };

  return (
    <div className="apply-as-owner-popup">
      {isLoading && <Loading />}
      <div className="overlap-wrapper211">
       
          
            <p className="do-you-want-to-apply">
              Do you want to apply as owner?
            </p>
        
        <div className="lines1">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={handleCheckboxChange}
                disabled={!isCheckboxEnabled}
              />
              <label htmlFor="terms"></label>



            <div className="ao-understood-and-agree">
            <p className="ao-div">
              by clicking, you are confirming that you have read,

            </p>
              <span className="spans">understood and agree to the </span>
              <span
                className="ao-text-wrapper-2"
                onClick={toggleTermsPopup}
                style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
              >
                terms and conditions
              </span>
            </div>
          </div>

        <div className="lines2">
          <div className="ao-div-wrapper" onClick={handleYesClick}>
              Yes
            </div>


            <div className="ao-div-wrapper" onClick={handleNoClick}>
              No
            </div>

          </div>
        
      </div>

      {showTermsPopup && (
        <div className="terms-popup">
          <div className="terms-content">
            <div className="terms-header">
              <h2>Terms and Conditions</h2>
              <img
                src={close}
                alt="Close"
                onClick={toggleTermsPopup}
                className="close-icon"
              />
            </div>
            <div
              className="terms-body"
              ref={termsBodyRef}
              onScroll={handleScroll}
            >
              <p>Welcome to Wheels On Go. By using our services, you agree to comply with and be bound by the following terms and conditions. Please review the following terms carefully. If you do not agree to these terms, you should not use this site or our services.</p>
              
              <h3>1. Eligibility Criteria</h3>
              <p>To register as an owner, you must be:</p>
              <ul>
                <li>At least 21 years of age.</li>
                <li>Own or have legal authorization to rent the vehicle list</li>
                <li>Ensure that your vehicle is registered, roadworthy, and complies with local laws and regulations.</li>
                <li>Provide accurate, up-to-date personal information, including a valid government-issued ID.</li>
              </ul>
              
              <h3>2. Owner Responsibilities</h3>
              <p>As an owner on Wheels On Go, you agree to the following:</p>
              <ul>
                <li>You must provide accurate and complete information regarding your vehicle, including its make, model, year, condition, and any known defects.</li>
                <li>Your vehicle must be clean, safe, and in good mechanical condition. It must also have a valid registration, inspection (if required), and insurance coverage that complies with applicable laws.</li>
                <li>You are responsible for ensuring that your vehicle is insured as required by law. Wheels On Go does not provide insurance for your vehicle.</li>
                <li>You are responsible for the maintenance and repair of your vehicle.</li>
                <li>Once you list a vehicle, you must ensure that it is available during the times you have set. If the vehicle becomes unavailable for any reason, you must update its availability in your profile.</li>
              </ul>
              
              <h3>3. Owner Liabilities</h3>
              <ul>
                <li>You acknowledge and accept that any damage, loss, or theft of the vehicle during a rental period is your responsibility.</li>
                <li>In cases where the renter returns the vehicle late or not at all, you must notify Wheels On Go immediately. Late fees or penalties may apply as per the agreed terms.</li>
              </ul>

              <h3>4. Vehicle Delivery and Pickup</h3>
              <ul>
                <li>If renter selects “Delivery” as pick-up option, you must deliver the vehicle to the renter's location, ensure that the delivery fee (if any) is agreed upon before the booking is confirmed.</li>
                <li>Both you and the renter must inspect the vehicle before and after the rental period. Documenting the vehicle's condition through photos or written reports is recommended to avoid disputes.</li>
              </ul>

              <h3>5. Withdrawal and Balance</h3>
              <ul>
                <li>Admin will only approve request of withdrawal of balance after three (3) days of successful booking.</li>
              </ul>
            </div>
            <div className="terms-footer">
              <button
                className={`terms-button accept ${isAcceptEnabled ? "active" : "inactive"}`}
                onClick={handleAcceptTerms}
                disabled={!isAcceptEnabled}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyOwnerPopup;
