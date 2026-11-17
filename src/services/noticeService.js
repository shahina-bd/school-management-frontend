import api from './api'

export default {
  getAll(params = {}) {
    return api.get('/notices', { params })
  },
  getById(id) {
    return api.get(`/notices/${id}`)
  },
  create(data) {
    return api.post('/notices', data)
  },
  update(id, data) {
    return api.put(`/notices/${id}`, data)
  },
  delete(id) {
    return api.delete(`/notices/${id}`)
  },
}
