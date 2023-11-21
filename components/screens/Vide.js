import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';

export default function Vide({onDataSend, urls}) {
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [pused, setPused] = useState(false);
  const [progress, setProgress] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [mut, setMut] = useState(false);

  console.log(urls);

  const ref = useRef();

  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TouchableOpacity
        style={{width: '100%', height: fullscreen ? '100%' : 230}}
        onPress={() => {
          loading == false && setClicked(true);
          setTimeout(() => {
            setClicked(false);
          }, 5000);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: loading == false ? 0 : '100%',
            height: loading == false ? 0 : fullscreen ? '100%' : 230,
          }}>
          {loading ? (
            <Image
              source={require('../../src/loader/DoubleRing-1s-200px.gif')}
              style={{width: 80, height: 80}}
            />
          ) : null}
        </View>
        <Video
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          paused={pused}
          ref={ref}
          onProgress={x => {
            console.log(x);
            setProgress(x);
          }}
          source={{
            uri: urls,
          }}
          muted={mut}
          style={{width: '100%', height: fullscreen ? '100%' : 230}}
          resizeMode="contain"
        />
        {clicked == true ? (
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  ref.current.seek(parseInt(progress.currentTime) - 10);
                }}>
                {!fullscreen?(<Image
                  source={require('../../src/rewind.png')}
                  style={{width: 30, height: 30, tintColor: 'white'}}
                />):(
                  <Image
                  source={require('../../src/rewind.png')}
                  style={{width: 40, height: 40, tintColor: 'white'}}
                />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPused(!pused)}>
                {!fullscreen?(<Image
                  source={
                    pused
                      ? require('../../src/play-button.png')
                      : require('../../src/pause.png')
                  }
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: 'white',
                    marginHorizontal: 80,
                  }}
                />):(
                  <Image
                  source={
                    pused
                      ? require('../../src/play-button.png')
                      : require('../../src/pause.png')
                  }
                  style={{
                    width: 40,
                    height: 40,
                    tintColor: 'white',
                    marginHorizontal: 80,
                  }}
                />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  ref.current.seek(parseInt(progress.currentTime) + 10);
                }}>
                {!fullscreen?(<Image
                  source={require('../../src/forward-10s.png')}
                  style={{width: 30, height: 30, tintColor: 'white'}}
                />):(
                  <Image
                  source={require('../../src/forward-10s.png')}
                  style={{width: 40, height: 40, tintColor: 'white'}}
                />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'absolute',
                alignItems: 'center',
                bottom: 10,
                paddingHorizontal: 20,
              }}>
              <Text style={{color: '#fff'}}>
                {format(progress.currentTime)}
              </Text>
              {/* Slider */}
              <Slider
                style={{width: '80%', height: 40}}
                value={progress.currentTime}
                minimumValue={0}
                maximumValue={progress.seekableDuration}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                onValueChange={x => {
                  ref.current.seek(x);
                }}
              />
              <Text style={{color: '#fff'}}>
                {format(progress.seekableDuration)}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'absolute',
                alignItems: 'center',
                top: 10,
                paddingHorizontal: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (fullscreen) {
                    onDataSend(true);
                    Orientation.lockToPortrait();
                  } else {
                    onDataSend(false);
                    Orientation.lockToLandscape();
                  }
                  setFullscreen(!fullscreen);
                }}>
                <Image
                  source={
                    fullscreen
                      ? require('../../src/expand.png')
                      : require('../../src/fullscreen.png')
                  }
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setMut(!mut);
                }}>
                <Image
                  source={
                    mut
                      ? require('../../src/volume.png')
                      : require('../../src/speaker.png')
                  }
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}
