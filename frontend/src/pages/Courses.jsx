import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  QrCode, 
  Search, 
  Filter,
  Eye,
  BarChart3,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react'

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')

  // Mock data - replace with Firebase data later
  const courses = [
    {
      id: 1,
      code: 'CS101',
      name: 'Introduction to Programming',
      department: 'Computer Science',
      semester: 'Fall 2024',
      students: 45,
      schedule: [
        { day: 'Monday', time: '09:00 AM', room: 'Lab-101' },
        { day: 'Wednesday', time: '09:00 AM', room: 'Lab-101' },
        { day: 'Friday', time: '09:00 AM', room: 'Lab-101' }
      ],
      attendance: {
        average: 85,
        lastClass: 42,
        trend: '+2%'
      }
    },
    {
      id: 2,
      code: 'CS201',
      name: 'Data Structures and Algorithms',
      department: 'Computer Science',
      semester: 'Fall 2024',
      students: 38,
      schedule: [
        { day: 'Tuesday', time: '11:00 AM', room: 'Room-205' },
        { day: 'Thursday', time: '11:00 AM', room: 'Room-205' }
      ],
      attendance: {
        average: 92,
        lastClass: 36,
        trend: '+5%'
      }
    },
    {
      id: 3,
      code: 'CS301',
      name: 'Database Management Systems',
      department: 'Computer Science',
      semester: 'Fall 2024',
      students: 42,
      schedule: [
        { day: 'Monday', time: '02:00 PM', room: 'Lab-301' },
        { day: 'Wednesday', time: '02:00 PM', room: 'Lab-301' }
      ],
      attendance: {
        average: 78,
        lastClass: 34,
        trend: '-3%'
      }
    }
  ]

  const departments = ['All Departments', 'Computer Science', 'Mathematics', 'Physics']

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !filterDepartment || filterDepartment === 'All Departments' || 
                             course.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100'
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getTrendColor = (trend) => {
    if (trend.startsWith('+')) return 'text-green-600'
    if (trend.startsWith('-')) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-1">
              Manage your courses and view student enrollment
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search courses by code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="sm:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Course Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.code}</h3>
                    <p className="text-gray-600">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.department} • {course.semester}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">{course.students}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Avg Attendance</p>
                  <div className="flex items-center justify-center mt-1">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getAttendanceColor(course.attendance.average)}`}>
                      {course.attendance.average}%
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Last Class</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {course.attendance.lastClass}/{course.students}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Trend</p>
                  <p className={`text-lg font-semibold mt-1 ${getTrendColor(course.attendance.trend)}`}>
                    {course.attendance.trend}
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Schedule</h4>
              <div className="space-y-2">
                {course.schedule.map((session, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{session.day}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{session.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{session.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6">
              <div className="flex space-x-3">
                <Link
                  to={`/take-attendance?course=${course.code}`}
                  className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Take Attendance</span>
                </Link>
                <Link
                  to={`/attendance-records?course=${course.code}`}
                  className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>View Reports</span>
                </Link>
                <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-200 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">
            {searchTerm || filterDepartment ? 'Try adjusting your search or filters.' : 'You don\'t have any courses assigned yet.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Courses