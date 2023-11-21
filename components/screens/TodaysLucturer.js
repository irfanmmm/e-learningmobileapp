import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Back from '../../src/Assets/back-arrow.svg';
import Lucturer from './Lucturer';
import Luc from './tabs/Luc';
import Ongoing from './tabs/Ongoing';
import Completed from './tabs/Completed';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useRoute, useNavigation} from '@react-navigation/native';
import {BackHandler, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

export default function TodaysLucturer() {
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

  const TopTabs = createMaterialTopTabNavigator();

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Received route.params:', route.params);

    const {screen} = route.params || {};

    if (screen) {
      const lucturerId = screen.Lucturer?.idvalues;
      console.log('Received idvalues in Lucturer:', lucturerId);

      const ongoingId = screen.Ongoing?.idvalues;
      console.log('Received idvalues in Ongoing:', ongoingId);

      const completedId = screen.Completed?.idvalues;
      console.log('Received idvalues in Completed:', completedId);

      navigation.navigate('Lucturer', {idvalues: lucturerId});
      navigation.navigate('Ongoing', {idvalues: ongoingId});
      navigation.navigate('Completed', {idvalues: completedId});
    }
  }, [route.params, navigation]);

  return (
    <View style={styles.continer}>
      <View style={styles.topsection}>
        <Text style={styles.title}>Today's lucturer</Text>
      </View>

      <TopTabs.Navigator
        initialRouteName="Lucturer"
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 16,
            marginTop: 20,
            textTransform: 'capitalize',
          },
          tabBarPressColor: 'transparent',
          tabBarIndicatorStyle: {
            backgroundColor: '#7974B3',
            height: 3,
            borderRadius: 3 / 2,
          },
        }}>
        <TopTabs.Screen name="Lucturer" component={Luc} />
        <TopTabs.Screen name="Ongoing" component={Ongoing} />
        <TopTabs.Screen name="Completed" component={Completed} />
      </TopTabs.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  continer: {
    backgroundColor: '#fff',
    flex: 1,
    height: 200,
    paddingHorizontal: 20,
  },
  topsection: {
    marginTop: 20,

    flexDirection: 'row',
    width: '100%',
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    color: 'grey',
    width: '100%',
  },
  leftarrow: {},
  tabs: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 10,
  },
  tab: {
    fontWeight: '500',
    fontSize: 18,
    color: 'grey',
    textAlign: 'center',
  },
  tabparent: {
    width: 'auto',
    paddingHorizontal: 5,
  },
});
