import {createContext, useEffect, useState} from 'react';
import {tokenDelete, tokenRead, tokenSave} from '../utils/tokenAction';
import {emailDelete, emailRead, emailSave} from '../utils/userEmailStrore';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';

export const AppStore = createContext();
const width = Dimensions.get('screen').width;

const AppContext = ({children}) => {
  const [isLogIn, setLogin] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  // Check user is loged in or not
  useEffect(() => {
    async function checkUser() {
      setLoading(true);
      const value = await tokenRead();
      const emailResponse = await emailRead();

      if (value && emailResponse) {
        setLogin(true);
        setToken(value);
        setEmail(emailResponse);
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  async function saveToken({token, email}) {
    if (!token || !email) {
      return 'token & email need';
    }
    const response = await tokenSave(token);
    const emailResponse = await emailSave(email);
    console.log(response, emailResponse);
    if (!response || !emailResponse) {
      return 'some error occur while save token';
    }

    setToken(token);
    setLogin(true);
    setEmail(email);
    return 'login success';
  }

  async function deleteToken() {
    const response = await tokenDelete();
    const emailResponse = await emailDelete();

    if (!response || !emailResponse) {
      return 'some error occur while delete token';
    }
    if (response) {
      setLogin(false);
      setToken('');
      setEmail('');
    }
  }

  return (
    <AppStore.Provider value={{token, isLogIn, email, saveToken, deleteToken}}>
      {!loading && children}
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: '50%',
            width: width,
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
          <Text style={{fontWeight: '500', fontSize: 22}}>
            initial loading ...
          </Text>
        </View>
      )}
    </AppStore.Provider>
  );
};

export default AppContext;
