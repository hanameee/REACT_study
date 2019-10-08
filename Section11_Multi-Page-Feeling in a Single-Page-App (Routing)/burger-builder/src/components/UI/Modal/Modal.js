import React, { Component, Fragment } from "react";
import styles from "./Modal.module.css";
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {

    componentDidUpdate(){
        console.log('[Modal]Updated!')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.show !== this.props.show || nextProps.children !== this.props.children) {
            return true;
        } else {
            return false;
        }
    }

    render(){
        return(
        <Fragment>
            <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
            <div
                className={styles.Modal}
                style={{
                    transform: this.props.show
                        ? "translateY(0)"
                        : "translateY(-100vh)",
                    opacity: this.props.show ? "1" : "0"
                }}
            >
                {this.props.children}
            </div>
        </Fragment>
        )
    }
};


export default Modal;
