import api from './api'

export default {
  getAll(params = {}) {
    return api.get('/subjects', { params })
  },

  getById(id) {
    return api.get(`/subjects/${id}`)
  },

  create(data) {
    return api.post('/subjects', data)
  },

  update(id, data) {
    return api.put(`/subjects/${id}`, data)
  },

  delete(id) {
    return api.delete(`/subjects/${id}`)
  },
}
