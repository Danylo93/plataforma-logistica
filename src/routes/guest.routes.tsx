import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { Icon, useTheme } from 'native-base'
import { Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import HistorySvg from '../assets/history.svg'
import HomeSvg from '../assets/home.svg'
import ProfileSvg from '../assets/profile.svg'
import { Occurrence } from '@screens/OccurrenceScreen'
import { ListOccurrence } from '@screens/ListOccurrence'
import { Home } from '@screens/ListOccurrencesScreen'
import { Profile } from '@screens/old/Profile'
import { CreateUser } from '@screens/old/CreateUser'
import { CreateOccurrence } from '@screens/old/CreateOccurrence'
import { Maps } from '@screens/MapScreen'

type GuestRoutes = {
  home: undefined
  occurrence: {
    occurrenceId: string
  }
  profile: undefined
  maps: undefined
  occurences: undefined
  createUser: undefined
  createOccurrence: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<GuestRoutes>

const { Navigator, Screen } = createBottomTabNavigator<GuestRoutes>()

export function GuestRoutes() {
  const { sizes, colors } = useTheme()

  const iconSize = sizes[6]

  return (
    <></>
    // <Navigator
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarShowLabel: false,
    //     tabBarActiveTintColor: colors.orange[500],
    //     tabBarInactiveTintColor: colors.gray[200],
    //     tabBarStyle: {
    //       backgroundColor: colors.blue[500],
    //       borderTopWidth: 0,
    //       height: Platform.OS === 'android' ? 'auto' : 96,
    //       paddingBottom: sizes[9],
    //       paddingTop: sizes[7],
    //     },
    //   }}
    // >
    //   <Screen
    //     name="home"
    //     component={Home}
    //     options={{
    //       tabBarIcon: ({ color }) => (
    //         <HomeSvg fill={color} width={iconSize} height={iconSize} />
    //       ),
    //     }}
    //   />
    //
    //   <Screen
    //     name="occurences"
    //     component={ListOccurrence}
    //     options={{
    //       tabBarIcon: ({ color }) => (
    //         <HistorySvg fill={color} width={iconSize} height={iconSize} />
    //       ),
    //     }}
    //   />
    //   <Screen
    //     name="maps"
    //     component={Maps}
    //     options={{
    //       tabBarIcon: ({ color }) => (
    //         <Icon as={MaterialIcons} fill={color} name="map" size={6} />
    //       ),
    //     }}
    //   />
    //
    //   <Screen
    //     name="profile"
    //     component={Profile}
    //     options={{
    //       tabBarIcon: ({ color }) => (
    //         <ProfileSvg fill={color} width={iconSize} height={iconSize} />
    //       ),
    //     }}
    //   />
    //
    //   <Screen
    //     name="occurrence"
    //     component={Occurrence}
    //     options={{ tabBarButton: () => null }}
    //   />
    //   <Screen
    //     name="createUser"
    //     component={CreateUser}
    //     options={{ tabBarButton: () => null }}
    //   />
    //   <Screen
    //     name="createOccurrence"
    //     component={CreateOccurrence}
    //     options={{ tabBarButton: () => null }}
    //   />
    // </Navigator>
  )
}
