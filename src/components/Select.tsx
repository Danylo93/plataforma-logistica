import { FormControl, IInputProps } from 'native-base'
import { Picker } from '@react-native-picker/picker'
import { useState } from 'react'

type Props = IInputProps & {
  errorMessage?: string | null
}

export function Select({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid
  const [selecionado, setSElecionado] = useState([])

  const [profile] = useState([
    {
      id: '3c8da31e-2e1c-4fc8-9aaa-1ff86c84760f',
      name: 'admin',
      description: 'Role bewitchmently created by migration.',
      composite: false,
      clientRole: true,
      containerId: '6cb22ceb-9cc9-4754-82ca-532c4d8cebe4',
    },
    {
      id: 'fc2b6d8f-797e-4b4a-92bf-ea58a81f9700',
      name: 'operator',
      description: 'Role bewitchmently created by migration.',
      composite: false,
      clientRole: true,
      containerId: '6cb22ceb-9cc9-4754-82ca-532c4d8cebe4',
    },
    {
      id: '901db5f6-9138-445e-89f4-a0db0c0d638e',
      name: 'user',
      description: 'Role bewitchmently created by migration.',
      composite: false,
      clientRole: true,
      containerId: '6cb22ceb-9cc9-4754-82ca-532c4d8cebe4',
    },
    {
      id: 'e71d6e95-4651-4d9c-853e-1cd9f89f61b3',
      name: 'cco',
      description: 'Role bewitchmently created by migration.',
      composite: false,
      clientRole: true,
      containerId: '6cb22ceb-9cc9-4754-82ca-532c4d8cebe4',
    },
  ])

  return (
    <FormControl isInvalid={invalid} mb={4} bg="gray.100">
      <Picker
        selectedValue={selecionado}
        onValueChange={(itemValue, itemIndex) => setSElecionado(itemValue)}
      >
        {profile.map((type) => {
          return (
            <Picker.Item key={type.id} label={type.name} value={type.name} />
          )
        })}
      </Picker>

      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
