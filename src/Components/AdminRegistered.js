import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/AdminRegistered.css";

export const LoginRegister = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/adminlogin');
  };
  

    return (
      <div className="login-register">
        <div className="overlap-wrapperwe">
          <div className="overlapxc">
            <p className="text-wrapperqwe">You have successfully registered an admin account.</p>
            <div className="groupzxc">
              <button className="overlap-group231" onClick={handleOkClick}>
                <div className="divqwwe">OK</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

export default LoginRegister;
