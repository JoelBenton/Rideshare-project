import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { defaultStyles } from '@/src/constants/themes';
import CustomDateTimePicker from '@/src/components/CustomDateTimePicker';
import SelectDateTimeButton from '@/src/components/SelectDateTimeButton';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/src/components/CustomButton';
import { RootState } from '@/src/rematch/store';
import { useSelector } from 'react-redux';

const CreateForm = () => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const { startLocation, endLocation, startModalLocation, endModalLocation } = useSelector((state: RootState) => state.locations);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [seats, setSeats] = useState(1);
  const [tripName, setTripName] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carColor, setCarColor] = useState('');

  const incrementSeats = () => setSeats((prev) => prev + 1);
  const decrementSeats = () => setSeats((prev) => (prev > 0 ? prev - 1 : 0));

  const openPicker = (pickerMode: 'date' | 'time') => {
    setPickerVisible(true);
    setMode(pickerMode);
  };

  const closePicker = () => setPickerVisible(false);

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
  };

  const confirm = () => {
    const tripData = {
      tripName,
      vehicleReg,
      carMake,
      carColor,
      selectedDate,
      seats,
    };

    console.log('Trip Data:', tripData);
    // You can replace this with a function to send the data to an API or another action
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Trip Details</Text>
      <View style={styles.timePickerContainer}>
        <SelectDateTimeButton
          label="Select Date"
          iconName="calendar"
          value={
            selectedDate
              ? selectedDate.toLocaleDateString('en-UK', { day: 'numeric', month: 'short', year: '2-digit' })
              : 'Open Date Picker'
          }
          onPress={() => openPicker('date')}
        />
        <SelectDateTimeButton
          label="Select Time"
          iconName="time-outline"
          value={
            selectedDate
              ? selectedDate.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit' })
              : 'Open Time Picker'
          }
          onPress={() => openPicker('time')}
        />
      </View>
      <Text style={styles.titleIndentStyle}>Name</Text>
      <TextInput
        style={styles.fullTextInput}
        placeholder="Trip Name"
        value={tripName}
        onChangeText={setTripName}
      />
      <Text style={styles.titleIndentStyle}>Car Details</Text>
      <TextInput
        style={styles.fullTextInput}
        placeholder="Vehicle Registration number"
        value={vehicleReg}
        onChangeText={setVehicleReg}
      />
      <View style={styles.carDetailsContainer}>
        <TextInput
          style={[styles.smallTextInput, { marginRight: 6 }]}
          placeholder="Make"
          value={carMake}
          onChangeText={setCarMake}
        />
        <TextInput
          style={[styles.smallTextInput, { marginLeft: 6 }]}
          placeholder="Colour"
          value={carColor}
          onChangeText={setCarColor}
        />
      </View>

      <Text style={[styles.titleIndentStyle, { textAlign: 'center' }]}>
        How many seats are available?
      </Text>
      <View style={styles.counterContainer}>
        <Ionicons
          name="person-remove-outline"
          size={32}
          onPress={decrementSeats}
          style={styles.counterIcon}
        />
        <Text style={styles.counterValue}>{seats}</Text>
        <Ionicons
          name="person-add-outline"
          size={32}
          onPress={incrementSeats}
          style={styles.counterIcon}
        />
      </View>

      <View style={{ flexGrow: 1 }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <CustomButton title="Cancel" buttonStyle={{ flex: 1, marginRight: 10 }} />
        <CustomButton title="Create Trip" buttonStyle={{ flex: 1, marginLeft: 10 }} onPress={confirm} />
      </View>

      <CustomDateTimePicker
        visible={isPickerVisible}
        mode={mode}
        onClose={closePicker}
        onConfirm={handleConfirm}
        initialValue={new Date()}
      />
    </SafeAreaView>
  );
};

export default CreateForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: defaultStyles.primaryColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleIndentStyle: {
    marginLeft: 10,
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 18,
  },
  fullTextInput: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    margin: 16,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  carDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  smallTextInput: {
    flex: 1,
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  counterIcon: {
    padding: 10,
  },
  counterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    minWidth: 50,
  },
});