//hold input element
import React from "react";
import "./UserInput.css";

const userInput = props => {
    const style = {
        border: "3px solid rgb(250, 164, 178)",
        margin: "20px auto"
    };

    return (
        <div className="UserInput">
            <input style = {style} type="text" onChange={props.changed} value={props.name} />
        </div>
    );
};

export default userInput;
