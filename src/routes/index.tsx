import { useAuth } from '../hooks/useAuth'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Loading } from '../components/Loading'

import { SignInScreen } from '../screens/SignInScreen'
import { MapScreen } from '../screens/MapScreen'
import NewOccurrenceScreen from '../screens/NewOccurrenceScreen'
import ListUsersScreen from '../screens/ListUsersScreen'
import NewOrEditUserScreen from '../screens/NewOrEditUserScreen'
import { ListOccurrencesScreen } from '../screens/ListOccurrencesScreen'
import { OccurrenceScreen } from '../screens/OccurrenceScreen'
import { MyOccurrencesScreen } from '../screens/MyOccurrencesScreen'

export function Routes() {
  const { isLoadingUserStorageData, isAuthenticated } = useAuth()
  const Stack = createNativeStackNavigator()

  if (isLoadingUserStorageData) {
    return <Loading />
  }
  console.log('isAuthenticated: ', isAuthenticated)

  return (
    <Stack.Navigator initialRouteName={'Maps'}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Maps" component={MapScreen} />
          <Stack.Screen name="NewOccurrence" component={NewOccurrenceScreen} />
          <Stack.Screen name="ListUsers" component={ListUsersScreen} />
          <Stack.Screen name="NewOrEditUser" component={NewOrEditUserScreen} />
          <Stack.Screen
            name="ListOccurrences"
            component={ListOccurrencesScreen}
          />
          <Stack.Screen name="MyOccurrences" component={MyOccurrencesScreen} />
          <Stack.Screen name="Occurrence" component={OccurrenceScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="signIn" component={SignInScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}
