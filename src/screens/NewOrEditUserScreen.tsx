import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {
  Box,
  FormControl,
  Input,
  Button,
  VStack,
  Text,
  Switch,
  Select,
  CheckIcon,
} from 'native-base'
import { api } from '../services/api'

export interface TypeProfile {
  id: string
  name: string
  description: string
  composite: boolean
  clientRole: boolean
  containerId: string
}

type NewOrEditUserScreenProps = {
  route: {
    params: {
      // any route params
      id?: string
    }
  }
  navigation: NativeStackNavigationProp<any>
}

interface FormDataProps {
  name: string
  username: string
  document: string // cpf 000.000.000-00
  email: string
  profiles: TypeProfile[]
  company_id: string
  preferred_locale: string
  receive_alert: boolean
}

const NewOrEditUserScreen: React.FC<NewOrEditUserScreenProps> = ({
  navigation,
  route,
}) => {
  const id = route?.params?.id || false
  const [profiles, setProfiles] = useState<TypeProfile[]>([])
  const [formData, setFormData] = useState<FormDataProps>({
    name: '',
    username: '',
    document: '',
    email: '',
    profiles: [],
    company_id: '',
    preferred_locale: 'pt',
    receive_alert: false,
  })

  useEffect(() => {
    id
      ? navigation.setOptions({ title: 'Editar Usuário' })
      : navigation.setOptions({ title: 'Criar Usuário' })

    async function fetchData() {
      try {
        const companyResponse = await api.get('/users/me')
        const profilesResponse = await api.get('/profiles')

        if (id) {
          const { data: user } = await api.get(`/users/${id}`)
          setFormData({
            ...formData,
            name: user.name || '',
            username: user.username || '',
            document: user.document || '',
            email: user.email || '',
            profiles: user.profiles || [],
            company_id: user.company_id || '',
            receive_alert: user.receive_alert || false,
          })
        }

        setFormData((prevState) => ({
          ...prevState,
          company_id: companyResponse.data.company_id,
        }))
        setProfiles(profilesResponse.data)
      } catch (error) {
        console.log('Error fetching data:', error)
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async () => {
    console.log('Form data:', formData)
    try {
      if (id) {
        // Update user
        await api
          .put(`/users/${id}`, formData)
          .then((response) => {
            console.log(response)
          })
          .catch((error) => {
            console.log(error)
            return error
          })
        console.log('User updated')
      } else {
        // Create user
        await api
          .post('/users', formData)
          .then((response) => {
            console.log(response)
            console.log('User created')
          })
          .catch((error) => {
            console.log(error)
            return error
          })
      }
      navigation.goBack()
    } catch (error) {
      console.log('Error submitting form:', error)
    }
  }

  const handleChange = (key: keyof FormDataProps, value: any) => {
    console.log('key:', key)
    console.log('value:', value)
    setFormData({ ...formData, [key]: value })
  }

  const handleAddProfile = (profile: TypeProfile) => {
    setFormData((prevState) => {
      const updatedProfiles = prevState.profiles.concat(profile)
      console.log('formData.profiles add:', updatedProfiles)
      return { ...prevState, profiles: updatedProfiles }
    })
  }

  const handleRemoveProfile = (profile: TypeProfile) => {
    setFormData((prevState) => {
      const updatedProfiles = prevState.profiles.filter(
        (p) => p.id !== profile.id,
      )
      console.log('formData.profiles remove:', updatedProfiles)
      return { ...prevState, profiles: updatedProfiles }
    })
  }

  return (
    <ScrollView>
      <Box mx={5} mt={6}>
        <VStack space={4}>
          <FormControl>
            <FormControl.Label>Nome do usuário</FormControl.Label>
            <Input
              placeholder="Nome do usuário"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              placeholder="Username"
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Documento (CPF)</FormControl.Label>
            <Input
              placeholder="000.000.000-00"
              keyboardType="numeric"
              value={formData.document}
              onChangeText={(value) => handleChange('document', value)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              placeholder="Email"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Receber alertas</FormControl.Label>
            <Switch
              isChecked={formData.receive_alert}
              onToggle={(value) => handleChange('receive_alert', value)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Perfis</FormControl.Label>
            <Select
              minWidth={200}
              accessibilityLabel="Selecione os perfis"
              placeholder="Selecione os perfis"
              isMulti
              selectedValues={formData.profiles.map((profile) => profile.id)}
              onValueChange={(value) => {
                const selectedProfile = profiles.find(
                  (profile) => profile.id === value,
                )

                if (formData.profiles.some((profile) => profile.id === value)) {
                  handleRemoveProfile(selectedProfile)
                  console.log('formData.profiles remove:', formData.profiles)
                } else {
                  handleAddProfile(selectedProfile)
                  console.log('formData.profiles add:', formData.profiles)
                }
              }}
              _selectedItem={{
                bg: 'indigo.400',
                endIcon: <CheckIcon size={4} />,
              }}
            >
              {profiles.map((profile) => (
                <Select.Item
                  key={profile.id}
                  label={profile.name}
                  value={profile.id}
                  _text={{
                    color: formData.profiles.some((p) => p.id === profile.id)
                      ? 'gray.800'
                      : 'gray.800',
                    bg: formData.profiles.some((p) => p.id === profile.id)
                      ? 'indigo.100'
                      : 'white',
                  }}
                  _stack={{
                    bg: formData.profiles.some((p) => p.id === profile.id)
                      ? 'indigo.100'
                      : 'white',
                  }}
                  _hover={{
                    bg: 'indigo.200',
                  }}
                />
              ))}
            </Select>
          </FormControl>
        </VStack>
        <Button mt={5} _text={{ color: 'white' }} onPress={handleSubmit}>
          {id ? 'Atualizar Usuario' : 'Criar Usuario'}
        </Button>
      </Box>
    </ScrollView>
  )
}

export default NewOrEditUserScreen
