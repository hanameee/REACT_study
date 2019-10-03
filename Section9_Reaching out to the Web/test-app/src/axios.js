import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://jsonplaceholder.typicode.com/'
})

// instance는 index.js에서 정의된 global한 default setup을 override 한다!
instance.defaults.headers.common['Authorization'] = 'AUTH_TOKEN_FROM_INSTANCE';

export default instance;
