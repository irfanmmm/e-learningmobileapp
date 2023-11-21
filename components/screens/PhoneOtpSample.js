import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Logo from '../../src/Assets/drop-down.svg';
import Call from '../../src/Assets/phone.svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {base_url} from '../../key';

export default function PhoneOtpSample({navigation}) {
  const [editableValue, setEditableValue] = useState('');
  const [crete, setCrete] = useState(false);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);

  console.log(loading);
  useEffect(() => {
    if (editableValue) {
      setError('');
    }
  }, [editableValue]);

  const HandleSubmit = () => {
    setloading(true);
    if (!crete) {
      axios
        .post(`${base_url}login_attempt/`, {
          phone_number: editableValue,
        })
        .then(async response => {
          try {
            let token = response.data.data;

            await AsyncStorage.setItem('token', token);

            navigation.navigate('Otp', {number: editableValue});
            setloading(false);
          } catch {
            setloading(false);
            setError(response.data.message);
          }
        })
        .catch(error => {
          // console.log(error);
          setloading(false);
        });
    } else {
      axios
        .post(`${base_url}send_otp/`, {
          phone_number: editableValue,
          password: '123',
        })
        .then(async response => {
          console.log(response.data.access_token);
          try {
            let token = response.data.access_token;

            await AsyncStorage.setItem('token', token);

            navigation.navigate('Otp', {
              data: 'Create Account',
              number: editableValue,
            });
          } catch {
            setError(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  const CreatAccount = () => {
    setCrete(!crete);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            zIndex: 5,
            backgroundColor: 'rgba(73, 73, 73, 0.39)',
          }}>
          <Image
            source={require('../../src/loader/DoubleRing-1s-200px.gif')}
            style={{
              width: 80,
              height: 80,
            }}
          />
        </View>
      ) : null}
      <View style={styles.topsection}>
        <Image source={require('../../src/Assets/login-page.jpg')} />
      </View>
      <View style={styles.middlesection}>
        <Text style={styles.middtitle}>Login to your account</Text>
        <Text style={styles.subtitle}>Login with your phone number</Text>
        <View style={styles.middlebottom}>
          <View style={styles.flagimage}>
            <Image
              source={require('../../src/Assets/flag.png')}
              style={styles.flagimageimg}
            />
            <Logo width={20} height={15} marginTop={40} marginLeft={-25} />
          </View>
          <View style={styles.inputsection}>
            <TextInput
              value={editableValue}
              style={styles.input}
              placeholderTextColor="red"
              keyboardType="numeric"
              maxLength={10}
              onChangeText={setEditableValue}
            />
            <Call width={40} height={25} style={styles.callicone} />
            <Text style={styles.contrycode}>+91</Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          textAlign: 'right',
          color: 'red',
          fontSize: 16,
          marginRight: 25,
        }}>
        {error}
      </Text>
      <View style={styles.bottomsection}>
        <TouchableOpacity onPress={() => HandleSubmit()}>
          <View style={styles.button}>
            <Text style={styles.jointext}>
              {crete ? 'Create Account' : 'Join Now'}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.createsection}>
          <Text style={styles.leftside}>
            {crete ? 'Already have a account? ' : 'dont have a account? '}
          </Text>
          <TouchableOpacity onPress={() => CreatAccount()}>
            <Text style={styles.right}>
              {crete ? 'Join Now' : 'Creat Account'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topsection: {
    marginTop: 50,
    alignItems: 'center',
  },
  middlesection: {
    marginTop: 70,
  },
  middtitle: {
    fontSize: 34,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: 'grey',
  },
  middlebottom: {
    flexDirection: 'row',
  },
  flagimage: {
    flexDirection: 'row',
    width: 50,
  },
  flagimageimg: {
    width: 100,
  },

  inputsection: {
    width: '100%',
  },
  input: {
    width: '70%',
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7974B3',
    marginLeft: 50,
    marginTop: 20,
    paddingLeft: 100,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  callicone: {
    marginTop: -40,
    marginLeft: 65,
  },
  contrycode: {
    marginTop: -25,
    marginLeft: 110,

    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  bottomsection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#7974B3',
    height: 60,
    borderRadius: 10,
  },
  jointext: {
    textAlign: 'center',
    paddingTop: 15,

    fontSize: 18,
    color: '#fff',
  },
  createsection: {
    flexDirection: 'row',
    paddingHorizontal: 50,
    marginTop: 15,
  },
  leftside: {
    fontSize: 16,
    marginRight: 5,
    color: '#000',
  },
  right: {
    color: '#7974B3',
    fontSize: 15,
  },
});
