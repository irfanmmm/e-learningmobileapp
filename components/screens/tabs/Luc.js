import {View, Text, ScrollView, RefreshControl} from 'react-native';
import React, {useState, useEffect} from 'react';
import Lucturer from '../Lucturer';

import axios from 'axios';
import {base_url} from '../../../key';
import {useRoute} from '@react-navigation/native';

export default function Luc({navigation, route}) {
  const idvalues = route.params?.idvalues;
  console.log('Received idvalues in Luc:', idvalues);

  const [entries, setEntries] = useState([]);

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
  }, []);

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!idvalues) {
      setRefresh(true);

      setInterval(() => {
        setRefresh(false);
      }, 4000);
    }
  }, []);

  const Refresh = () => {
    setRefresh(true);

    setInterval(() => {
      setRefresh(false);
    }, 4000);
  };

  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={() => Refresh()} />
      }>
      {idvalues ? (
        <Lucturer
          navigation={navigation}
          value={idvalues}
          parentId={entries}
          refresh={refresh}
          
        />
      ) : (
        <Lucturer navigation={navigation} refresh={refresh} parentId={entries}/>
      )}
    </ScrollView>
  );
}
