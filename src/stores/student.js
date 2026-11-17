import { defineStore } from 'pinia'
import studentService from '../services/studentService'

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [],
    student: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      perPage: 10,
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStudents(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await studentService.getAll(params)
        // Handle paginated or plain array response
        if (response.data && Array.isArray(response.data.data)) {
          this.students = response.data.data
          this.pagination = {
            currentPage: response.data.current_page || 1,
            totalPages: response.data.last_page || 1,
            total: response.data.total || response.data.data.length,
            perPage: response.data.per_page || 10,
          }
        } else if (Array.isArray(response.data)) {
          this.students = response.data
          this.pagination.total = response.data.length
        } else if (Array.isArray(response)) {
          this.students = response
          this.pagination.total = response.length
        } else {
          this.students = response.data || []
        }
        return response
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch students list'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchStudent(id) {
      this.loading = true
      this.error = null
      try {
        const response = await studentService.getById(id)
        this.student = response.data || response
        return this.student
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch student details'
        throw err
      } finally {
        this.loading = false
      }
    },

    async createStudent(studentData) {
      this.loading = true
      this.error = null
      try {
        const response = await studentService.create(studentData)
        const newStudent = response.data || response
        this.students.unshift(newStudent)
        return newStudent
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create student'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateStudent(id, studentData) {
      this.loading = true
      this.error = null
      try {
        const response = await studentService.update(id, studentData)
        const updated = response.data || response
        const index = this.students.findIndex((s) => s.id === parseInt(id))
        if (index !== -1) {
          this.students[index] = { ...this.students[index], ...updated }
        }
        this.student = updated
        return updated
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update student'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteStudent(id) {
      this.loading = true
      this.error = null
      try {
        await studentService.delete(id)
        this.students = this.students.filter((s) => s.id !== parseInt(id))
        this.pagination.total = Math.max(0, this.pagination.total - 1)
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete student'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
