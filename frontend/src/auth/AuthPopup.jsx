import React from 'react';
import './AuthPopup.css';

const AuthPopup = ({ message, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>Authentication Successful</h2>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AuthPopup;
