import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {performLogin} from '../services/handleLogin';
import {AppStore} from '../AppContext/AppContext';

const LoginScreen = ({navigation}) => {
  const {saveToken} = useContext(AppStore);
  const [email, setEmail] = useState('pritam@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email) {
      console.log('emai error ', email);
      return setError('please fill the email field');
    }
    if (!password) {
      console.log('password error ', password);
      return setError('please fill the password field');
    }
    const response = await performLogin({email, password});
    const {success, message} = response || {};
    if (!success) {
      return setError(message);
    }

    const responseSave = await saveToken({
      token: message.token,
      email: message.email,
    });
    setError(responseSave);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Location Tracking</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  registerLink: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
