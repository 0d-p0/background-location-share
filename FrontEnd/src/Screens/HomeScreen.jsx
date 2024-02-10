import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import socket from '../config/socketConfig';
import {AppStore} from '../AppContext/AppContext';
import {showToast} from '../utils/ShowToast';
import {performcheckinUpdates} from '../services/handleUpdateCheckin';
import Geolocation from '@react-native-community/geolocation';

import {requestLocationPermissions} from '../utils/checkBackGroundLocation';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const HomeScreen = ({navigation}) => {
  const {email, token} = useContext(AppStore);
  const [locationName, changeLocationName] = useState('');
  const [roomId, setRoomId] = useState();

  const [location, setLocation] = useState({});

  const handleCheckIn = async () => {
    // Code to send location data to the server
    if (!location.initialRegion) {
      return showToast({message: 'no location found'});
    }
    if (!token) {
      return showToast({message: 'token not found'});
    }
    if (!locationName) {
      return showToast({message: 'please add a location name'});
    }
    const response = await performcheckinUpdates({
      latitude: location.initialRegion.latitude,
      longitude: location.initialRegion.longitude,
      name: locationName,
      token: token,
    });
    const {success, message} = response || {};
    if (!success) {
      return showToast({message: message});
    }
    changeLocationName('');
    showToast({message: message});
  };

  const getCurrentPosition = () => {
    try {
      Geolocation.getCurrentPosition(
        pos => {
          // const data = [pos.coords.latitude, pos.coords.longitude, 'pritam'];
          // socket.emit('locationUpdate123456', JSON.stringify(data));
          console.log(pos);
          setLocation({
            initialRegion: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
          });
        },
        error => console.log('GetCurrentPosition Error', JSON.stringify(error)),
        {enableHighAccuracy: true},
      );
    } catch (error) {
      console.error('error is ', error);
    }
  };

  const shareCurrentPosition = () => {
    // Why only here email cannot aceecess

    try {
      Geolocation.getCurrentPosition(
        pos => {
          // const data = [pos.coords.latitude, pos.coords.longitude, 'pritam'];
          // socket.emit('locationUpdate123456', JSON.stringify(data));
          // console.log(pos);
          setLocation({
            initialRegion: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
          });
          const data = [pos.coords.longitude, pos.coords.latitude];
          socket.emit('location', 'pritam@gmail.com', data);
        },
        error => console.log('GetCurrentPosition Error', JSON.stringify(error)),
        {enableHighAccuracy: true},
      );
    } catch (error) {
      console.error('error is ', error);
    }
  };

  const myTask = async () => {
    shareCurrentPosition();
    console.log(roomId);
    console.log('Hello World');
  };

  useEffect(() => {
    requestTurnOnLocation();
  }, []);

  useEffect(() => {
    if (email) {
      setRoomId(email);
      showToast({message: 'room id Init'});
    }
  }, [email]);
  const ShareLocation = async () => {
    if (!socket.active) {
      socket.connect();
    }
    socket.emit('createRoom', roomId);

    socket.on('roomCreated', data => {
      console.log('Room created:', data);
    });

    ReactNativeForegroundService.add_task(() => myTask(), {
      delay: 10000,
      onLoop: true,
      taskId: 'taskid',
      onError: e => console.log(`Error logging:`, e),
    });

    ReactNativeForegroundService.start({
      id: 1244,
      title: 'Location is Shareing',
      message: 'We are live World',
      icon: 'ic_launcher',
    });
  };

  const stopSharing = async () => {
    socket.on('disconnect', () => {
      console.log(socket.id);
    });
    // socket.close();
    socket.disconnect();
    ReactNativeForegroundService.stopAll();
  };

  async function requestTurnOnLocation() {
    const enabled = await isLocationEnabled();
    if (!enabled) {
      try {
        const enableResult = await promptForEnableLocationIfNeeded();
        console.log(enableResult);
        if (enableResult) {
          getCurrentPosition();
        }
      } catch (error) {
        requestTurnOnLocation();
        console.log(error);
      }
      return;
    }
    getCurrentPosition();
  }

  requestLocationPermissions();
  return (
    <ScrollView style={{height: height}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginTop: 10,
          height: height / 12,
        }}>
        <TextInput
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            marginHorizontal: 10,
            width: '45%',
          }}
          onChangeText={changeLocationName}
          placeholder="Enter Location Name"
          placeholderTextColor={'black'}
          value={locationName}
        />
        <TouchableOpacity
          onPress={handleCheckIn}
          style={{
            backgroundColor: 'lime',
            padding: 10,
            alignItems: 'center',
            elevation: 10,
            borderRadius: 10,
            margin: 10,
            width: '40%',
            height: '80%',
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
              fontSize: 22,
            }}>
            CheckIn
          </Text>
        </TouchableOpacity>
      </View>
      {location?.initialRegion && (
        <MapView
          style={{
            width: '100%',
            height: (height * 60) / 100,
          }}
          initialRegion={location.initialRegion}
          region={location.initialRegion}>
          <Marker
            description="Delivery person 1"
            coordinate={location.initialRegion}></Marker>
        </MapView>
      )}
      {/* <Text>Latitude: {location ? location.coords.latitude : '-'}</Text>
      <Text>Longitude: {location ? location.coords.longitude : '-'}</Text> */}
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          padding: 10,
          borderRadius: 10,
          bottom: '10%',
        }}>
        <Text style={{color: 'black', fontWeight: '500', fontSize: 18}}>
          Roomid : {email}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 10,
        }}>
        <TouchableOpacity
          onPress={ShareLocation}
          style={{
            backgroundColor: 'skyblue',
            padding: 10,
            alignItems: 'center',
            elevation: 10,
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
              fontSize: 22,
            }}>
            Share Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={stopSharing}
          style={{
            backgroundColor: 'tomato',
            padding: 10,
            alignItems: 'center',
            elevation: 10,
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
              fontSize: 22,
            }}>
            Stop Sharing
          </Text>
        </TouchableOpacity>
      </View>

      {!location && (
        <View
          style={{
            position: 'absolute',
            top: '50%',
            width: width,
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
          <Text style={{fontWeight: '500', fontSize: 22}}>
            loading Location ...
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HomeScreen;
