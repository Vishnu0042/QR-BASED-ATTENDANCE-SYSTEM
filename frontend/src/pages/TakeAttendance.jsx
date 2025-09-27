import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
// import QRCode from 'qrcode.react'
import { 
  QrCode, 
  Users, 
  Clock, 
  Calendar,
  MapPin,
  RefreshCw,
  Check,
  X,
  Search,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

const TakeAttendance = () => {
  const [searchParams] = useSearchParams()
  const [selectedCourse, setSelectedCourse] = useState('')
  const [attendanceMode, setAttendanceMode] = useState('qr') // 'qr' or 'manual'
  const [qrData, setQrData] = useState('')
  const [sessionStarted, setSessionStarted] = useState(false)
  const [attendanceData, setAttendanceData] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data - replace with Firebase data later
  const courses = [
    { code: 'CS101', name: 'Introduction to Programming', students: 45 },
    { code: 'CS201', name: 'Data Structures', students: 38 },
    { code: 'CS301', name: 'Database Systems', students: 42 }
  ]

  const students = [
    { id: 'STU001', name: 'John Doe', rollNo: '2021CS001', email: 'john@student.edu' },
    { id: 'STU002', name: 'Jane Smith', rollNo: '2021CS002', email: 'jane@student.edu' },
    { id: 'STU003', name: 'Mike Johnson', rollNo: '2021CS003', email: 'mike@student.edu' },
    { id: 'STU004', name: 'Sarah Wilson', rollNo: '2021CS004', email: 'sarah@student.edu' },
    { id: 'STU005', name: 'David Brown', rollNo: '2021CS005', email: 'david@student.edu' }
  ]

  // Set default course from URL params
  useEffect(() => {
    const courseParam = searchParams.get('course')
    if (courseParam) {
      setSelectedCourse(courseParam)
    }
  }, [searchParams])

  // Generate QR code data
  const generateQRData = () => {
    const sessionId = `${selectedCourse}-${Date.now()}`
    const qrData = {
      sessionId,
      courseCode: selectedCourse,
      timestamp: new Date().toISOString(),
      location: getCurrentLocation() // You can implement geolocation
    }
    return JSON.stringify(qrData)
  }

  const getCurrentLocation = () => {
    // Mock location - implement actual geolocation if needed
    return 'Room-101, CS Building'
  }

  const startAttendanceSession = () => {
    if (!selectedCourse) {
      toast.error('Please select a course first')
      return
    }

    const newQrData = generateQRData()
    setQrData(newQrData)
    setSessionStarted(true)
    
    // Initialize attendance data for all students
    const initialData = {}
    students.forEach(student => {
      initialData[student.id] = 'absent'
    })
    setAttendanceData(initialData)
    
    toast.success('Attendance session started!')
  }

  const refreshQRCode = () => {
    const newQrData = generateQRData()
    setQrData(newQrData)
    toast.success('QR Code refreshed!')
  }

  const toggleStudentAttendance = (studentId) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }))
  }

  const submitAttendance = () => {
    if (!sessionStarted) {
      toast.error('Please start an attendance session first')
      return
    }

    const presentCount = Object.values(attendanceData).filter(status => status === 'present').length
    const totalStudents = students.length
    
    // Here you would save to Firebase
    console.log('Attendance data:', attendanceData)
    
    toast.success(`Attendance saved! ${presentCount}/${totalStudents} students present`)
    
    // Reset session
    setSessionStarted(false)
    setQrData('')
    setAttendanceData({})
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'present' && attendanceData[student.id] === 'present') ||
                         (filterStatus === 'absent' && attendanceData[student.id] !== 'present')
    return matchesSearch && matchesFilter
  })

  const presentCount = Object.values(attendanceData).filter(status => status === 'present').length
  const totalStudents = students.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Take Attendance</h1>
        <p className="text-gray-600 mt-1">
          Record student attendance using QR codes or manual entry
        </p>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course) => (
            <button
              key={course.code}
              onClick={() => setSelectedCourse(course.code)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedCourse === course.code
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-medium">{course.code}</h3>
              <p className="text-sm text-gray-600">{course.name}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                {course.students} students
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <>
          {/* Session Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Session Details</h2>
              <div className="flex space-x-2">
                <select
                  value={attendanceMode}
                  onChange={(e) => setAttendanceMode(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  disabled={sessionStarted}
                >
                  <option value="qr">QR Code Mode</option>
                  <option value="manual">Manual Mode</option>
                </select>
                {!sessionStarted ? (
                  <button
                    onClick={startAttendanceSession}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Start Session</span>
                  </button>
                ) : (
                  <button
                    onClick={submitAttendance}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Check className="h-4 w-4" />
                    <span>Submit Attendance</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{getCurrentLocation()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span>{selectedCourse}</span>
              </div>
            </div>

            {sessionStarted && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Session Active</p>
                    <p className="text-sm text-blue-700">
                      {presentCount}/{totalStudents} students marked present
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">
                      {Math.round((presentCount / totalStudents) * 100) || 0}%
                    </div>
                    <div className="text-sm text-blue-700">Attendance</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Mode */}
          {sessionStarted && attendanceMode === 'qr' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">QR Code for Students</h2>
                <button
                  onClick={refreshQRCode}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh QR</span>
                </button>
              </div>

              <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-8 border-2 border-gray-200 rounded-lg">
                    {/* <QRCode
                      value={qrData}
                      size={200}
                      level="M"
                      includeMargin={true}
                    /> */}
                    <div className="w-[200px] h-[200px] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">QR Code Placeholder</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center max-w-xs">
                    Students should scan this QR code with their mobile app to mark attendance
                  </p>
                </div>

                {/* Instructions */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-4">Instructions for Students:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start space-x-2">
                      <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                      <span>Open the QR Attendance mobile app</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                      <span>Tap the "Scan QR" button</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                      <span>Point camera at the QR code displayed above</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">4</span>
                      <span>Wait for confirmation message</span>
                    </li>
                  </ul>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> The QR code expires every 5 minutes for security. 
                      Refresh it if students are having trouble scanning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manual Mode */}
          {sessionStarted && attendanceMode === 'manual' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Manual Attendance</h2>
                <div className="flex space-x-4">
                  {/* Search */}
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
                  
                  {/* Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Students</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.rollNo}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleStudentAttendance(student.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                        attendanceData[student.id] === 'present'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {attendanceData[student.id] === 'present' ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Present</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          <span>Absent</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No students found matching your criteria</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TakeAttendance