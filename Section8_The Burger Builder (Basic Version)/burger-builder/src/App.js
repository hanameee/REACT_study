import React from 'react';
import styles from './App.module.css';
import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'

function App() {
  return (
    <div className = {styles.App}>
      <Layout>
        <BurgerBuilder/>
      </Layout>
    </div>
  );
}


export default App;
