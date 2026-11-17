import api from './api'

export default {
  getAll(params = {}) {
    return api.get('/teachers', { params })
  },

  getById(id) {
    return api.get(`/teachers/${id}`)
  },

  create(data) {
    return api.post('/teachers', data)
  },

  update(id, data) {
    return api.put(`/teachers/${id}`, data)
  },

  delete(id) {
    return api.delete(`/teachers/${id}`)
  },
}
