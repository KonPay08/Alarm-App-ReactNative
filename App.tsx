import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import BackgroundTimer from 'react-native-background-timer';
import Tts from 'react-native-tts';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isShowPicker, setIsShowPicker] = useState(false);
  const [timerId, setTimerId] = useState<number | null>(null);
  
  const onDateChange = (_e: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate
    if(!currentDate) return;
    setIsShowPicker(false);
    setSelectedDate(currentDate);
    if (timerId) {
      BackgroundTimer.clearTimeout(timerId);
    }
    const timeDifference = currentDate.getTime() - new Date().getTime();
    if (timeDifference > 0) {
      const newTimerId = BackgroundTimer.setTimeout(() => {
        let alarmCount = 0;
        const intervalId = setInterval(() => {
          alarmCount++;
          Tts.speak(
            `アラーム設定時刻が来ました。時刻は${currentDate.getHours()}時${currentDate.getMinutes()}分です。`,
          );
          if (alarmCount >= 3) {
            clearInterval(intervalId);
          }
        }, 1000);
      }, timeDifference);
      setTimerId(newTimerId);
    }
  };
  useEffect(() => {
    Tts.setDefaultRate(0.4); 
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>アラームアプリ</Text>
      <TouchableOpacity 
        onPress={() => {
          setIsShowPicker(prev => !prev)
        }}
      >
        <Text style={styles.alarmText}>
          {selectedDate
            ? `アラーム設定時刻：${selectedDate.getHours().toString().padStart(2, '0')}:${selectedDate.getMinutes().toString().padStart(2, '0')}`
            : "アラームを設定してください"
          }
        </Text>
      </TouchableOpacity>
      {isShowPicker && (
        <View style={styles.dateTimePickerContainer}>
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedDate || new Date()}
            mode="time"
            display="spinner"
            is24Hour={true}
            locale="es-ES"
            onChange={onDateChange}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    top: -100
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  alarmText: {
    fontSize: 18,
  },
  dateTimePickerContainer: {
    position: 'absolute',
    bottom: 150
  }
});
