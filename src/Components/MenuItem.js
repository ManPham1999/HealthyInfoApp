import React, {memo, useEffect, useState} from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import GoogleFit from 'react-native-google-fit';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

const MenuItem = memo(({navigation, route, steps, calories, distance}) => {
  const [newCalo, setNewCalo] = useState([]);
  const [newSteps, setNewSteps] = useState([]);
  const [newDistance, setNewDistance] = useState([]);
  console.log('MenuItem rendered!');
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const opt = {
      startDate: '2020-11-01T00:00:17.971Z', // required
      endDate: new Date().toISOString(), // required
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };
    await GoogleFit.getDailySteps(new Date())
      .then(async res => {
        await setNewSteps(res);
      })
      .catch();

    // get distance
    await GoogleFit.getDailyDistanceSamples(opt).then(res => {
      setNewDistance(res);
    });
    await GoogleFit.getDailyCalorieSamples(
      {
        startDate: '2020-11-01T00:00:17.971Z', // required
        endDate: new Date().toISOString(), // required
        basalCalculation: true, // optional, to calculate or not basalAVG over the week
        bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      },
      async (isErr, res) => {
        if (isErr) {
          console.log('getDailyCalorieSamples error');
        }
        setNewCalo(res);
      },
    );
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const renderItem = ({item}) => {
    return (
      <Animatable.View animation="zoomIn" style={styles.item}>
        <View style={styles.itemBg}>
          <Image style={styles.icon} source={item.icon} resizeMode="contain" />
          <View>
            <Text style={styles.info}>{item.info}</Text>
            <Text style={styles.unit}>{item.unit}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </Animatable.View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <FlatList
          data={[
            {
              id: '1',
              title: 'Heart rate',
              info: '143',
              unit: 'bpm',
              icon: require('../assets/heart.png'),
            },
            {
              id: '2',
              title: 'Calories',
              info:
                newCalo.length > 0
                  ? Math.ceil(2022 + newCalo[newCalo.length - 1].calorie)
                  : Math.ceil(2022 + calories),
              unit: 'kcal',
              icon: require('../assets/calo.png'),
            },
            {
              id: '3',
              title: 'Steps',
              info: newSteps.length > 0 ? newSteps[2]?.steps[0]?.value : steps,
              unit: 'steps',
              icon: require('../assets/steps.png'),
            },
            {
              id: '4',
              title: 'Distance',
              info:
                newDistance.length > 0
                  ? Math.ceil(newDistance[newDistance.length - 1].distance) / 1000
                  : Math.ceil(distance) / 1000,
              unit: 'km',
              icon: require('../assets/distance.png'),
            },
          ]}
          renderItem={renderItem}
          key={2}
          numColumns={2}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatlist}
        />
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    flex: 1,
    padding: 10,
    paddingBottom: 5,
  },
  itemBg: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(211, 211, 211, .5)',
    borderRadius: 25,
    minHeight: 200,
    overflow: 'hidden',
    padding: 25,
  },
  icon: {
    width: 30,
    height: 30,
  },
  info: {
    marginTop: 25,
    fontSize: 27,
    fontWeight: '700',
  },
  unit: {
    marginTop: -5,
    color: '#CACACA',
    fontSize: 17,
  },
  title: {
    marginTop: 30,
    fontSize: 14,
    fontWeight: '700',
  },
  flatlist: {
    marginTop: 5,
    marginHorizontal: 12,
  },
});

export default MenuItem;
