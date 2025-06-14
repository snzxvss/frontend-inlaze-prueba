// Configuración base de la API
const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:3000"

// Función para obtener el token del localStorage
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

// Función para hacer requests con autenticación
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
)
: Promise<T> =>
{
  const token = getAuthToken()

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json();
}

// Función para requests sin respuesta JSON (como DELETE)
export const apiRequestNoResponse = async (endpoint: string, options: RequestInit = {}): Promise<void> => {
  const token = getAuthToken()

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
}
