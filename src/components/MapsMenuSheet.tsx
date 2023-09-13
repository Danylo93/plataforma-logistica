import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { MaterialIcons } from '@expo/vector-icons'
import {
  Button,
  Divider,
  Icon,
  Input,
  ScrollView,
  SearchIcon,
} from 'native-base'
import { useQuery } from 'react-query'
import { api } from '../services/api'
import { OccurrenceDTO } from '@dtos/OccurrenceDTO'
import { useGetMenuItems } from '../hooks/useGetMenuItems'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useHover } from 'native-base/lib/typescript/components/primitives'
interface MapsMenuSheetProps {
  onPress: (title: string) => void
}

export const MapsMenuSheet = ({ onPress }: MapsMenuSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => [100, '40%'], [])

  useEffect(() => {
    // bottomSheetRef.current?.snapTo(1);
    bottomSheetRef.current?.snapToIndex(1)
  }, [])

  const handleButtonPress = (routeName: string) => {
    // Add your button onPress logic here
    console.log(`${routeName} button pressed`)

    // Closes the bottomSheet after the button is pressed
    bottomSheetRef.current?.snapToIndex(0)

    // sent to the parent component the button pressed for outside treatment
    onPress(routeName)
  }

  const { data: me, isLoading: meLoading } = useQuery(
    ['Me'],
    async () => {
      const response = await api.get('/users/me')
      return response.data
    },
    {},
  )

  const MenuItemsByProfile = useGetMenuItems(meLoading, me?.roles?.profiles)
  console.log('MenuItemsByProfile: ', me, meLoading)
  console.log('MenuItemsByProfile: ', MenuItemsByProfile())

  return (
    <BottomSheet
      style={styles.contentContainer}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
    >
      {/* <View style={styles.contentContainer}> */}
      <Input
        variant="filled"
        placeholder="Informe o endereço"
        InputRightElement={<SearchIcon />}
        style={styles.searchInput}
      />
      <Divider marginY={6} />
      <BottomSheetScrollView contentContainerStyle={styles.contentScrollView}>
        {MenuItemsByProfile()?.map(({ label, icon, routeName }, index) => (
          <TouchableOpacity
            key={index}
            style={styles.touchableItem}
            onPress={() => handleButtonPress(routeName)}
          >
            <Ionicons
              style={styles.touchableIcon}
              name={icon as any}
              size={24}
              color="black"
            />
            <Text style={styles.touchableItemText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </BottomSheetScrollView>
      {/* </View> */}
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  contentScrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // backgroundColor: '#4d0e81',
  },
  searchInput: {
    fontSize: 18,
    paddingRight: 8,
  },
  touchableItem: {
    flex: 1,
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(243,243,243,0.54)',
    borderRadius: 8,
    marginBottom: 8,
  },
  touchableIcon: {
    marginRight: 8,
  },
  touchableItemText: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    textWeight: 'bold',
  },
})
