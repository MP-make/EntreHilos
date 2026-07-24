const STORAGE_KEY = 'entrehilos-usuario-id'

function generateId(): string {
  return crypto.randomUUID()
}

export function getUsuarioId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = generateId()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}