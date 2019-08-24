//hold input element

import React from 'react';
const userInput = (props) => {
    return (
        <div className = "UserInput">
        <input type = "text" onChange={props.changed}/>
        </div>
    )
}

export default userInput;