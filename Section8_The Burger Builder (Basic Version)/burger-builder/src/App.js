import React from 'react';
import styles from './App.module.css';
import Layout from './components/Layout/Layout'

function App() {
  return (
    <div className = {styles.App}>
      <Layout>
        <p>say ho~~~~~</p>
      </Layout>
    </div>
  );
}

export default App;
