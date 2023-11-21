import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HumanSimpel from '../../src/Assets/profile.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {base_url} from '../../key';

export default function Name({navigation}) {
  const [name, setName] = useState('');
  const [loading, setloading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(80);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardHeight(0);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(80);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const HandleSubmit = async () => {
    setloading(true);
    let token = await AsyncStorage.getItem('maintoken');

    axios
      .post(
        `${base_url}api/auth/create/`,
        {
          password: '123',
          name: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(async response => {
        try {
          let maintoken = response.data;

          console.log(maintoken);

          navigation.navigate('Password');
          setloading(false);
        } catch {
          setError(response.data.message);
          setloading(false);
        }
      });
  };

  const topsection = {
    marginTop: 100,
    marginBottom: keyboardHeight,
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
      <View style={topsection}>
        <Image
          style={styles.image}
          source={require('../../src/Assets/name-page.jpg')}
        />
      </View>
      <View style={styles.textsection}>
        <Text style={styles.title}>Enter Your name</Text>
        <Text style={styles.smalldis}>
          Enter your full name for your account
        </Text>
      </View>

      <View style={styles.inputsection}>
        <TextInput
          placeholder="Enter Your Name"
          placeholderTextColor={'grey'}
          style={styles.input}
          onChangeText={setName}
        />
        <HumanSimpel width={40} height={25} style={styles.humen} />
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity onPress={() => HandleSubmit()}>
          <Text style={styles.submitbutton}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  image: {},
  textsection: {},
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: '#000',
    fontWeight: '500',
  },
  smalldis: {
    marginTop: 10,
    fontSize: 18,
    textAlign: 'center',
    color: 'grey',
  },
  inputsection: {
    paddingHorizontal: 20,
    width: '100%',
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#A6A5A5',
    borderRadius: 10,
    paddingHorizontal: 60,
    fontSize: 20,
    color: '#000',
  },
  humen: {
    marginTop: -42,
    marginBottom: 30,
    marginLeft: 10,
  },
  bottom: {
    justifyContent: 'flex-end',
    height: 50,
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 200,
  },
  submitbutton: {
    width: '100%',
    height: 50,
    backgroundColor: '#7974B3',
    fontSize: 18,
    borderRadius: 5,
    textAlign: 'center',
    paddingTop: 10,
    color: '#fff',
  },
});
