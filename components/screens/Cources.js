import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Play from '../../src/Assets/white-play-button.svg';

export default function Cources({data, navigation}) {
  const HandlePress = id => {
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
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Course</Text>

      <View style={styles.firstrow}>
        {data.map(item => (
          <TouchableOpacity
            onPress={() => HandlePress(item.id)}
            style={[styles.item, {backgroundColor: `${item.bagroundcolor}`}]}>
            <View>
              <View>
                <Text style={styles.itemtitle}>{item.name}</Text>
                <View style={styles.itemmiddlesection}>
                  <View style={styles.left}>
                    <Text style={styles.leftname}>
                      {item.video_count} Classes
                    </Text>
                    <View style={styles.leftplay}>
                      <Play width={40} height={25} />
                    </View>
                  </View>
                  <Image source={{uri: item.image}} style={styles.right} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    color: 'grey',
    fontWeight: '600',
  },
  firstrow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '47.84%',
    height: 150,
    margin: 4,
    backgroundColor: '#7974B3',
    borderRadius: 10,
  },

  itemtitle: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
    color: '#fff',
    fontWeight: '500',
  },
  itemmiddlesection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  left: {},
  leftname: {
    color: '#fff',
    marginBottom: 20,
  },
  leftplay: {
    backgroundColor: '#8cadff',
    width: 40,
    height: 40,
    borderRadius: 10,
    paddingTop: 8,
  },
  right: {
    width: 80,
    height: 80,
  },
});
