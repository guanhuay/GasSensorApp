import React from 'react';
// import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import database from '@react-native-firebase/database';
import {useAsyncStorage} from '~/utils';

const MAX_POINTS = 5000;

const GaugeMeterScreen = ({route}) => {
  const {
    params: {deviceId},
  } = route;
  const [points, setPoints] = React.useState(0);
  const {getItem} = useAsyncStorage('userToken');
  const fill = (points / MAX_POINTS) * 100;

  React.useEffect(() => {
    const callDatabase = async () => {
      const userId = await getItem();
      await database()
        .ref(`${userId}/${deviceId}`)
        .on('value', function(snapshot) {
          const value = snapshot.val();
          if (value) {
            setPoints(value.PPM);
          }
        });
    };
    callDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={240}
        width={30}
        backgroundWidth={24}
        fill={fill}
        tintColor="#00e0ff"
        backgroundColor="#3d5875">
        {x => (
          <>
            <Text style={styles.points}>
              {Math.round((MAX_POINTS * x) / 100)}
            </Text>
            <Text style={styles.unit}>ppm</Text>
          </>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 50,
  },
  points: {
    color: '#7591af',
    fontSize: 50,
    fontWeight: '100',
  },
  unit: {
    fontFamily: 'Avenir-Black',
    textAlign: 'center',
    color: '#7591af',
    fontSize: 16,
  },
});

GaugeMeterScreen.propTypes = {};

export default GaugeMeterScreen;
