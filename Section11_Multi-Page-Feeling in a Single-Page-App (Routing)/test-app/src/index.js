import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios'

let requestInterceptors = axios.interceptors.request.use(request => {
     console.log(request);
     return request;
},error => {
    console.log(error);
    return Promise.reject(error);
})

let responseInterceptors = axios.interceptors.response.use(response => {
    console.log(response);
    return response;
},error => {
   console.log(error);
   return Promise.reject(error);
})

// axios.interceptors.request.eject(requestInterceptors);
// axios.interceptors.response.eject(responseInterceptors);

// axios instance 사용했음!
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com/';
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';

ReactDOM.render( <App />, document.getElementById( 'root' ) );
registerServiceWorker();
