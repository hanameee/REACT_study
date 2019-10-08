import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://react-burgerbuilder-cd09c.firebaseio.com'
})

export default instance;