import AsyncStorage from '@react-native-async-storage/async-storage';

export const tokenSave = async value => {
  try {
    await AsyncStorage.setItem('token', value);
    return true;
  } catch (e) {
    // saving error
    return false;
  }
};

export const tokenRead = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      // value previously stored
      return value;
    }
  } catch (e) {
    // error reading value
    return null;
  }
};

export const tokenDelete = async () => {
  try {
    await AsyncStorage.removeItem('token');
    return true;
  } catch (e) {
    // remove error
    return null;
  }
};
