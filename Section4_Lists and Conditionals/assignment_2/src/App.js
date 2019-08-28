import React, {Component} from 'react';
import './App.css';
import ValidateInput from './validateInput';

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
        <ValidateInput length = {this.state.length}/>
      </div>
    )
  }
}

export default App;
