import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppContext from './src/AppContext/AppContext';
import MainNavigation from './src/Navigation/MainNavigation';

const App = () => {
  return (
    <AppContext>
      <MainNavigation />
    </AppContext>
  );
};

export default App;

const styles = StyleSheet.create({});
