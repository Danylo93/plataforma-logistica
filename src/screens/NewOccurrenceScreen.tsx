import {
  Alert,
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  ScrollView,
  Select,
  Text,
  useToast,
  WarningOutlineIcon,
} from 'native-base'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { LatLng } from 'react-native-maps'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { useQuery } from 'react-query'
import { api } from '../services/api'
import { AppError } from '../utils/AppError'
import DynamicForm from '../components/DynamicForm'
import { Simulate } from 'react-dom/test-utils'
import submit = Simulate.submit

type NewOccurrenceProps = {
  route: {
    params: {
      // any proute params
      markerCoordinates: LatLng
    }
  }
  navigation: NativeStackNavigationProp<any>
}
const NewOccurrenceScreen = ({ navigation, route }: NewOccurrenceProps) => {
  const formRef = useRef(null)
  const [currentLocation, setCurrentLocation] = useState(undefined)
  const [formData, setFormData] = useState({})
  const [incidentType, setIncidentType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formValues, setFormValues] = useState<{
    [key: string]: string | number
  }>({})
  const [formValuesCCO, setFormValuesCCO] = useState<{
    [key: string]: string | number
  }>({})

  const toast = useToast()

  const { markerCoordinates } = route.params
  console.log('markerCoordinates', markerCoordinates)

  const { data: user } = useQuery(
    'user',
    async () => {
      const { data } = await api.get('/users/me')
      return data
    },
    {},
  )

  // then get form by company id
  // todo: get form by company id, need implement show form by company id
  const {
    data: form,
    isLoading,
    isError,
  } = useQuery(
    'form',
    async () => {
      const { data } = await api.get(`/forms/show?id=${'1'}`)
      // const { data } = await api.get(`/forms/show?company_id=${user?.company_id}`)
      setFormData(data)
      console.log('forms: ', data)
      return data
    },
    {
      enabled: !!user,
    },
  )

  // request aderess from coordinates
  const address = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${markerCoordinates.latitude},${markerCoordinates.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
      )

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }

  useEffect(() => {
    if (!currentLocation) {
      address()
        .then((data) => {
          console.log('data', data)
          if (data.results && data.results.length > 0) {
            setCurrentLocation(data.results[0].formatted_address)
          }
        })
        .catch((error) => {
          console.log('error', error)
        })
    }
  }, [])

  const { data: types, isLoading: isLoadingTypes } = useQuery(
    'types',
    async () => {
      const { data } = await api.get('/types')
      return data
    },
  )

  console.log('types', types)

  const ActionsButtons = ({ block = false }) => {
    const widthDynamics = block ? '50%' : 'auto'
    return (
      <HStack>
        <Button
          width={widthDynamics}
          marginRight={2}
          variant={'outline'}
          onPress={HandleDraft}
        >
          Criar rascunho
        </Button>
        <Button width={widthDynamics} onPress={HandleSave}>
          Enviar
        </Button>
      </HStack>
    )
  }

  useEffect(() => {
    navigation.setOptions({
      title: 'Nova Ocorrência',
      headerRight: () => <ActionsButtons />,
    })
  }, [])

  const HandleSave = () => {
    console.log('save', formValues)
    const formPost = {
      incident_type_id: incidentType,
      form: formValues,
      cco_form: formValuesCCO,
      latitude: markerCoordinates.latitude,
      longitude: markerCoordinates.longitude,
    }

    handleSubmit(formPost)
  }

  const HandleDraft = () => {
    console.log('draft', incidentType)
    console.log('draft', formValues)

    const formPost = {
      incident_type_id: incidentType,
      form: formValues,
      cco_form: formValuesCCO,
      latitude: markerCoordinates.latitude,
      longitude: markerCoordinates.longitude,
    }

    handleSubmit(formPost)
    console.log('draft', formPost)
  }

  const handleSubmit = async (formMerge: any) => {
    console.log('formMerge: ', formMerge)
    setIsSubmitting(true)

    await api
      .post('/incidents', formMerge)
      .then((response) => {
        navigation.navigate('home')
        const title = 'Ocorrência criada com sucesso!!!'
        toast.show({
          title,
          placement: 'top',
          bgColor: 'green.500',
        })
      })
      .catch((error) => {
        const isAppError = error instanceof AppError
        const title = isAppError
          ? error.message
          : 'Não foi possível registrar uma ocorrência. Tente novamente mais tarde'

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500',
        })
        navigation.navigate('MyOccurrences')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const handleFormValuesChange = (values: any) => {
    setFormValues(values)
  }

  const handleFormValuesChangeCCO = (values: any) => {
    setFormValuesCCO(values)
  }

  return (
    <ScrollView style={styles.container}>
      {/*  Render a alert whit aderres where ocurrence will be open */}
      <Alert status={'info'} marginBottom={2}>
        <HStack flexShrink={1} space={2} alignItems="center">
          <Alert.Icon />
          <Text
            fontSize="lg"
            fontWeight="medium"
            _dark={{
              color: 'coolGray.800',
            }}
          >
            Você está abrindo uma ocorrência em:
          </Text>
        </HStack>
        <Text>{currentLocation}</Text>
      </Alert>

      <FormControl w="100%" maxW="100%" isRequired isInvalid>
        <FormControl.Label>Tipo de ocorrência</FormControl.Label>
        <Select
          minWidth="200"
          accessibilityLabel="Tipo de ocorrência"
          placeholder="Tipo de ocorrência"
          selectedValue={incidentType}
          onValueChange={(itemValue) => setIncidentType(itemValue)}
          _selectedItem={{
            bg: 'teal.600',
            fontSize: 16,
            endIcon: <CheckIcon size={5} />,
          }}
          mt="1"
          _text={{
            fontSize: 16,
          }}
        >
          {!isLoadingTypes &&
            types.map((type) => (
              <Select.Item
                label={type.label}
                value={type.id}
                _text={{ fontSize: 16 }}
              />
            ))}
        </Select>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          Selecione o tipo de ocorrência
        </FormControl.ErrorMessage>
      </FormControl>

      {form && (
        <DynamicForm
          formStructure={form?.fields}
          onFormValuesChange={handleFormValuesChange}
        />
      )}

      {user?.isCco && (
        <DynamicForm
          formStructure={form?.cco_fields}
          onFormValuesChange={handleFormValuesChangeCCO}
        />
      )}

      <Text>NewOccurrenceScreen</Text>
      <Text>{markerCoordinates.toString()}</Text>
      <ActionsButtons block />
    </ScrollView>
  )
}

export default NewOccurrenceScreen

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
})
