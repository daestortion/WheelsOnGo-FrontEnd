import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/Report.css";
import close from "../Images/close.png";
import { ReportSuccess } from "./ReportPopup"; // Import the Reportpopup component
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

export const Report = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentUser, setCurrentUser] = useState({
    userId: null,
    username: "",
    fName: "",
    lName: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userId = JSON.parse(storedUser).userId;
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/user/getUserById/${userId}`);
          if (response.status === 200) {
            const userData = response.data;
            setCurrentUser({
              userId: userData.userId,
              username: userData.username,
              fName: userData.fName,
              lName: userData.lName,
            });
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleShowPopup = (event) => {
    event.preventDefault();
    setShowPopup(true);
  };

  const handlePopupClose = async () => {
    setShowPopup(false);
    const report = {
      title,
      description,
      user: {
        userId: currentUser.userId,
        username: currentUser.username,
      },
    }; // Adjust the user object according to your backend requirements
    try {
      await axios.post(`${BASE_URL}/report`, report); // Adjust the URL according to your backend setup
      setIsVisible(false);
    } catch (error) {
      console.error("There was an error submitting the report!", error);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="report">
        <div className="overlap456">

          <div className="groupp3">
          <div className="text-wrapper456">Submit a Report</div>
            <button className="closes" type="button" onClick={handleClose}>
              <img className="vectorsss" alt="Vector" src={close} />
            </button>
          </div>

          <form onSubmit={handleShowPopup}>

          <div className="groupp2">
          <div className="groupp1">
            <div className="text-wrapper-2">Subject:</div>

            <input
              className="rectangle"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            </div>

            <textarea
              className="div-wrappersa"
              placeholder="Write here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

              <button type="submit" className="overlap-group456">
                Submit
              </button>
            </div>


          </form>
        </div>
      {showPopup && <ReportSuccess onClose={handlePopupClose} />}
    </div>
  );
};
