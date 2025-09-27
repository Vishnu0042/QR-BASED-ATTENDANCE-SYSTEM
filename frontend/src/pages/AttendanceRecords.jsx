import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  BarChart3, 
  Download, 
  Calendar,
  Filter,
  Search,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  FileText
} from 'lucide-react'

const AttendanceRecords = () => {
  const [searchParams] = useSearchParams()
  const [selectedCourse, setSelectedCourse] = useState(searchParams.get('course') || '')
  const [dateRange, setDateRange] = useState('month')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('overview') // 'overview', 'detailed', 'student'

  // Mock data - replace with Firebase data later
  const courses = [
    { code: 'CS101', name: 'Introduction to Programming' },
    { code: 'CS201', name: 'Data Structures' },
    { code: 'CS301', name: 'Database Systems' }
  ]

  const attendanceOverview = {
    'CS101': {
      totalClasses: 24,
      averageAttendance: 85,
      trend: '+5%',
      lastClass: { date: '2024-03-15', attendance: 42, total: 45 }
    },
    'CS201': {
      totalClasses: 20,
      averageAttendance: 92,
      trend: '+2%',
      lastClass: { date: '2024-03-14', attendance: 36, total: 38 }
    },
    'CS301': {
      totalClasses: 18,
      averageAttendance: 78,
      trend: '-3%',
      lastClass: { date: '2024-03-13', attendance: 34, total: 42 }
    }
  }

  const detailedRecords = [
    {
      id: 1,
      date: '2024-03-15',
      course: 'CS101',
      time: '09:00 AM',
      present: 42,
      total: 45,
      percentage: 93,
      method: 'QR Code'
    },
    {
      id: 2,
      date: '2024-03-14',
      course: 'CS201',
      time: '11:00 AM',
      present: 36,
      total: 38,
      percentage: 95,
      method: 'QR Code'
    },
    {
      id: 3,
      date: '2024-03-13',
      course: 'CS301',
      time: '02:00 PM',
      present: 34,
      total: 42,
      percentage: 81,
      method: 'Manual'
    },
    {
      id: 4,
      date: '2024-03-12',
      course: 'CS101',
      time: '09:00 AM',
      present: 40,
      total: 45,
      percentage: 89,
      method: 'QR Code'
    }
  ]

  const studentRecords = [
    {
      id: 'STU001',
      name: 'John Doe',
      rollNo: '2021CS001',
      totalClasses: 24,
      attended: 22,
      percentage: 92,
      trend: 'up'
    },
    {
      id: 'STU002',
      name: 'Jane Smith',
      rollNo: '2021CS002',
      totalClasses: 24,
      attended: 20,
      percentage: 83,
      trend: 'down'
    },
    {
      id: 'STU003',
      name: 'Mike Johnson',
      rollNo: '2021CS003',
      totalClasses: 24,
      attended: 24,
      percentage: 100,
      trend: 'up'
    }
  ]

  const filteredRecords = detailedRecords.filter(record => {
    const matchesCourse = !selectedCourse || record.course === selectedCourse
    return matchesCourse
  })

  const filteredStudents = studentRecords.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up' || trend.startsWith('+')) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const exportData = (format) => {
    // Implement export functionality
    console.log(`Exporting data as ${format}`)
    // Here you would generate and download the file
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
            <p className="text-gray-600 mt-1">
              View and analyze attendance data across all courses
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => exportData('csv')}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => exportData('pdf')}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and View Mode */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Course Filter */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>

            {/* Date Range Filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="semester">Current Semester</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'overview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'detailed'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Detailed
            </button>
            <button
              onClick={() => setViewMode('student')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'student'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Students
            </button>
          </div>
        </div>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(attendanceOverview).map(([courseCode, data]) => (
            <div key={courseCode} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{courseCode}</h3>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(data.trend)}
                  <span className={`text-sm font-medium ${
                    data.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.trend}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Average Attendance</p>
                  <p className={`text-2xl font-bold ${getAttendanceColor(data.averageAttendance)}`}>
                    {data.averageAttendance}%
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Classes</p>
                    <p className="font-semibold text-gray-900">{data.totalClasses}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Class</p>
                    <p className="font-semibold text-gray-900">
                      {data.lastClass.attendance}/{data.lastClass.total}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(data.lastClass.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Mode */}
      {viewMode === 'detailed' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Detailed Attendance Records</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">{record.time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{record.course}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {record.present}/{record.total}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.percentage >= 90 ? 'bg-green-100 text-green-800' :
                        record.percentage >= 75 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{record.method}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more data.</p>
            </div>
          )}
        </div>
      )}

      {/* Student Mode */}
      {viewMode === 'student' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Student Attendance</h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.rollNo}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Classes Attended</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {student.attended}/{student.totalClasses}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Percentage</p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-semibold ${getAttendanceColor(student.percentage)}`}>
                          {student.percentage}%
                        </span>
                        {getTrendIcon(student.trend)}
                      </div>
                    </div>

                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search term.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AttendanceRecords