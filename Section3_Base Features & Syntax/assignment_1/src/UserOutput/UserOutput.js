//hold 2 paragraphs

import React from 'react';

const userOutput = (props) => {
    return (
        <div className = "UserOutput">
        <p>Hi there :D my name is</p>
        <p onClick={props.click}>name: {props.name}</p>
        </div>
    )
}

export default userOutput;