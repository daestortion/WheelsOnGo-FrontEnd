import React from "react";
import "../Css/AboutUs.css";
import ashercircle1 from "../Images/ashercircle1.png";
import image1 from "../Images/cars1.png";
import dancircle1 from "../Images/dancircle1.png";
import godwincircle1 from "../Images/godwincircle1.png";
import vector5 from "../Images/vector5.png";
import d1 from "../Images/wew.png";
import zartcircle1 from "../Images/zartcircle1.png";
import kencircle1 from "../Images/kencircle1.png";
import Header from "./Header.js";


export const AboutUsFinal = () => {

return (
  <div className="about-us-FINAL">
    <Header />
    
    <div className="frame">
      <div className="part3">
        <img className="image" alt="Image" src={image1} />
        <div className="part2">
          <div className="part1">
            <div className="wheels-on-go">
              <span className="text-wrapper">Wheels</span>
              <span className="span"> On Go</span>
            </div>
            <img className="img" alt="Vector" src={vector5} />
          </div>
          <span className="at-wheels-on-go-we">
            At Wheels On Go, we're dedicated to providing a superior car rental experience. With a modern fleet of 
            well-maintained vehicles and convenient locations across Cebu City, we make it easy to rent the perfect 
            car for your needs.
          </span>
        </div>
      </div>

      <div className="part6">
        <div className="part5">
          <div className="div">Our Story</div>
          <span className="wheels-on-go-was">
            Wheels On Go was founded in 2024 by a team passionate about the automotive industry and committed to 
            delivering exceptional customer service. We started small, with just a handful of rental locations. 
            Thanks to our focus on quality, value, and customer satisfaction, we've grown into a leading national 
            car rental company.
          </span>
        </div>
        <div className="part4">
          <img className="nobvg" alt="Nobvg" src={d1} />
        </div>
      </div>

      <div className="part7">
        <h1 className="text-wrapper-9">Meet the Team</h1>
        <div className="about-us-grid">
          <div className="team-member">
            <img className="zartcircle" alt="Zartcircle" src={zartcircle1} />
            <div className="text-wrapper-2">Mike Lawrence Alpas</div>
          </div>
          <div className="team-member">
            <img className="kencircle" alt="Kencircle" src={kencircle1} />
            <div className="text-wrapper-2">Kenneth Orland Ayade</div>
          </div>
          <div className="team-member">
            <img className="dancircle" alt="Dancircle" src={dancircle1} />
            <div className="text-wrapper-2">Daniel Gilbert Dela Peña</div>
          </div>
          <div className="team-member">
            <img className="godwincircle" alt="Godwincircle" src={godwincircle1} />
            <div className="text-wrapper-2">Godwin Sanjorjo</div>
          </div>
          <div className="team-member">
            <img className="ashercircle" alt="Ashercircle" src={ashercircle1} />
            <div className="text-wrapper-2">Asher Dave Sumalpong</div>
          </div>
        </div>
      </div>

      <div className="part8">
        <span className="interested-contact">
          Interested? Contact Us
          <br /> <br />
          Facebook: WheelsOnGo Cebu | Contact No: 123456789
        </span>
      </div>
    </div>
  </div>
);
};

export default AboutUsFinal;