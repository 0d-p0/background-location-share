import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../Screens/HomeScreen';
import TrackScreen from '../Screens/TrackScreen';
import CheckInHistoryScreen from '../Screens/CheckInHistoryScreen';
import LogoutButton from '../Components/LogoutButton';

const Tab = createBottomTabNavigator();

const LocationIcon = ({color, size}) => {
  return <Entypo name="location" size={size} color={color} />;
};

const LocationShareIcon = ({color, size}) => {
  return <MaterialIcons name="emergency-share" size={size} color={color} />;
};

const LocationHistoryIcon = ({color, size}) => {
  return <MaterialIcons name="location-history" size={size} color={color} />;
};

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Location"
      screenOptions={({route}) => ({
        tabBarStyle: {
          display: 'flex',
          ...styles.tabBarStyle,
        },

        headerRight: () => <LogoutButton />,
      })}

      // initialRouteName="WishList"
    >
      <Tab.Screen
        name="Location"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <View style={styles.activeButton}>
                <LocationIcon color={color} size={30} />
              </View>
            ) : (
              <LocationIcon color={color} size={30} />
            ),
        }}
      />

      <Tab.Screen
        name="Employee Location"
        component={TrackScreen}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <View style={styles.activeButton}>
                <LocationShareIcon color={color} size={30} />
              </View>
            ) : (
              <LocationShareIcon color={color} size={30} />
            ),
        }}
      />

      <Tab.Screen
        name="Location History"
        component={CheckInHistoryScreen}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <View style={styles.activeButton}>
                <LocationHistoryIcon color={color} size={30} />
              </View>
            ) : (
              <LocationHistoryIcon color={color} size={30} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  tabBarStyle: {
    borderRadius: 20,
    shadowColor: 'ocean',
    elevation: 5,
    height: 60,
  },
  activeButton: {
    backgroundColor: 'skyblue',
    borderRadius: 50,
    padding: 5,
    height: 40,
    width: 40,
    alignItems: 'center',
  },
});
