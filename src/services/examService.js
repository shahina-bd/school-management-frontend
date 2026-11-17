import api from './api'

export default {
  getAll(params = {}) {
    return api.get('/exams', { params })
  },
  getById(id) {
    return api.get(`/exams/${id}`)
  },
  create(data) {
    return api.post('/exams', data)
  },
  update(id, data) {
    return api.put(`/exams/${id}`, data)
  },
  delete(id) {
    return api.delete(`/exams/${id}`)
  },
}
