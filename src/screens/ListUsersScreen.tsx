import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
} from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useDebounce } from 'use-debounce'
import { api } from '../services/api'
import { Avatar, Button } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

interface User {
  id: number
  name: string
  email: string
  picture?: string
  roles: { profiles: string[] }
}

type ListUsersScreenProps = {
  route: {
    params: {
      // any route params
    }
  }
  navigation: NativeStackNavigationProp<any>
}

const profilesMapper = {
  admin: 'Administrador',
  cco: 'CCO',
  user: 'Usuário',
  operator: 'Operador',
}

const ListUsersScreen = ({ navigation, route }: ListUsersScreenProps) => {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const sectionListRef = useRef<SectionList>(null)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Usuários',
      headerRight: () => (
        <Button
          variant={'outline'}
          onPress={() => navigation.navigate('NewOrEditUser')}
        >
          <MaterialIcons name={'add'} size={24} color={'#000'} />
        </Button>
      ),
    })
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [debouncedSearch])

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users`)
      const data = await response.data
      setUsers(data)
    } catch (error) {
      console.error(error)
    }
  }

  const filterUsers = useCallback(() => {
    if (!debouncedSearch) {
      return users
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearch.toLowerCase()),
    ) as User[]
  }, [debouncedSearch, users])

  const groupUsersByLetter = useMemo(() => {
    const filteredUsers = filterUsers()

    const groupedUsers: { [key: string]: User[] } = {}

    filteredUsers.forEach((user) => {
      const firstLetter = user.name[0].toUpperCase()
      if (!groupedUsers[firstLetter]) {
        groupedUsers[firstLetter] = []
      }

      groupedUsers[firstLetter].push(user)
    })

    return Object.keys(groupedUsers).map((key) => ({
      title: key,
      data: groupedUsers[key],
    }))
  }, [filterUsers])

  const Item = memo(({ item }: { item: User }) => {
    const [tags, setTags] = useState<string[]>([])

    const abreviateName = item?.name
      ?.split(' ')
      .map((name) => name[0])
      .join('')

    useEffect(() => {
      const profiles = item.roles?.profiles ?? []
      setTags(profiles)
    }, [item.roles])

    return (
      <TouchableOpacity
        // onPress={() => navigation.navigate('EditUser', { id: item.id })}
        style={styles.item}
      >
        <Avatar
          bg="green.500"
          source={{
            uri: item?.picture,
          }}
          style={styles.avatar}
        >
          {abreviateName}
        </Avatar>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <View style={styles.tags}>
            {tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                {profilesMapper[tag]}
              </Text>
            ))}
          </View>
        </View>
        <Button
          variant={'outline'}
          onPress={() => navigation.navigate('NewOrEditUser', { id: item.id })}
        >
          <MaterialIcons name={'edit'} size={24} color={'#000'} />
        </Button>
      </TouchableOpacity>
    )
  })

  const renderItem = ({ item }: { item: User }) => <Item item={item} />

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; data: User[] }
  }) => {
    const numberOfUsers = section.data.length

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderLeft}>{section.title}</Text>
        <Text style={styles.sectionHeaderRight}>{numberOfUsers}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar por nome ou email"
      />
      <SectionList
        ref={sectionListRef}
        sections={groupUsersByLetter}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id.toString()}
        stickySectionHeadersEnabled={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  alphabetSidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  alphabetLetter: {
    fontSize: 12,
    textAlign: 'center',
    padding: 5,
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderLeft: {
    flex: 1,
  },
  sectionHeaderRight: {
    marginLeft: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
    maxWidth: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#eee',
    color: '#666',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 5,
  },
})

export default ListUsersScreen
