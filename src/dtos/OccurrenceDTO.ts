export type OccurrenceDTO = {
  id: number
  form: {
    date: {
      name: string
      value: string
    }
    fleet_plate: {
      name: string
      value: string
    }
    map_number: {
      name: string
      value: number
    }
    map_value: {
      name: string
      value: number
    }
    driver_name: {
      name: string
      value: string
    }
    driver_document: {
      name: string
      value: string
    }
    assistant_name: {
      name: string
      value: string
    }
    assistant_document: {
      name: string
      value: string
    }
    incident_period: {
      name: string
      value: string
      options: [
        {
          value: string
          label: string
        },
        {
          value: string
          label: string
        },
        {
          value: string
          label: string
        },
        {
          value: string
          label: string
        },
      ]
    }
    address: {
      name: string
      value: string
    }
    neighborhood: {
      name: string
      value: string
    }
    city: {
      name: string
      value: string
    }
    state: {
      name: string
      value: string
    }
    country: {
      name: string
      value: string
    }
    description: {
      name: string
      value: string
    }
    actuation: {
      name: string
      value: number
      options: [
        {
          value: 0
          label: string
        },
        {
          value: 1
          label: string
        },
      ]
    }
    registered_redirected: {
      name: string
      value: 1
      options: [
        {
          value: 0
          label: string
        },
        {
          value: 1
          label: string
        },
      ]
    }
    policy_station: {
      name: string
      value: string
    }
  }
  latitude: string
  longitude: string
  serviced_at: null
  created_at: string
  updated_at: string
  deleted_at: null
  user: {
    id: string
    name: string
    username: string
    email: string
    company_id: string
    preferred_locale: string
    receive_alert: boolean
  }
  attendant: null
  company: {
    id: string
    cnpj: string
    razaosocial: string
    nomefantasia: string
    active: boolean
    plan: {
      id: string
      label: string
    }
  }
  type: {
    id: number
    label: string
  }
}
