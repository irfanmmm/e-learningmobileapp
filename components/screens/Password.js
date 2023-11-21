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
import LockIcone from '../../src/Assets/password-lock.svg';
import Isimpel from '../../src/Assets/dont-view.svg';

export default function Password({navigation}) {
  const [password, setPassword] = useState('');
  const [lowercasecheck, setLowercasecheck] = useState(false);
  const [uppercaseCheck, setuppercaseCheck] = useState(false);
  const [simbelscheck, setSimbelscheck] = useState(false);
  const [count, setCount] = useState(false);
  const [numbers, setnumbers] = useState(false);
  const [loading, setloading] = useState(false);
  const [visible, setvisible] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(70);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardHeight(30);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(70);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const lovercase = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  const upper = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  const no = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const simbel = [
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '-',
    '_',
    '~',
    '?',
    ';',
    ':',
  ];
  console.log(password);

  useEffect(() => {
    if (password.length >= 8) {
      setCount(true);
      console.log('hellow');
    }
    lovercase.map(data => {
      if (password.includes(data)) {
        setLowercasecheck(true);
        console.log('Lovercase Included');
      }
    });
    upper.map(data => {
      if (password.includes(data)) {
        setuppercaseCheck(true);
        console.log('Upper Included');
      }
    });
    no.map(data => {
      if (password.includes(data)) {
        setnumbers(true);
        console.log('Numbers Included');
      }
    });
    simbel.map(data => {
      if (password.includes(data)) {
        setSimbelscheck(true);
        console.log('Simpel Included');
      }
    });
  }, [password]);

  const HandelSubmit = () => {
    setloading(true);
    if (lowercasecheck && uppercaseCheck && simbelscheck && count && numbers) {
      navigation.navigate('HomeTabs', {screen: 'Home'});
      setloading(false);
    }
  };

  const topsection = {
    marginTop: 150,
    marginBottom: keyboardHeight,
  };

  const Conditions = (data, condition) => {
    return (
      <View style={styles.errorsection}>
        <View style={styles.eachconditionlist}>
          <View
            style={[
              styles.leftcirclecontainer,
              condition ? {borderColor: '#7974B3'} : {borderColor: 'grey'},
            ]}>
            {condition ? (
              <View
                style={[
                  styles.circlechiled,
                  condition && {backgroundColor: '#7974B3'},
                ]}></View>
            ) : null}
          </View>
          <Text
            style={[
              styles.condition,
              condition ? {color: '#7974B3'} : {color: 'grey'},
            ]}>
            {data}
          </Text>
        </View>
      </View>
    );
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
        <Image source={require('../../src/Assets/password-page.jpg')} />
      </View>
      <View style={styles.titlesection}>
        <Text style={styles.title}>Set a Strong Password</Text>
        <Text style={styles.discription}>
          Set a Strong password for your account
        </Text>
      </View>
      <View style={styles.inputsection}>
        <TextInput
          textContentType="password"
          placeholder="Enter Your Password"
          style={styles.inputfield}
          onChangeText={setPassword}
          secureTextEntry={visible}
        />
        <View style={styles.locandi}>
          <LockIcone width={40} height={25} />
          <TouchableOpacity onPress={() => setvisible(!visible)}>
            <Isimpel width={40} height={25} />
          </TouchableOpacity>
        </View>
      </View>
      {Conditions('Shuld Contain at Least 8 Charecters', count)}
      {Conditions(
        'Shuld Containe a Lowercase (samall) letter (a-z)',
        lowercasecheck,
      )}
      {Conditions(
        'Shuld Containe a Upper (Capital) letter (A-Z)',
        uppercaseCheck,
      )}
      {Conditions('Shuld Containe at least on number (0-9)', numbers)}
      {Conditions(
        'Shuld Containe at least on number (!,@,#,$,%,^,&)',
        simbelscheck,
      )}
      <View style={styles.bottomsection}>
        <TouchableOpacity onPress={() => HandelSubmit()}>
          <Text style={styles.button}>Submit</Text>
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
  topsection: {
    marginTop: 150,
    marginBottom: 70,
  },
  titlesection: {},
  title: {
    textAlign: 'center',
    fontSize: 30,
    color: '#000',
  },
  discription: {
    textAlign: 'center',
    fontSize: 16,
    color: '#A6A5A5',
    marginTop: 10,
    marginBottom: 20,
  },
  inputsection: {
    height: 60,
    width: '100%',
    paddingHorizontal: 20,
  },
  inputfield: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#A6A5A5',
    borderRadius: 10,
    color: '#000',
  },
  locandi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -40,
    marginBottom: 15,
  },
  errorsection: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  eachconditionlist: {
    flexDirection: 'row',
  },
  leftcirclecontainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  circlechiled: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#7974B3',
  },
  condition: {
    color: '#7974B3',
    fontSize: 16,
  },
  bottomsection: {
    justifyContent: 'flex-end',
    height: '10%',
    width: '100%',
    paddingHorizontal: 20,
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
});
