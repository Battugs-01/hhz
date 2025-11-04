const API_URL = import.meta.env.VITE_API_URL

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  body: {
    token: string
    adminUser: {
      id: string
      email: string
      adminGroupId: string
      adminGroup: any
      status: string
      isEnabled: boolean
      userCreateDate: string
      password: string
      two_factor_enabled: boolean
      created_at: string
      updated_at: string
    }
  }
}

export interface UserInfoResponse {
  body: {
    id: string
    email: string
    adminGroupId: string
    adminGroup: any
    status: string
    isEnabled: boolean
    userCreateDate: string
    password: string
    two_factor_enabled: boolean
    created_at: string
    updated_at: string
  }
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Login failed' }))
      throw new Error(error.message || 'Login failed')
    }

    return response.json()
  },

  getUserInfo: async (token: string): Promise<UserInfoResponse> => {
    const response = await fetch(`${API_URL}/auth/info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Failed to fetch user info' }))
      throw new Error(error.message || 'Failed to fetch user info')
    }

    return response.json()
  },
}
