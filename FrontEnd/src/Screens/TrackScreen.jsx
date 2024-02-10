import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import socket from '../config/socketConfig';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {showToast} from '../utils/ShowToast';

import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

const LocationShareIcon = ({color, size}) => {
  return <MaterialIcons name="emergency-share" size={size} color={color} />;
};

const TrackScreen = ({navigation}) => {
 


  const init = {
    initialRegion: {
      latitude: 21.866310336799565,
      longitude: 88.18418261600618,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };

  const [roomId, setRoomId] = useState('');
  const [location, setLocation] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on('location', loc => {
      console.log(loc);
      setLoading(false);
      setLocation({
        initialRegion: {
          latitude: loc[1],
          longitude: loc[0],
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0421,
        },
      });
    });
  }, []);

  useEffect(() => {
    socket.on('roomDestroyed', data => {
      if (data.status === 'OK') {
        setLocation();
        showToast({message: 'room is destroyed'});
      } else {
        console.log('Error joining the room');
      }
    });
  }, []);

  return (
    <View>
      <TextInput
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          marginHorizontal: 10,
        }}
        onChangeText={setRoomId}
        placeholder="Enter Room ID"
        placeholderTextColor={'black'}
        value={roomId}
      />
      <TouchableOpacity
        disabled={loading}
        onPress={() => {
          if (!roomId) {
            return;
          }
          socket.emit('joinRoom', {roomId: roomId});

          socket.on('roomJoined', data => {
            if (data.status === 'OK') {
              console.log('Successfully joined the room');
              setLoading(true);
            } else {
              showToast({message: 'No Room Found'});
              console.log('Error joining the room');
            }
          });
        }}
        style={{
          backgroundColor: 'lime',
          padding: 10,
          alignItems: 'center',
          elevation: 10,
          borderRadius: 10,
          margin: 10,
        }}>
        <Text
          style={{
            color: 'white',
            fontWeight: '700',
            fontSize: 22,
          }}>
          Track
        </Text>
      </TouchableOpacity>
      {location && (
        <MapView
          style={{
            width: '100%',
            height: '80%',
          }}
          initialRegion={location.initialRegion}
          region={location.initialRegion}>
          <Marker coordinate={location.initialRegion}>
            <LocationShareIcon color={'red'} size={40} />
          </Marker>
        </MapView>
      )}

      {loading && (
        <View
          style={{
            height: '80%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
          <Text style={{fontWeight: '500', fontSize: 22}}>
            Fetch User Location ...
          </Text>
        </View>
      )}
    </View>
  );
};

export default TrackScreen;

const styles = StyleSheet.create({});
