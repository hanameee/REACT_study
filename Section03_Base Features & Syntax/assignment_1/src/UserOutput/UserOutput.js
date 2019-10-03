//hold 2 paragraphs
import React from "react";
import "./UserOutput.css";

const userOutput = props => {
    return (
        <div id={props.id} className="UserOutput" onClick={props.clicked}>
            <p className="head">[User #{props.id} Information]</p>
            <p>- name: {props.name}</p>
        </div>
    );
};

export default userOutput;
