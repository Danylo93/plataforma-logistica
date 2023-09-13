import React, { useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
} from 'react-native'

interface Props {
  onChangeText: (text: string) => void
  onButtonPress: () => void
  value: string
}

export function SearchBar({ onChangeText, onButtonPress, value }: Props) {
  const [searchText, setSearchText] = useState<string>(value)

  const handleOnChangeText = (text: string) => {
    setSearchText(text)
    onChangeText(text)
  }

  const handleOnButtonPress = () => {
    onButtonPress()
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar Ocorrências"
        value={searchText}
        onChangeText={handleOnChangeText}
      />
      <TouchableOpacity style={styles.button} onPress={handleOnButtonPress}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007aff',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    padding: 10,
  },
})
