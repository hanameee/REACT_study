import React from 'react';
import styles from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { lable: 'Salad' , type: 'salad'},
    { lable: 'Bacon' , type: 'bacon'},
    { lable: 'Cheese' , type: 'cheese'},
    { lable: 'Meat' , type: 'meat'}
];

const buildControls = ( props ) => (
    <div className = {styles.BuildControls}>
        {controls.map(ctrl => (
            <BuildControl key={ctrl.lable} lable={ctrl.lable}/>
        ))}
    </div>
);

export default buildControls;