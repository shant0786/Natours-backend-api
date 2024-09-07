/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (res.data.status === 'success') {
      showAlert('Logged in Successfully!');
      window.setTimeout(() => {
        console.log('hello');
        location.assign('/ ');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GETg',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.reload(true);
    console.log('end');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
