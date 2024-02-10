import React, {useContext} from 'react';
import {Button} from 'react-native';
import {AppStore} from '../AppContext/AppContext';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import socket from '../config/socketConfig';

const LogoutButton = () => {
  const {deleteToken} = useContext(AppStore);

  const handleLogout = async () => {
    // firebase.auth().signOut();
    const deleteResponse = await deleteToken();
    // socket.close();
    socket.disconnect();
    ReactNativeForegroundService.stopAll();
    console.log('delete response is ', deleteResponse);
  };

  return <Button title="Logout" color={'tomato'} onPress={handleLogout} />;
};

export default LogoutButton;
