import api from './api'

export default {
  getAll(params = {}) {
    return api.get('/expenses', { params })
  },
  getById(id) {
    return api.get(`/expenses/${id}`)
  },
  create(data) {
    return api.post('/expenses', data)
  },
  update(id, data) {
    return api.put(`/expenses/${id}`, data)
  },
  delete(id) {
    return api.delete(`/expenses/${id}`)
  },
}
