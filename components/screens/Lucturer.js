import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';

import axios from 'axios';
import {base_url} from '../../key';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Lucturer({
  navigation,
  value,
  parentId,
  refresh,
  data,
  progress,
}) {
  const [state, setstate] = useState([]);

  const [percentages, setPercentages] = useState({});
  const [mathId, setMathId] = useState(0);
  const [entrys, setentrys] = useState([]);

  const [entries, setEntries] = useState([]);

  const filteredItems = state.filter(item => {
    if (progress == 'completed') {
      return percentages[item.id] === 100;
    } else if (progress == 'ongoing') {
      return percentages[item.id] < 100;
    } else if (!progress) {
      return percentages[item.id] === 100 || percentages[item.id] < 100;
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!value) {
        axios
          .get(`${base_url}course/`)
          .then(response => {
            // console.log(response.data);
            setEntries(response.data.data);
          })
          .catch(error => {
            console.log(error);
          });

        let le = Math.floor(Math.random() * entries.length);

        setMathId(le);

        let token = await AsyncStorage.getItem('maintoken');

        axios
          .get(`${base_url}subject/${le}/`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            console.log('========', response.data.data, '=========New Response');
            setstate(response.data.data);
          });
      }
    };
    fetchData()
  }, [data, refresh]);

  const Response = async () => {
    let token = await AsyncStorage.getItem('maintoken');
    axios
      .get(`${base_url}subject/${value}/`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log(response.data.data, '787878787787887887878');
        setstate(response.data.data);
      });

    //
  };

  useEffect(() => {
    Response();
  }, [value, refresh, entries]);

  const HandleNavigate = item => {
    if (value) {
      navigation.navigate('Lessons', {
        videos: item.subjectvisevideo,
        idvalue: value,
        itemid: item.id,
      });
    } else {
      navigation.navigate('Lessons', {
        videos: item.subjectvisevideo,
        idvalue: mathId,
        itemid: item.id,
      });
    }
  };

  // Calculate Percentage
  useEffect(() => {
    const calculatePercentages = () => {
      const newPercentages = {};
      state.forEach(item => {
        const totalVideos = item.subjectvisevideo.length;
        const finishedVideos = item.subjectvisevideo.filter(
          video => video.is_finished,
        ).length;
        const percentage =
          totalVideos > 0 ? (finishedVideos / totalVideos) * 100 : 0;
        if (newPercentages[item.id] !== percentage) {
          newPercentages[item.id] = percentage;
        }
      });
      if (JSON.stringify(newPercentages) !== JSON.stringify(percentages)) {
        setPercentages(newPercentages);
      }
    };

    calculatePercentages();
  }, [state, percentages, refresh]);

  if (filteredItems.length > 0) {
    return filteredItems.map(item => {
      return (
        <TouchableOpacity onPress={() => HandleNavigate(item)} key={item.id}>
          <View style={styles.continer}>
            <View
              style={[styles.left, {backgroundColor: `${item.bagroundcolor}`}]}>
              <Image source={{uri: item.image}} style={styles.image} />
            </View>
            <View style={styles.middle}>
              <Text style={styles.title}>{item.subject}</Text>
              {percentages[item.id] == '100' ? (
                <Text style={styles.process}>Completed</Text>
              ) : (
                <Text style={styles.process}>Running...</Text>
              )}
            </View>
            <View style={styles.right}>
              <View style={styles.rightprogress}>
                <View
                  style={[
                    styles.progressbar,
                    {width: `${percentages[item.id] || 0}%`},
                    percentages[item.id] == '100'
                      ? {backgroundColor: 'green'}
                      : {backgroundColor: '#7974B3'},
                  ]}></View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  } else if (parentId) {
    console.log('Empty');
    return (
      <Text
        style={{
          color: '#7974B3',
          fontSize: 20,
          textAlign: 'center',
          marginTop: 20,
        }}>
        empty
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  continer: {
    backgroundColor: '#fff',
    marginVertical: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#7974B3',
    marginRight: 10,
  },
  middle: {
    width: 90,
  },
  right: {
    width: 200,
  },
  image: {
    width: 50,
    height: 50,
  },
  title: {
    marginTop: 5,
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  process: {
    marginTop: 10,
    color: '#7974B3',
    fontSize: 12,
    fontWeight: '500',
  },
  rightprogress: {
    marginTop: 30,
    backgroundColor: '#F5F7FB',
    width: '100%',
    height: 10,
    borderRadius: 5,
  },
  progressbar: {
    height: 10,
    borderRadius: 5,
  },
});
