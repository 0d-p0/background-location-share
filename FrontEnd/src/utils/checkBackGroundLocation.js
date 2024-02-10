import {PermissionsAndroid} from 'react-native';

export const requestLocationPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    ]);
    if (
      granted['android.permission.ACCESS_FINE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.ACCESS_COARSE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.ACCESS_BACKGROUND_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('All location permissions granted');
    } else {
      console.log('Location permissions denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
