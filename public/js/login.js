//client side javascript for login page
/* eslint-disable */

//Note: client facing javascript code, and only mordern browsers can run async/await
//Axios is used to make http requests from the browser to the server
import axios from 'axios';
import { showAlert } from './alert.js'; //importing the showAlert function from the alerts.js file

axios.defaults.withCredentials = true;

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login', //since we are hosting the api and the website on the same server
      data: {
        email,
        password,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/'); //redirecting to the home page
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
