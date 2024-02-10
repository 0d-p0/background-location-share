import axios from 'axios';
import {routes} from '../routes/routes';

export const performLogin = async ({email, password}) => {
  try {
    const response = await axios.post(routes.login, {
      email: email,
      password: password,
    });
    return {
      success: true,
      message: response.data,
    };
  } catch (error) {
    // if(error.response.status )
    return {
      success: false,
      message: error.response.data.message,
    };
  }
};
