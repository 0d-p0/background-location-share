import AsyncStorage from '@react-native-async-storage/async-storage';

export const emailSave = async value => {
  try {
    await AsyncStorage.setItem('email', value);
    return true;
  } catch (e) {
    // saving error
    return false;
  }
};

export const emailRead = async () => {
  try {
    const value = await AsyncStorage.getItem('email');
    if (value !== null) {
      // value previously stored
      return value;
    }
  } catch (e) {
    // error reading value
    return null;
  }
};

export const emailDelete = async () => {
  try {
    await AsyncStorage.removeItem('email');
    return true;
  } catch (e) {
    // remove error
    return null;
  }
};
