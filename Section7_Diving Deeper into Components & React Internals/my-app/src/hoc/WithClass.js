import React from "react";

// const withClass = props => (
//     <div className = {props.classes}>
//         {props.children}
//     </div>
// );

const withClass = (WrapperComponent,className) => {
    return props => (
        <div className = {className}>
            <WrapperComponent />
        </div>
    )
}
export default withClass;