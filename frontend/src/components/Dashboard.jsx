import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCoursesByFaculty, getAttendanceRecordsByFaculty, calculateAttendanceStats } from '../services/dataService'
import { BookOpen, Users, Calendar, TrendingUp, QrCode, Clock, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [courses, setCourses] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user || !user.facultyId) {
      setError('User data not available')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Load faculty courses
      const coursesResult = await getCoursesByFaculty(user.facultyId)
      if (coursesResult.success) {
        setCourses(coursesResult.data)
      } else {
        console.error('Failed to load courses:', coursesResult.error)
      }

      // Load attendance records
      const attendanceResult = await getAttendanceRecordsByFaculty(user.facultyId)
      if (attendanceResult.success) {
        setAttendanceRecords(attendanceResult.data)
        
        // Calculate statistics
        if (coursesResult.success) {
          const calculatedStats = calculateAttendanceStats(attendanceResult.data, coursesResult.data)
          setStats(calculatedStats)
        }
      } else {
        console.error('Failed to load attendance records:', attendanceResult.error)
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const getAttendanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendColor = (trend) => {
    if (!trend) return 'text-gray-600'
    return trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.displayName || user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                <p className="text-xs text-gray-500">{user?.department}</p>
                <p className="text-xs text-gray-500">ID: {user?.facultyId}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                    <dd className="text-lg font-medium text-gray-900">{courses.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Classes Conducted</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats?.totalClasses || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Attendance</dt>
                    <dd className={`text-lg font-medium ${getAttendanceColor(stats?.averageAttendance || 0)}`}>
                      {stats?.averageAttendance || 0}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/take-attendance"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Take Attendance
              </Link>
              <Link
                to="/courses"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Courses
              </Link>
              <Link
                to="/attendance-records"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Records
              </Link>
            </div>
          </div>
        </div>

        {/* Course Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Course Overview</h3>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => {
                  const courseStats = stats?.courseStats[course.courseId]
                  return (
                    <div key={course.courseId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{course.courseName}</h4>
                          <p className="text-sm text-gray-500">
                            {course.courseCode} • {course.department}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {course.enrolledStudents?.length || 0} students
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Avg Attendance</p>
                          <p className={`font-medium ${getAttendanceColor(courseStats?.averageAttendance || 0)}`}>
                            {courseStats?.averageAttendance || 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Classes Conducted</p>
                          <p className="font-medium text-gray-900">{courseStats?.totalClasses || 0}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link
                          to={`/take-attendance?course=${course.courseId}`}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          <QrCode className="h-4 w-4 mr-1" />
                          Take Attendance
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No courses assigned yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard