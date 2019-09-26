import React from 'react';
import styles from './Logo.module.css'
import burgerLogo from '../../assets/images/burger-logo.png';
const logo = (props) => (
    <div className = {styles.Logo}>
        {/* 결국 webpack이 모든 파일을 bundle할것이기에 src에 주소를 주면 안되고 import해서 가져와야 한다. 이렇게 해야 webpack이 내가 해당 이미지를 사용하는 것을 알 수 있다. */}
        <img src={burgerLogo} alt="MyBurger"/>
    </div>
);

export default logo;