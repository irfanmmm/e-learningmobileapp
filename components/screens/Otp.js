import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {base_url} from '../../key';

const CELL_COUNT = 4;

console.log;
export default function Otp({navigation, route}) {
  const [count, setCount] = useState(30);
  const [senotp, setSenotp] = useState(false);
  const [error, setError] = useState('');

  const [loading, setloading] = useState(false);

  console.log(error);

  useEffect(() => {
    setCount(30);
    const interval = setInterval(() => {
      setCount(prevCount => {
        if (prevCount == 0) {
          clearInterval(interval);
          return prevCount;
        }
        return prevCount - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [senotp]);

  if (route.params) {
    var {data} = route.params;
    var {number} = route.params;
  }

  const [value, setValue] = useState('');

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (value) {
      setError('');
    }
  }, [value]);

  const HandleSubmit = async () => {
    setloading(true);
    let token = await AsyncStorage.getItem('token');

    axios
      .post(
        `${base_url}verify_otp/`,
        {
          otp: value,
          phone_number: number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(async response => {
        try {
          let maintoken = response.data.access_token;

          console.log(maintoken);

          await AsyncStorage.setItem('maintoken', maintoken);

          data
            ? navigation.navigate('Name')
            : navigation.navigate('HomeTabs', {screen: 'Home'});
          setloading(false);
        } catch {
          setError(response.data.message);
          setloading(false);
        }
      });
  };

  const SendOtp = () => {
    setSenotp(!senotp);
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
        <Image
          source={require('../../src/Assets/otp-page.jpg')}
          style={styles.image}
        />
      </View>
      <View style={styles.middlesection}>
        <TouchableOpacity onPress={() => HandleSubmit()}>
          <Text style={styles.maintitle}>Verity OTP</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.smalldiscription}>
            Please enter the 4 digit verification code that is send to you at{' '}
            <Text
              style={[
                styles.smalldiscription,
                {color: '#7974B3', fontWeight: '600'},
              ]}>
              +91 {number}
            </Text>
          </Text>
        </View>
      </View>
      <View style={styless.root}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styless.cell, isFocused && styless.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
      <View style={styles.parentofcoundown}>
        <Text style={styles.coundownsec}>Don't recived code? </Text>

        <Text style={[styles.coundownsec, {color: '#7974B3'}]}>
          {count === 0 ? (
            <TouchableOpacity onPress={() => SendOtp()}>
              <Text>Send Otp</Text>
            </TouchableOpacity>
          ) : (
            `${count}Sec`
          )}
        </Text>
      </View>
      <Text
        style={{
          alignSelf: 'flex-end',
          marginRight: 20,
          marginBottom: 20,
          marginTop: -20,
          color: 'red',
          fontSize: 16,
        }}>
        {error}
      </Text>
      <View style={styles.bottomsection}>
        <TouchableOpacity onPress={() => HandleSubmit()}>
          <Text style={styles.button}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  topsection: {
    marginTop: 100,
    marginBottom: 50,
  },
  image: {},
  middlesection: {
    paddingHorizontal: 20,
  },

  maintitle: {
    textAlign: 'center',
    fontSize: 30,
    color: '#000',
  },
  smalldiscription: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 25,
    marginTop: 15,
    color: '#000',
  },
  bottomsection: {
    paddingHorizontal: 20,
    width: '100%',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#7974B3',
    fontSize: 18,
    borderRadius: 5,
    textAlign: 'center',
    paddingTop: 10,
    color: '#fff',
  },
  parentofcoundown: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '90%',
    marginBottom: 40,
  },
  coundownsec: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});

const styless = StyleSheet.create({
  root: {padding: 10},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 70,
    height: 75,
    borderRadius: 10,
    paddingTop: 8,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1,
    marginHorizontal: 15,
    marginTop: 20,
    borderColor: '#00000030',
    textAlign: 'center',
    color:'#000'
  },
  focusCell: {
    borderColor: '#000',
  },
});
