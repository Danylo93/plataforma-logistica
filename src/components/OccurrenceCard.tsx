import { HStack, Heading, Icon, Text, VStack } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

import { Entypo } from '@expo/vector-icons'

import { OccurrenceDTO } from '../dtos/OccurrenceDTO'

type Props = TouchableOpacityProps & {
  data: OccurrenceDTO
}

export function OccurrenceCard({ data, ...rest }: Props) {
  
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="blue.500"
        alignItems="center"
        p={2}
        pr={4}
        rounded="md"
        mb={3}
      >
        <VStack flex={1}>
          <Heading fontSize="lg" color="white" fontFamily="heading">
            {data?.form?.fleet_plate?.name}: {data?.form?.fleet_plate?.value}
          </Heading>

          <Text fontSize="sm" color="white" mt={1} numberOfLines={2}>
            {data?.form?.driver_name?.name}: {data?.form?.driver_name?.value}
          </Text>
          <Text fontSize="sm" color="white" mt={1} numberOfLines={2}>
            {data?.form?.address?.name}: {data?.form?.address?.value}
          </Text>
          <Text fontSize="sm" color="white" mt={1} numberOfLines={2}>
            {data?.form?.date?.name}: {data?.form?.date?.value}
          </Text>
          <Text fontSize="sm" color="white" mt={1} numberOfLines={2}>
            {data?.form?.incident_period?.name}:{' '}
            {data?.form?.incident_period?.value}
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
      </HStack>
    </TouchableOpacity>
  )
}
