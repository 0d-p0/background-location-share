import {StyleSheet, SafeAreaView} from 'react-native';
import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../Screens/LoginScreen';
import LogoutButton from '../Components/LogoutButton';
import HomeScreen from '../Screens/HomeScreen';
import CheckInHistoryScreen from '../Screens/CheckInHistoryScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import {AppStore} from '../AppContext/AppContext';
import TrackScreen from '../Screens/TrackScreen';
import BottomNavigation from './BottomNavigation';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const {isLogIn} = useContext(AppStore);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLogIn && (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        {isLogIn && (
          <>
            <Stack.Screen
              options={{headerShown: false}}
              name="bottom_navigation"
              component={BottomNavigation}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerRight: () => <LogoutButton />}}
            />
            <Stack.Screen
              name="CheckInHistory"
              component={CheckInHistoryScreen}
              options={{
                title: 'Check-In History',
                headerRight: () => <LogoutButton />,
              }}
            />

            <Stack.Screen
              name="trackScreen"
              component={TrackScreen}
              options={{
                title: 'Employee ',
                headerRight: () => <LogoutButton />,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;

const styles = StyleSheet.create({});
