import React , { Fragment } from "react";
import styles from './Layout.module.css'
import Toolbar from '../Navigation/Toolbar/Toolbar'
const layout = ( props ) => (
    <Fragment>
        <Toolbar/>
        <main className = {styles.Content}>
            {props.children}
        </main>
    </Fragment>
)

export default layout;