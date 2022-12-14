import React, { useState } from 'react'

import { Text, View, SafeAreaView, Button, Pressable } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import styles from './styles'
import { useNavigation } from "@react-navigation/native";

const CustomDatePicker = () => {
  const [datePickerDepart, setDatePickerDepart] = useState(false)
  const [date, setDate] = useState(new Date())


  const showDatePickerDepart = () => {
    setDatePickerDepart(true)
  }

  const onDateSelectedDepart = (e, value) => {
    // toDatePicker(date)  venia por props
    setDate(value)
    setDatePickerDepart(false)
    // console.log(date)
  }

  return (
    <View style={styles.MainContainer}>
      {datePickerDepart && (
        <DateTimePicker
          value={date}
          mode={'date'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          onChange={onDateSelectedDepart}
          style={styles.datePicker}
        />
      )}
      {!datePickerDepart && (
        <View style={{ margin: 10, minHeight: 100 }}>
          <Button
            style={styles.button}
            title='Select Date'
            color='#376dac'
            onPress={showDatePickerDepart}
          />
        </View>
      )}
      <Text style={styles.text}>{date.toDateString()}</Text>
    </View>
  )
}

export default CustomDatePicker;



{/* <Button style={{ width: 100, height: 40, alignSelf: 'center', marginTop: 10, color: '#ffff', backgroundColor: '#252440' }} alignItems='center' title="Find it!" onPress={onSubmit}>Find it!</Button> */ }


// const CustomDatePicker = ({ toDatePicker }) => {
//   const [datePickerDepart, setDatePickerDepart] = useState(false)
//   const [date, setDate] = useState(new Date())

//   const showDatePickerDepart = () => {
//     setDatePickerDepart(true)
//   }
//   const onDateSelectedDepart = (e, value) => {
//     toDatePicker(date)
//     setDate(value)
//     setDatePickerDepart(false)
//     console.log(date)
//   }
//   return (
//     <View style={styles.MainContainer}>
//       <Text style={styles.text}>{date.toDateString()}</Text>
//       {datePickerDepart && (
//         <DateTimePicker
//           value={date}
//           mode={'date'}
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           is24Hour={true}
//           onChange={onDateSelectedDepart}
//           style={styles.datePicker}
//         />
//       )}
//       {!datePickerDepart && (
//         <View style={{ margin: 10, minHeight: 100 }}>
//           <Button
//             title='Select Depart Date'
//             color='#376dac'
//             onPress={showDatePickerDepart} />
//         </View>
//       )}
//     </View>
//   )
// }

