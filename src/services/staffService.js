import api from './api'

export default {
  getAll(params = {}) {
    return api.get('/staff', { params })
  },

  getById(id) {
    return api.get(`/staff/${id}`)
  },

  create(data) {
    return api.post('/staff', data)
  },

  update(id, data) {
    return api.put(`/staff/${id}`, data)
  },

  delete(id) {
    return api.delete(`/staff/${id}`)
  },
}
