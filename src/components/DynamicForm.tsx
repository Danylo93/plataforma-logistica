import React, { useState, memo } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { VStack, Input, Center, Text, HStack } from 'native-base'
import { Picker } from '@react-native-picker/picker'
import { UserDTO } from '../dtos/UserDTO'
import { api } from '../services/api'
import DatePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
interface FieldOption {
  value: string | number
  label: string
}

interface Field {
  name: string
  value: null | string | number
  type: string
  rules: string[]
  fetch_url: null | string
  options?: FieldOption[]
}

interface TypeUser {
  isCco: boolean
}

interface DynamicFormProps {
  formStructure?: any
  onFormValuesChange?: (values: { [key: string]: string | number }) => void
}

const TextInputField = memo(function TextInputField({ field, handleChange }) {
  const commonProps = {
    placeholder: field.name,
    value: field.value || '',
    onChangeText: handleChange,
  }

  return (
    <>
      <HStack p={2}>
        <Text fontSize="md">{field.name}:</Text>
      </HStack>
      <Input
        {...commonProps}
        keyboardType={
          field.type === 'number' || field.type === 'float'
            ? 'numeric'
            : 'default'
        }
      />
    </>
  )
})

const SelectField = memo(function SelectField({ field, handleChange }) {
  return (
    <>
      <Center>
        <Text fontSize="md">{field.name}</Text>
      </Center>
      <Picker
        selectedValue={field.value}
        onValueChange={handleChange}
        style={{ flex: 1 }}
      >
        {field.options &&
          field.options.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.label}
              value={option.value}
            />
          ))}
      </Picker>
    </>
  )
})

const DateInputField = memo(function DateInputField({ field, handleChange }) {
  const [showDatePicker, setShowDatePicker] = useState(false)

  const commonProps = {
    value: field.value ? new Date(field.value) : new Date(),
    onChange: (_event, selectedDate) => {
      setShowDatePicker(false)
      if (selectedDate) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd HH:mm:ss')
        handleChange(formattedDate)
      }
    },
    mode: 'date',
  }

  const openDatePicker = () => {
    setShowDatePicker(true)
  }

  return (
    <>
      <HStack p={2}>
        <Text fontSize="md">{field.name}:</Text>
      </HStack>
      <TouchableOpacity onPress={openDatePicker}>
        <Input
          isReadOnly
          value={
            field.value
              ? format(new Date(field.value), 'dd/MM/yyyy')
              : format(new Date(), 'dd/MM/yyyy')
          }
          placeholder={field.name}
        />
      </TouchableOpacity>
      {showDatePicker && <DatePicker {...commonProps} />}
    </>
  )
})

function DynamicForm({ formStructure, onFormValuesChange }: DynamicFormProps) {
  const [formValues, setFormValues] = useState<{
    [key: string]: string | number
  }>({})

  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function handleGetUser() {
    const { data } = await api.get('/users/me')
    setUser(data)
    console.log(data)
  }

  const handleChange = (field, value) => {
    const updatedFormValues = { ...formValues, [field]: value }
    setFormValues(updatedFormValues)

    if (onFormValuesChange) {
      onFormValuesChange(updatedFormValues)
    }
  }

  if (!formStructure) {
    return null
  }

  return (
    <ScrollView>
      <VStack space={4}>
        {Object.entries(formStructure).map(([key, field]) => {
          const handleChangeForKey = (value) => handleChange(key, value)
          field.value = formValues[key] || field.value || ''
          switch (field.type) {
            case 'text':
            case 'number':
            case 'float':
              return (
                <TextInputField
                  key={key}
                  field={field}
                  handleChange={handleChangeForKey}
                />
              )

            case 'date':
              return (
                <DateInputField
                  key={key}
                  field={field}
                  handleChange={handleChangeForKey}
                />
              )

            case 'select':
              return (
                <SelectField
                  key={key}
                  field={field}
                  handleChange={handleChangeForKey}
                />
              )

            default:
              return null
          }
        })}
      </VStack>
    </ScrollView>
  )
}

export default DynamicForm
