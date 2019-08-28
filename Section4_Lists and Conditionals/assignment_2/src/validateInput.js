import React from 'react';

const validateInput = (props) => {
    let message = "text too short";
    if(props.length > 5) {
      message = "text long enough";
    }
    return (
        <div className = "validateInput">
            <p>{message}</p>
        </div>
    );
}

export default validateInput;