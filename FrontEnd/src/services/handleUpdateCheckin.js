import axios from 'axios';
import {routes} from '../routes/routes';

export const performcheckinUpdates = async ({
  name,
  latitude,
  longitude,
  token,
}) => {
  try {
    const response = await axios.post(
      routes.checkin,
      {
        name,
        latitude,
        longitude,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Barear ${token}`,
        },
      },
    );
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    // if(error.response.status )
    return {
      success: false,
      message: error.response.data.message,
    };
  }
};
