import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Vide from './Vide';
import Tick from '../../src/Assets/compleated.svg';
import PlayIcone from '../../src/Assets/play.svg';
import Lock from '../../src/Assets/lock.svg';
import axios from 'axios';
import {base_url} from '../../key';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Lessons({navigation, route, value}) {
  const [dataFromChild, setDataFromChild] = useState(true);
  const [state, setstate] = useState({});
  const [values, setValues] = useState([]);
  const [urls, setUrls] = useState();
  const [completed, setCompleted] = useState(0);
  const [videotitle, setvideotitle] = useState();
  const [trigger, setTrigger] = useState(null);
  const [loder, setloder] = useState(false);

  console.log(loder, 'loading.....');
  if (!route || !route.params) {
    return null;
  }
  const {videos} = route.params;
  const {idvalue} = route.params;
  const {itemid} = route.params;

  setTimeout(() => {
    setTrigger('hellow');
  }, 1000);

  // INITIOAL PLAY
  useEffect(() => {
    // console.log('Effect with empty dependency array is running');
    const InitioalPlay = () => {
      // console.log('InitioalPlay called');
      // console.log('Values Length:', values.length);

      if (values.length > 0) {
        const filteredData = values.filter(item => item.is_finished === false);

        if (filteredData.length > 0) {
          // console.log('Setting URL:', filteredData[0].video);
          setvideotitle(filteredData[0].title);
          setUrls(filteredData[0].video);
          setstate({
            id: filteredData[0].id,
            boolian: true,
          });
        } else {
          // console.log('Setting URL:', values[0].video);
          setvideotitle(values[0].title);
          setUrls(values[0].video);
          setstate({
            id: values[0].id,
            boolian: true,
          });
        }
      } else {
        // console.log('No values found.');
      }
    };

    InitioalPlay();
  }, [trigger]);

  const handelePlay = id => {
    console.log(id);
    setstate(prevState => ({
      ...prevState,
      id: id,
      boolian: true,
    }));
  };

  const Response = async () => {
    try {
      let token = await AsyncStorage.getItem('maintoken');
      const response = await axios.get(`${base_url}subject/${idvalue}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredItem = response.data.data.find(item => item.id === itemid);

      if (filteredItem) {
        setValues(filteredItem.subjectvisevideo);
      }
    } catch (error) {
      // console.error('Error fetching response:', error);
    }
  };

  useEffect(() => {
    const runEffects = async () => {
      await Response();
      InitioalPlay();
    };

    runEffects();
  }, [completed]);

  const MarksAscompleted = async () => {
    setloder(true);
    try {
      let token = await AsyncStorage.getItem('maintoken');

      const response = await axios.post(
        `${base_url}finished/${completed}/`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      setstate(prevState => ({
        id: prevState.id + 1,
        boolian: true,
      }));
      setCompleted(response.data.id);
      setloder(false);
    } catch (error) {
      console.error('Error marking as completed:', error);
      setloder(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filteredData = values.filter(item => item.id === state.id);

        if (filteredData.length > 0) {
          setUrls(filteredData[0].video);
          setCompleted(filteredData[0].id);
        } else {
          // console.log('No matching item found.');
        }
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [state.id, values]);

  const handleDataFromChild = data => {
    setDataFromChild(data);
    if (data && data.manualClick) {
      // Automatically move to the next video when the current one is completed
      setstate(prevState => ({
        id: prevState.id + 1,
        boolian: true,
      }));
    }
  };

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <Vide onDataSend={handleDataFromChild} urls={urls} />

      {dataFromChild ? (
        <View style={styles.container}>
          <View style={styles.titlesection}>
            <View style={styles.left}>
              <Text style={styles.title}>{videotitle}</Text>
            </View>
            <TouchableOpacity onPress={() => MarksAscompleted()}>
              <View style={styles.right}>
                {loder ? (
                  <>
                    <View
                      style={{
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 35, height: 35}}
                        source={require('../../src/loader/lourglass.gif')}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.lefttickmark}>
                      <Tick width={20} height={20} />
                    </View>
                    <View style={styles.rightmarks}>
                      <Text style={styles.marks}>Marks as Complted</Text>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Contents */}
          <ScrollView>
            {values.map(data =>
              data.is_finished ? (
                <TouchableOpacity
                  onPress={() => {
                    handelePlay(data.id);
                    setUrls(data.video);
                    setvideotitle(data.title);
                    setCompleted(data.id);
                    setDataFromChild({manualClick: true});
                  }}>
                  <View
                    style={[
                      styles.topicsection,
                      state.id == data.id && state.boolian == true
                        ? {backgroundColor: '#7974B3'}
                        : {backgroundColor: '#fff'},
                    ]}>
                    <View style={styles.lefttopic}>
                      <View style={styles.leftcontainer}>
                        <Tick width={20} height={20} />
                        <Text
                          style={[
                            styles.name,
                            state.id == data.id && state.boolian == true
                              ? {color: '#fff'}
                              : {color: '#000'},
                          ]}>
                          {data.title}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rightcontainer}>
                      <Text
                        style={[
                          styles.timestamp,
                          state.id == data.id && state.boolian == true
                            ? {color: '#fff'}
                            : {color: '#000'},
                        ]}>
                        {data.timestamp}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null,
            )}
            {values.map(data =>
              data.is_finished == false ? (
                <TouchableOpacity
                  onPress={() => {
                    handelePlay(data.id);
                    setCompleted(data.id);
                    setUrls(data.video);
                    setvideotitle(data.title);
                    setDataFromChild({manualClick: true});
                  }}>
                  {console.log(
                    data.is_finished,
                    '???????????????????????????????',
                  )}
                  <View
                    style={[
                      styles.topicsection,
                      state.id == data.id && state.boolian == true
                        ? {backgroundColor: '#7974B3'}
                        : {backgroundColor: '#fff'},
                    ]}>
                    <View style={styles.lefttopic}>
                      <View style={styles.leftcontainer}>
                        {state.id == data.id && state.boolian == true ? (
                          <PlayIcone width={20} height={20} />
                        ) : (
                          <Lock width={20} height={20} />
                        )}
                        <Text
                          style={[
                            styles.name,
                            state.id == data.id && state.boolian == true
                              ? {color: '#fff'}
                              : {color: '#000'},
                          ]}>
                          {data.title}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rightcontainer}>
                      <Text
                        style={[
                          styles.timestamp,
                          state.id == data.id && state.boolian == true
                            ? {color: '#fff'}
                            : {color: '#000'},
                        ]}>
                        {data.timestamp}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null,
            )}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingHorizontal: 20,
    height: '72%',
    backgroundColor: '#fff',
  },
  titlesection: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
  },
  left: {
    width: '60%',
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontWeight: '500',
  },
  small: {
    color: 'grey',
    fontSize: 16,
  },
  right: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#7974B3',
    width: 150,
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lefttickmark: {},
  rightmarks: {},
  marks: {
    color: '#7974B3',
    fontSize: 12,
    fontWeight: '400',
  },
  topicsection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    height: 50,
  },
  lefttopic: {},
  leftcontainer: {
    flexDirection: 'row',
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 10,
  },
  rightcontainer: {},
  timestamp: {
    color: '#fff',
    fontSize: 16,
  },
});
