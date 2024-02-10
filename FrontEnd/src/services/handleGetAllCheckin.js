import axios from 'axios';
import {routes} from '../routes/routes';

export const allCheckinUpdates = async ({token}) => {
  try {
    const response = await axios.get(routes.checkin, {
      headers: {
        Accept: 'application/json',
        Authorization: `Barear ${token}`,
      },
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
