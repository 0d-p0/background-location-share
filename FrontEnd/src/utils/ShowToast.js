import {ToastAndroid} from 'react-native';

export const showToast = ({message}) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER,
  );
};
