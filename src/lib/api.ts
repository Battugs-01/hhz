const API_URL = import.meta.env.VITE_API_URL

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  employee: {
    accountNo: string
    email: string
    role: string[]
    exp: number
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
}
