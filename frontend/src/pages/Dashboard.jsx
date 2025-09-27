import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  QrCode, 
  Users, 
  BarChart3, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  // Mock data - replace with Firebase data later
  const todaysClasses = [
    {
      id: 1,
      courseCode: 'CS101',
      courseName: 'Introduction to Programming',
      time: '09:00 AM',
      room: 'Lab-101',
      status: 'upcoming'
    },
    {
      id: 2,
      courseCode: 'CS201',
      courseName: 'Data Structures',
      time: '11:00 AM',
      room: 'Room-205',
      status: 'completed'
    },
    {
      id: 3,
      courseCode: 'CS301',
      courseName: 'Database Systems',
      time: '02:00 PM',
      room: 'Lab-301',
      status: 'upcoming'
    }
  ]

  const courses = [
    {
      code: 'CS101',
      name: 'Introduction to Programming',
      students: 45,
      attendance: 85
    },
    {
      code: 'CS201',
      name: 'Data Structures',
      students: 38,
      attendance: 92
    },
    {
      code: 'CS301',
      name: 'Database Systems',
      students: 42,
      attendance: 78
    }
  ]

  const stats = [
    {
      title: 'Total Students',
      value: '125',
      icon: Users,
      color: 'bg-blue-500',
      change: '+5%'
    },
    {
      title: 'Classes Today',
      value: '3',
      icon: Calendar,
      color: 'bg-green-500',
      change: 'On Schedule'
    },
    {
      title: 'Avg Attendance',
      value: '85%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+2%'
    },
    {
      title: 'Courses',
      value: '3',
      icon: BookOpen,
      color: 'bg-orange-500',
      change: 'Active'
    }
  ]

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {currentDate} • {currentTime}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Faculty ID</p>
            <p className="font-semibold text-gray-900">{user?.facultyId}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className="ml-2 text-xs text-green-600 font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Today's Classes</h2>
            <Link
              to="/courses"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              View all courses →
            </Link>
          </div>
          <div className="space-y-4">
            {todaysClasses.map((class_) => (
              <div
                key={class_.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    class_.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {class_.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{class_.courseCode}</h3>
                    <p className="text-sm text-gray-600">{class_.courseName}</p>
                    <p className="text-xs text-gray-500">{class_.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{class_.time}</p>
                  <p className={`text-sm ${
                    class_.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {class_.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/take-attendance"
              className="w-full bg-indigo-600 text-white rounded-lg p-4 flex items-center space-x-3 hover:bg-indigo-700 transition-colors"
            >
              <QrCode className="h-6 w-6" />
              <span className="font-medium">Take Attendance</span>
            </Link>
            
            <Link
              to="/attendance-records"
              className="w-full bg-gray-100 text-gray-700 rounded-lg p-4 flex items-center space-x-3 hover:bg-gray-200 transition-colors"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium">View Reports</span>
            </Link>

            <Link
              to="/courses"
              className="w-full bg-gray-100 text-gray-700 rounded-lg p-4 flex items-center space-x-3 hover:bg-gray-200 transition-colors"
            >
              <BookOpen className="h-6 w-6" />
              <span className="font-medium">Manage Courses</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Courses Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Course Overview</h2>
          <Link
            to="/courses"
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Manage courses →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{course.code}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.attendance >= 90 ? 'bg-green-100 text-green-800' :
                  course.attendance >= 75 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.attendance}% attendance
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{course.name}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{course.students} students</span>
                <Link
                  to={`/take-attendance?course=${course.code}`}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Take Attendance
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard