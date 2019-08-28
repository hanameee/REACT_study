import React, {Component} from 'react';
import './App.css';

class App extends Component {
  state = {
    length : null
  }

  inputChangeListener = (event) => {
    const input = event.target.value;
    this.setState({
      length : input.length
    });
  }

  render() {

    return (
      <div className = "App">
        <input type = "text" onChange = {this.inputChangeListener}/>
        <p>{this.state.length}</p>
      </div>
    )
  }
}

export default App;
