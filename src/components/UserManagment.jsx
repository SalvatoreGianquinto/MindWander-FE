import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import api from "../api"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rolesUpdates, setRolesUpdates] = useState({})

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users")
      setUsers(res.data)
      setLoading(false)
    } catch {
      setError("Errore nel caricamento utenti")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleToggle = (userId, role, isChecked) => {
    setRolesUpdates((prev) => {
      const userRoles = prev[userId] || {
        addRoles: new Set(),
        removeRoles: new Set(),
      }
      if (isChecked) {
        userRoles.addRoles.add(role)
        userRoles.removeRoles.delete(role)
      } else {
        userRoles.addRoles.delete(role)
        userRoles.removeRoles.add(role)
      }
      return { ...prev, [userId]: userRoles }
    })
  }

  const handleSaveRoles = async (userId) => {
    try {
      const { addRoles, removeRoles } = rolesUpdates[userId] || {
        addRoles: new Set(),
        removeRoles: new Set(),
      }
      await api.put(`/users/${userId}/roles`, {
        addRoles: Array.from(addRoles),
        removeRoles: Array.from(removeRoles),
      })
      alert("Ruoli aggiornati")
      fetchUsers()
      setRolesUpdates((prev) => {
        const newUpdates = { ...prev }
        delete newUpdates[userId]
        return newUpdates
      })
    } catch {
      alert("Errore aggiornamento ruoli")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo utente?")) return
    try {
      await api.delete(`/users/${userId}`)
      alert("Utente eliminato")
      fetchUsers()
    } catch {
      alert("Errore eliminazione utente")
    }
  }

  if (loading) return <p>Caricamento utenti...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>Gestione Utenti</h2>
      <table className="tabella-backoffice">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ruoli</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const userRoles = new Set(user.ruoli)
            const userUpdates = rolesUpdates[user.id] || {
              addRoles: new Set(),
              removeRoles: new Set(),
            }
            const isRoleChecked = (role) => {
              if (userUpdates.addRoles.has(role)) return true
              if (userUpdates.removeRoles.has(role)) return false
              return userRoles.has(role)
            }
            return (
              <tr key={user.id}>
                <td data-label="Nome">
                  {user.nome} {user.cognome}
                </td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Ruoli">
                  {["ADMIN", "USER"].map((role) => (
                    <label key={role} style={{ marginRight: "10px" }}>
                      <input
                        type="checkbox"
                        checked={isRoleChecked(role)}
                        onChange={(e) =>
                          handleRoleToggle(user.id, role, e.target.checked)
                        }
                      />
                      {role}
                    </label>
                  ))}
                </td>
                <td data-label="Azioni">
                  <Button
                    onClick={() => handleSaveRoles(user.id)}
                    disabled={!rolesUpdates[user.id]}
                    className="p-2 m-1"
                  >
                    Salva Ruoli
                  </Button>
                  <Button onClick={() => handleDeleteUser(user.id)}>
                    Elimina
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagement
