import { useCallback } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'

const menuItems = [
  {
    label: 'Nova Ocorrência',
    icon: 'create-outline',
    routeName: 'NewOccurrence',
    profiles: ['user'],
  },
  {
    label: 'Minhas Ocorrências',
    icon: 'file-tray-full-outline',
    routeName: 'MyOccurrences',
    profiles: ['user'],
  },
  {
    label: 'Busca de Ocorrências',
    icon: 'location-outline',
    routeName: 'ListOccurrences',
    profiles: ['cco'],
  },
  {
    label: 'Gestão de Usuarios',
    icon: 'people-outline',
    routeName: 'ListUsers',
    profiles: ['admin'],
  },
]

export const useGetMenuItems = (meLoading: boolean, profiles: string[]) => {
  const getMenuItems = useCallback(() => {
    if (meLoading || !profiles) return []

    const filteredItems = menuItems.filter((item) =>
      item.profiles.some((profile) => profiles.includes(profile)),
    )

    const menu = [
      ...filteredItems,
      {
        label: 'Sair',
        icon: 'log-out-outline',
        routeName: '/logout',
      },
    ]
    return menu
  }, [meLoading, profiles])

  return getMenuItems
}
