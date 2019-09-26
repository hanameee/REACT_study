import React from 'react';
import styles from "./Toolbar.module.css";
import Logo from '../../Logo/Logo'
const toolbar = (props) => (
    <header className = {styles.Toolbar}>
        <div>MENU</div>
        <Logo/>
        <nav>
            ...
        </nav>
    </header>
)
export default toolbar;