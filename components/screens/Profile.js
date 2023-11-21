import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Doc from '../../src/Assets/information.svg';
import Payment from '../../src/Assets/payment-history.svg';
import RightArrow from '../../src/Assets/back-arrow.svg';
import {base_url} from '../../key';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BackHandler, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

export default function Profile({navigation}) {
  const [name, setName] = useState('');
  const [percentages, setPercentages] = useState({});
  const [entries, setEntries] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]);

        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  const HandleLogout = async () => {
    await AsyncStorage.removeItem('maintoken');
    navigation.navigate('PhoneOtpSample');
  };

  const getUserName = async () => {
    let token = await AsyncStorage.getItem('maintoken');
    axios
      .get(`${base_url}api/auth/get_user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log(response.data);

        setName(response.data.data[0]);
      });
  };

  useEffect(() => {
    setRefresh(true);

    setInterval(() => {
      setRefresh(false);
    }, 5000);
  }, []);

  const Refresh = () => {
    setRefresh(true);

    setInterval(() => {
      setRefresh(false);
    }, 4000);
  };

  useEffect(() => {
    axios
      .get(`${base_url}course/`)
      .then(response => {
        console.log(response.data);

        setEntries(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
    getUserName();
  }, []);

  // ...

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await axios.get(`${base_url}course/`);
        const coursesData = coursesResponse.data.data;

        // Initialize an object to store subject percentages for each course
        const updatedPercentages = {};

        for (const course of coursesData) {
          // Fetch subjects for each course
          let token = await AsyncStorage.getItem('maintoken');
          const subjectsResponse = await axios.get(
            `${base_url}subject/${course.id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const subjectsData = subjectsResponse.data.data;

          // Calculate completion percentage for each subject
          const subjectPercentages = subjectsData.map(subject => {
            const totalVideos = subject.subjectvisevideo.length;
            const finishedVideos = subject.subjectvisevideo.filter(
              video => video.is_finished,
            ).length;
            return totalVideos > 0 ? (finishedVideos / totalVideos) * 100 : 0;
          });

          // Calculate the average completion percentage for the course
          const coursePercentage =
            subjectPercentages.length > 0
              ? subjectPercentages.reduce(
                  (sum, percentage) => sum + percentage,
                  0,
                ) / subjectPercentages.length
              : 0;

          // Store the course percentage in the updatedPercentages object
          updatedPercentages[course.id] = coursePercentage;
        }

        // Update the entire percentages object
        setPercentages(updatedPercentages);

        console.log('Updated Percentages:', updatedPercentages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [refresh]);

  return (
    <ScrollView
      style={styles.continer}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={() => Refresh()} />
      }>
      {/* Top Section */}
      <View style={styles.topsection}>
        <Image
          source={require('../../src/Assets/person.jpg')}
          style={styles.profile}
        />
        <Text style={styles.name}>{name.name}</Text>
        <Text style={styles.email}>+91 {name.user}</Text>
      </View>
      {/* Horizontal Scroll Section */}
      <View>
        <Text
          style={[
            styles.email,
            {paddingLeft: 20, fontSize: 20, fontWeight: '600'},
          ]}>
          Course You're Taking
        </Text>
        <ScrollView horizontal style={styles.list}>
          {entries.map(item => (
            <View
              style={[styles.item, {backgroundColor: `${item.bagroundcolor}`}]}>
              <Text style={styles.top}>{item.name}</Text>
              <Text style={styles.middle}>18 Hour Spend</Text>
              <View style={styles.bottom}>
                <Text style={styles.percentage}>
                  {Math.floor(percentages[item.id])}%
                </Text>
                <View style={styles.progressbag}>
                  <View
                    style={[
                      styles.progress,
                      {width: `${percentages[item.id] || 0}%`},
                    ]}></View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* Bottom Section */}
      <Text
        style={[
          styles.email,
          {paddingLeft: 20, fontSize: 20, fontWeight: '600'},
        ]}>
        Account
      </Text>
      <View style={styles.bottomsection}>
        <View style={styles.listofinformation}>
          <View>
            <Doc />
          </View>
          <View>
            <Text style={styles.email}>Educational Information</Text>
          </View>
          <View>
            <RightArrow />
          </View>
        </View>
        <View style={styles.listofinformation}>
          <View>
            <Doc />
          </View>
          <View>
            <Text style={styles.email}>Educational Information</Text>
          </View>
          <View>
            <RightArrow />
          </View>
        </View>
        <View style={styles.listofinformation}>
          <View>
            <Doc />
          </View>
          <View>
            <Text style={styles.email}>Educational Information</Text>
          </View>
          <View>
            <RightArrow />
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => HandleLogout()}>
        <Text style={{textAlign: 'center', fontSize: 16, color: 'grey'}}>
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topsection: {
    marginVertical: 50,
    height: 200,
    alignItems: 'center',
  },
  profile: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
  },
  name: {
    fontSize: 34,
    color: '#000',
  },
  email: {
    fontSize: 18,

    color: 'grey',
  },

  list: {
    marginTop: 20,
    paddingLeft: 20,
    height: 130,
    marginBottom: 20,
  },
  item: {
    width: 200,
    height: 130,
    backgroundColor: 'red',
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
  },
  top: {
    fontSize: 20,
    color: '#fff',
  },
  middle: {
    fontSize: 12,
    color: '#fff',
  },
  bottom: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 16,
    color: '#fff',
  },
  progressbag: {
    width: '80%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8689f2',
  },
  progress: {
    width: '10%',
    height: 10,
    borderRadius: 5,

    backgroundColor: '#fff',
  },
  bottomsection: {
    marginTop: 30,
  },
  listofinformation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    height: 60,
    marginHorizontal: 20,
    borderRadius: 10,
  },
});
