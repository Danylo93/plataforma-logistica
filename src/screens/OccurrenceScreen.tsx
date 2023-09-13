import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Box,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
  useToast,
  ScrollView,
  Center,
} from 'native-base'
import { useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import RNFetchBlob from 'rn-fetch-blob'

import { OccurrenceDTO } from '../dtos/OccurrenceDTO'
import { api } from '../services/api'

import { Button } from '../components/Button'
import { queryClient } from '../services/queryClient'
import { useQuery } from 'react-query'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type OccurrenceScreenProps = {
  route: {
    params: {
      // any proute params
      occurrenceId: string
    }
  }
  navigation: NativeStackNavigationProp<any>
}

const PDF_URL = ''

export function OccurrenceScreen({ route, navigation }: OccurrenceScreenProps) {
  const toast = useToast()

  const { occurrenceId } = route.params
  console.log('teste ocorrencia::', occurrenceId)

  const { data: share, error: erorShare } = useQuery(
    ['occurence'],
    async () => {
      const response = await api.post(`/reports`, {
        params: {
          id: 1,
          language: 'pt',
          webhook_url:
            'https://webhook.site/09377705-00ca-4321-a282-bc4c51b076ba',
        },
      })
      console.log('response: ', response.data)
      return response.data as OccurrenceDTO
    },
    {},
  )

  const {
    data: occurence,
    isLoading: isLoadingOccurence,
    error: errorOccurence,
  } = useQuery(
    ['occurence', occurrenceId],
    async () => {
      const response = await api.get(`/incidents/show?id=${occurrenceId}`)
      console.log('response: ', response.data)
      return response.data as OccurrenceDTO
    },
    {},
  )

  if (errorOccurence) {
    toast.show({
      title: 'Não foi possível carregar os detalhes da ocorrência',
      placement: 'top',
      bgColor: 'red.500',
    })
  }

  useEffect(() => {
    if (!occurence) {
      return
    }
    navigation.setOptions({
      title: `#${occurrenceId}`,
      headerRight: () => (
        <Text>PLACA DO VEÍCULO: {occurence?.form?.fleet_plate?.value}</Text>
      ),
    })
  }, [occurence])

  async function requestReport() {
    try {
      const { data } = await api.post(`/reports`, {
        params: {
          id: occurrenceId,
          language: 'pt',
          webhook_url:
            'https://webhook.site/09377705-00ca-4321-a282-bc4c51b076ba',
        },
      })
      console.log('solicitando relatório:', data)

      toast.show({
        title: 'Relatório solicitado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      })

      queryClient.invalidateQueries('ListOccurrences')
      navigation.navigate('occurences')
    } catch (error) {
      console.log(error)
      const title = 'Não foi possível solicitar ocorrência'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  async function shareOccurrence() {
    try {
      const { data } = await api.get(`/reports/download?id=9`)
      console.log('Baixou:', data)

      toast.show({
        title: 'Download efetuado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      })

      queryClient.invalidateQueries('ListOccurrences')
      navigation.navigate('occurences')
    } catch (error) {
      console.log(error)
      const title = 'Não foi fazer o download do relatório'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  async function delOccurrence() {
    try {
      await api.delete(`/incidents`, {
        data: {
          id: occurrenceId,
        },
      })

      toast.show({
        title: 'Ocorrência excluída com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      })

      queryClient.invalidateQueries('ListOccurrences')
      navigation.navigate('occurences')
    } catch (error) {
      console.log(error)
      const title = 'Não foi possível excluir a ocorrência'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  if (isLoadingOccurence) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Text>Carregando...</Text>
      </VStack>
    )
  }

  return (
    <VStack flex={1}>
      <ScrollView>
        <VStack p={8}>
          <Box rounded="lg" mb={3} overflow="hidden" />

          <Box bg="gray.100" rounded="md" pb={4} px={4}>
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb={6}
              mt={5}
            >
              <HStack>
                <VStack>
                  <Heading
                    color="black"
                    fontSize="lg"
                    flexShrink={1}
                    fontFamily="heading"
                  >
                    Detalhes da Ocorrencia
                  </Heading>
                  <>
                    <Text>
                      {occurence?.form?.date?.name}:{' '}
                      {occurence?.form?.date?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.fleet_plate?.name}:{' '}
                      {occurence?.form?.fleet_plate?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.driver_name?.name}:{' '}
                      {occurence?.form?.driver_name?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.driver_document?.name}:{' '}
                      {occurence?.form?.driver_document?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.assistant_name?.name}:{' '}
                      {occurence?.form?.assistant_name?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.assistant_document?.name}:{' '}
                      {occurence?.form?.assistant_document?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.incident_period?.name}:{' '}
                      {occurence?.form?.incident_period?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.address?.name}:{' '}
                      {occurence?.form?.address?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.neighborhood?.name}:{' '}
                      {occurence?.form?.neighborhood?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.city?.name}:{' '}
                      {occurence?.form?.city?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.state?.name}:{' '}
                      {occurence?.form?.state?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.country?.name}:{' '}
                      {occurence?.form?.country?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.description?.name}:{' '}
                      {occurence?.form?.description?.value}
                    </Text>
                    <Text>
                      {occurence?.form?.policy_station?.name}:{' '}
                      {occurence?.form?.policy_station?.value}
                    </Text>
                    <Text>Latitude: {occurence?.latitude}</Text>
                    <Text>Longitude: {occurence?.longitude}</Text>
                    <Text>Criado em : {occurence?.created_at}</Text>
                    <Text>Empresa : {occurence?.company?.razaosocial}</Text>
                  </>
                </VStack>
              </HStack>
            </HStack>

            <Center></Center>

            <HStack
              alignItems="center"
              justifyContent="space-between"
              mb={6}
              mt={5}
            >
              <TouchableOpacity onPress={() => shareOccurrence()}>
                <Icon as={Feather} name="download" color="black" size={6} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Icon as={Feather} name="share" color="blue.900" size={6} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => delOccurrence()}>
                <Icon as={Feather} name="trash" color="red.500" size={6} />
              </TouchableOpacity>
            </HStack>
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
