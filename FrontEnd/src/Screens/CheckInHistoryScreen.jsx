import React, {useContext, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import axios from 'axios';
import {allCheckinUpdates} from '../services/handleGetAllCheckin';
import {AppStore} from '../AppContext/AppContext';
import {showToast} from '../utils/ShowToast';

const CheckInHistoryScreen = () => {
  const {token} = useContext(AppStore);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchCheckInHistory();
  }, []);

  const fetchCheckInHistory = async () => {
    const response = await allCheckinUpdates({token: token});
    const {success, message} = response || {};
    if (!success) {
      return showToast({message: message});
    }
    setHistory(message);
  };

  console.log(history);

  return (
    <View>
      <Text>Check-In History:</Text>
      {history &&
        history.map((checkin, index) => (
          <View
            key={index}
            style={{
              backgroundColor: 'wheat',
              padding: 10,
              margin: 5,
              borderRadius: 10,
            }}>
            <Text>Place Name: {checkin.name}</Text>
            <Text>Latitude: {checkin.latitude}</Text>
            <Text>Longitude: {checkin.longitude}</Text>
            <Text>
              Timestamp: {new Date(checkin.timestamp).toLocaleString()}
            </Text>
          </View>
        ))}
    </View>
  );
};

export default CheckInHistoryScreen;
