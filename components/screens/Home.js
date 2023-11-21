import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import BellIcone from '../../src/Assets/notification.svg';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Cources from './Cources';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Lucturer from './Lucturer';
import axios from 'axios';
import {base_url} from '../../key';
import {BackHandler, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

export default function Home({navigation, route}) {
  // Restric Back
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

  const sliderWidth = 370;
  const itemWidth = 370;
  const [percentages, setPercentages] = useState({});
  const [entries, setEntries] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [name, setName] = useState('');

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

        if (response.data.data[0].name.length <= 0) {
          setName(response.data.data[0].user);
        } else {
          setName(response.data.data[0].name);
        }
      });
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
  }, [refresh]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await axios.get(`${base_url}course/`);
        const coursesData = coursesResponse.data.data;

        const updatedPercentages = {};

        for (const course of coursesData) {
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

          const subjectPercentages = subjectsData.map(subject => {
            const totalVideos = subject.subjectvisevideo.length;
            const finishedVideos = subject.subjectvisevideo.filter(
              video => video.is_finished,
            ).length;
            return totalVideos > 0 ? (finishedVideos / totalVideos) * 100 : 0;
          });

          const coursePercentage =
            subjectPercentages.length > 0
              ? subjectPercentages.reduce(
                  (sum, percentage) => sum + percentage,
                  0,
                ) / subjectPercentages.length
              : 0;

          updatedPercentages[course.id] = coursePercentage;
        }

        setPercentages(updatedPercentages);

        console.log('Updated Percentages:', updatedPercentages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [refresh]);

  const HandleChangePage = id => {
    navigation.navigate('HomeTabs', {
      screen: 'TodaysLucturer',
      params: {
        screen: {
          Lucturer: {idvalues: id},
          Ongoing: {idvalues: id},
          Completed: {idvalues: id},
        },
      },
    });
  };

  const carouselRef = useRef(null);
  //
  const renderItem = ({item, index}) => {
    return (
      <View style={[styles.slide, {backgroundColor: `${item.bagroundcolor}`}]}>
        <View style={styles.leftside}>
          {percentages[item.id] == '100' ? (
            <Text style={styles.title}>completed</Text>
          ) : (
            <Text style={styles.title}>ongoing</Text>
          )}
          <Text style={[styles.title, {fontWeight: '600', fontSize: 20}]}>
            {item.name}
          </Text>
          <View style={styles.progress}>
            <View style={[styles.progress, {flexDirection: 'row'}]}>
              <Text style={styles.title}>
                {Math.floor(percentages[item.id])}%
              </Text>
              <View style={styles.progressbar}>
                <View
                  style={[
                    styles.innerprogressbar,
                    {width: `${percentages[item.id] || 0}%`},
                  ]}></View>
              </View>
            </View>

            <View style={styles.bottom}>
              <TouchableOpacity onPress={() => HandleChangePage(item.id)}>
                <Text
                  style={[
                    styles.title,
                    {
                      backgroundColor: '#8689f2',
                      width: 110,
                      fontSize: 12,
                      fontWeight: '500',
                      textAlign: 'center',
                      height: 40,
                      borderRadius: 25,
                      paddingTop: 10,
                    },
                  ]}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.rightside}>
          <Image source={{uri: item.image}} style={styles.rightimage} />
        </View>
      </View>
    );
  };
  const renderPagination = (entries, activeSlide) => {
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: '#fff',
          alignSelf: 'center',
        }}
        dotStyle={{
          width: 30,
          height: 10,
          borderRadius: 5,
          marginHorizontal: -10,
          backgroundColor: '#7974B3',
        }}
        inactiveDotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: '#7974B3',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  const [refresh, setRefresh] = useState(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.heddersection}>
        <View style={styles.hedderleftside}>
          <View style={styles.profileimagesection}>
            <Image
              source={require('../../src/Assets/person.jpg')}
              style={styles.profileimage}
            />
          </View>
          <View style={styles.namesection}>
            <Text style={styles.name}>{name}</Text>
            {/* <Text style={styles.small}>Home</Text> */}
          </View>
        </View>
        <View style={styles.heddrightsection}>
          <BellIcone />
        </View>
      </View>
      {/* Horizontal Scroll Section */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#fff'}}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => Refresh()} />
        }>
        <Carousel
          ref={carouselRef}
          layout={'default'}
          data={entries}
          autoplay={true}
          loop={true}
          enableSnap={true}
          autoplayInterval={3000}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onSnapToItem={index => setActiveSlide(index)}
        />

        {renderPagination(entries, activeSlide)}

        <Cources data={entries} navigation={navigation} refresh={refresh} />

        <Lucturer navigation={navigation} data={'hellow'} refresh={refresh} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Top Section
  container: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    flex: 1,
  },
  heddersection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  hedderleftside: {
    width: '50%',
    flexDirection: 'row',
  },
  profileimagesection: {},
  profileimage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  namesection: {
    marginLeft: 20,
    paddingTop: 10,
  },
  name: {
    color: '#000',
    fontSize: 18,
  },
  small: {
    color: 'grey',
    fontSize: 14,
  },
  heddrightsection: {
    marginTop: 15,
  },
  bellicone: {},
  //   Scroll Section

  slide: {
    marginTop: 40,
    backgroundColor: '#7974B3',
    width: '100%',
    height: 180,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 14,
    color: '#fff',
  },
  progress: {
    marginTop: 5,
    width: 100,
  },
  progressbar: {
    width: '100%',
    height: 10,
    backgroundColor: '#8689f2',
    borderRadius: 5,
    marginLeft: 10,
    marginTop: 5,
  },
  innerprogressbar: {
    borderRadius: 5,
    height: 10,
    backgroundColor: '#fff',

    width: '50%',
  },
  bottom: {
    marginTop: 20,
  },
  leftside: {
    width: '60%',
  },
  rightside: {},
  rightimage: {
    width: 130,
    height: 130,
  },
});
