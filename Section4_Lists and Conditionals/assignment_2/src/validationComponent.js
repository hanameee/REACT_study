import React from 'react';

const validationComponent = (props) => {
    let message = "text too short";
    if(props.length > 5) {
      message = "text long enough";
    }
    return (
        <div className = "validationComponent">
            <p>{message}</p>
        </div>
    );
}

export default validationComponent;