import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  memo,
  useCallback,
} from 'react'
import { StyleSheet, StatusBar } from 'react-native'
import {
  Alert,
  Box,
  Center,
  Fab,
  HStack,
  Icon,
  Text,
  View,
  VStack,
  Button,
  Pressable,
} from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  LatLng,
} from 'react-native-maps'
import * as Location from 'expo-location'
import { useQuery } from 'react-query'
import { api } from '../services/api'
import { MapsMenuSheet } from '../components/MapsMenuSheet'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useAuth } from '../hooks/useAuth'

interface Occurrence {
  id: string
  title: string
  description: string
  fleet_plate: string
  location: {
    latitude: number
    longitude: number
  }
  type: {
    id: number
    label: string
  }
}

type MapScreenProps = {
  route: {
    params: {
      // any proute params
    }
  }
  navigation: NativeStackNavigationProp<any>
}

const CustomMarker = memo(({ item, color }) => {
  return (
    <Marker
      key={item.id}
      coordinate={{
        latitude: parseFloat(item.latitude) || 0,
        longitude: parseFloat(item.longitude) || 0,
      }}
      title={item.company.nomefantasia}
      pinColor={color}
    />
  )
})

export function MapScreen({ route, navigation }: MapScreenProps) {
  const { signOut } = useAuth()
  const [markerCoordinates, setMarkerCoordinates] = useState<LatLng | null>({
    latitude: null,
    longitude: null,
  })
  const [location, setLocation] = useState(undefined)
  const [status, setStatus] = useState('undetermined')
  const [isCreatingOccurrence, setIsCreatingOccurrence] = useState(false)

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [])

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        setStatus('denied')
        console.log('Permission to access location was denied')
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        mayShowUserSettingsDialog: true,
      })

      const { latitude, longitude } = currentLocation?.coords

      setStatus('granted')
      setLocation({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })

      setMarkerCoordinates({ latitude, longitude })
    }

    if (status !== 'granted') {
      console.log('getPermission called')
      getPermission()
    }
  }, [status])

  const {
    data: occurrences,
    isLoading: isLoadingOccurrences,
    isError: isErrorOccurrences,
  } = useQuery(
    'occurrences',
    async () => {
      const response = await api.get('/incidents/map')
      // grupos de ocorrências por tipo
      const data = response.data.reduce((acc, occurrence) => {
        const type = occurrence.type.label
        const occurrences = acc[type] || []
        acc[type] = [...occurrences, occurrence]
        return acc
      }, {})

      return data
    },
    {
      enabled: status === 'granted',
      refetchInterval: 3000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
    },
  )

  useEffect(() => console.log('occurrences: ', occurrences), [occurrences])

  const handleMapClick = (e) => {
    setMarkerCoordinates(e.nativeEvent.coordinate)
  }

  const handleMenuButtonClick = (buttonName: string) => {
    if (buttonName === 'NewOccurrence') {
      setIsCreatingOccurrence(true)
    } else if (buttonName === '/logout') {
      signOut()
    } else {
      navigation.navigate(buttonName)
    }
  }

  const handleOccurrenceLocationConfirmation = () => {
    setIsCreatingOccurrence(false)
    navigation.navigate('NewOccurrence', { markerCoordinates })
  }

  const handleOccurrenceLocationCancelation = () => {
    setIsCreatingOccurrence(false)
    setMarkerCoordinates({ latitude: null, longitude: null })
  }

  // Use useMemo for the creation of CustomMarker components
  const concretizadoMarkers = useMemo(() => {
    return !isLoadingOccurrences && !isErrorOccurrences
      ? occurrences?.Concretizado?.map((occurrence) => (
          <CustomMarker key={occurrence.id} item={occurrence} color={'red'} />
        ))
      : null
  }, [isLoadingOccurrences, isErrorOccurrences, occurrences])

  const tentativaMarkers = useMemo(() => {
    return !isLoadingOccurrences && !isErrorOccurrences
      ? occurrences?.Tentativa?.map((occurrence) => (
          <CustomMarker key={occurrence.id} item={occurrence} color={'blue'} />
        ))
      : null
  }, [isLoadingOccurrences, isErrorOccurrences, occurrences])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isCreatingOccurrence && (
        <>
          <Alert maxW="100%" status="error">
            <HStack flexShrink={1} space={2} alignItems="center">
              <Alert.Icon />
              <Text
                fontSize="lg"
                fontWeight="medium"
                _dark={{
                  color: 'coolGray.800',
                }}
              >
                Você está criando uma nova ocorrência
              </Text>
            </HStack>
            <Box
              pl="6"
              _dark={{
                _text: {
                  color: 'coolGray.600',
                  textAlign: 'center',
                },
              }}
            >
              Selecione o local exato da ocorrência no mapa e clique no botão
              "Confirmar" ou em "Cancelar" para cancelar a criação da
              ocorrência.
            </Box>
          </Alert>
          <HStack style={styles.buttonStack}>
            <Pressable
              style={[styles.button]}
              onPress={handleOccurrenceLocationCancelation}
            >
              <Text style={styles.buttonCancel}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button]}
              onPress={handleOccurrenceLocationConfirmation}
            >
              <Text style={styles.buttonConfirm}>Confirmar</Text>
            </Pressable>
          </HStack>
        </>
      )}
      <View style={styles.container}>
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={location}
            initialRegion={location}
            zoomEnabled={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsUserLocation={true}
            showsPointsOfInterest={false}
            onPress={(e) => handleMapClick(e)}
          >
            {isCreatingOccurrence &&
              markerCoordinates?.latitude &&
              markerCoordinates?.longitude && (
                <Marker
                  key={'creatingOccurrence'}
                  coordinate={markerCoordinates}
                  draggable
                  pinColor={'purple'}
                  onDragEnd={(e) =>
                    setMarkerCoordinates(e.nativeEvent.coordinate)
                  }
                />
              )}

            {concretizadoMarkers}
            {tentativaMarkers}
          </MapView>
        </>
        <MapsMenuSheet onPress={handleMenuButtonClick} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  icon: {
    height: 32,
    width: 32,
  },
  loading: {
    color: 'blue.500',
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  occurrence: {
    marginBottom: 10,
  },
  occurrenceDescription: {},
  occurrenceList: {
    backgroundColor: 'white',
    bottom: 0,
    left: 0,
    padding: 10,
    position: 'absolute',
    right: 0,
  },
  occurrenceTitle: {
    fontWeight: 'bold',
  },
  floatingButton: {
    fontSize: 16,
  },
  warningMessage: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  warningMessageContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderBottomColor: 'red',
    padding: 10,
    position: 'absolute',
    top: 0,
    width: '100%',
    maxWidth: '100%',
    zIndex: 1000,
  },
  buttonStack: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  buttonConfirm: {
    width: '100%',
    padding: 10,
    fontSize: 20,
    textAlign: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'green',
  },
  buttonCancel: {
    width: '100%',
    textAlign: 'center',
    padding: 10,
    fontSize: 20,
    borderBottomWidth: 4,
    borderBottomColor: 'red',
  },
})
