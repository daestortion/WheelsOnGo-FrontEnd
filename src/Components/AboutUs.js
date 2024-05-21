import React from "react";
import "../Css/AboutUs.css";
import vector from "../Images/adminvector.png";
import ashercircle1 from "../Images/ashercircle1.png";
import image1 from "../Images/car12.png";
import dancircle1 from "../Images/dancircle1.png";
import godwincircle1 from "../Images/godwincircle1.png";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";
import vector5 from "../Images/vector5.png";
import z1 from "../Images/z1.png";
import d1 from "../Images/d1.png";
import k1 from "../Images/k1.png";
import line from "../Images/linevector.png";
import zartcircle1 from "../Images/zartcircle1.png";
import kencircle1 from "../Images/kencircle1.png";
import racaza1 from "../Images/racaza1.png";
import tatardcircle1 from "../Images/tatardcircle1.png";
import Dropdown from "../Components/Dropdown.js";
import { useNavigate } from 'react-router-dom';


export const AboutUsFinal = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home'); // Navigate to dashboard page which is at '/home'
};

const handleCarsClick = () => {
    navigate('/cars'); // Navigate to cars page
};

const handleAboutClick = () => {
    navigate('/aboutus'); // Navigate to about-us page
};


  return (
    <div className="about-us-FINAL">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="fgh" />
          <div className="jkl" />
          <div className="frame">
            <div className="overlap-group">
             
              <img className="vector" alt="Vector" src={vector} />
              <p className="wheels-on-go">
                <span className="text-wrapper">Wheels</span>
                <span className="span"> On Go</span>
              </p>
              <p className="at-wheels-on-go-we">
                At Wheels On Go, we&#39;re dedicated to providing a superior car rental experience. With a modern fleet
                of well-maintained vehicles and convenient locations across Cebu City, we make it easy to rent the
                perfect car for your needs.
              </p>
              <img className="vector-2" alt="Vector" src={vector} />
              <img className="img" alt="Vector" src={vector5} />
              
              <img className="image" alt="Image" src={image1} />
              <div className="div">Our Story</div>
              <p className="wheels-on-go-was">
                Wheels On Go was founded in 2024 by a team passionate about the automotive industry and committed to
                delivering exceptional customer service. We started small, with just a handful of rental locations. But
                thanks to our focus on quality, value, and customer satisfaction, we&#39;ve grown into a leading
                national car rental company.
              </p>
              <img className="vector-3" alt="Vector" src={line} />
              <img className="nobvg" alt="Nobvg" src={d1} />
              <img className="ken" alt="Ken" src={k1} />
              <img className="g" alt="G" src={z1} />
              <img className="vector-4" alt="Vector" src={vector} />
              <div className="text-wrapper-2">Mike Lawrence Alpas</div>
              <div className="text-wrapper-3">Asher Dave Sumalpong</div>
              <div className="text-wrapper-4">Daniel Gilbert Dela Peña</div>
              <div className="text-wrapper-5">Richard Molina</div>
              <div className="text-wrapper-6">Francis Vinz Racaza</div>
              <div className="text-wrapper-7">Godwin Sanjorjo</div>
              <div className="text-wrapper-8">Kenneth Orland Ayade</div>
              <div className="text-wrapper-9">Meet the Team</div>
              <img className="ashercircle" alt="Ashercircle" src={ashercircle1} />
              <img className="dancircle" alt="Dancircle" src={dancircle1} />
              <img className="godwincircle" alt="Godwincircle" src={godwincircle1} />
              <img className="kencircle" alt="Kencircle" src={kencircle1} />
              <img className="tatardcircle" alt="Tatardcircle" src={tatardcircle1} />
              <img className="zartcircle" alt="Zartcircle" src={zartcircle1} />
              <img className="racaza" alt="Racaza" src={racaza1} />
              <p className="interested-contact">
                Interested? Contact Us
                <br />
                Facebook: WheelsOnGo Cebu | Contact No: 0956 729 1562
              </p>
            </div>
          </div>
          <div className="rectangle-2" />

          <Dropdown>
            <button className="group">
              <img alt="Group" src={profile} />
            </button>
          </Dropdown>

          <div className="text-wrapper-10" onClick={handleHomeClick}>Home</div>
          <div className="text-wrapper-11" onClick={handleCarsClick}>Cars</div>
          <div className="text-wrapper-12" onClick={handleAboutClick}>About</div>
          <img className="sideview" alt="Sideview" src={sidelogo} />
        </div>
      </div>
    </div>
  );
};

export default AboutUsFinal;