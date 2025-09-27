import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../config/firebase'

// Get all users by role
export const getUsersByRole = async (role) => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('role', '==', role))
    const querySnapshot = await getDocs(q)
    
    const users = []
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, data: users }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: error.message }
  }
}

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    
    if (userDoc.exists()) {
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } }
    } else {
      return { success: false, error: 'User not found' }
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false, error: error.message }
  }
}

// Get courses by faculty ID
export const getCoursesByFaculty = async (facultyId) => {
  try {
    const coursesRef = collection(db, 'courses')
    const q = query(coursesRef, where('facultyId', '==', facultyId))
    const querySnapshot = await getDocs(q)
    
    const courses = []
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, data: courses }
  } catch (error) {
    console.error('Error fetching courses:', error)
    return { success: false, error: error.message }
  }
}

// Get all courses
export const getAllCourses = async () => {
  try {
    const coursesRef = collection(db, 'courses')
    const querySnapshot = await getDocs(coursesRef)
    
    const courses = []
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, data: courses }
  } catch (error) {
    console.error('Error fetching courses:', error)
    return { success: false, error: error.message }
  }
}

// Get course by ID
export const getCourseById = async (courseId) => {
  try {
    const courseDoc = await getDoc(doc(db, 'courses', courseId))
    
    if (courseDoc.exists()) {
      return { success: true, data: { id: courseDoc.id, ...courseDoc.data() } }
    } else {
      return { success: false, error: 'Course not found' }
    }
  } catch (error) {
    console.error('Error fetching course:', error)
    return { success: false, error: error.message }
  }
}

// Get attendance records by course
export const getAttendanceRecordsByCourse = async (courseId) => {
  try {
    const attendanceRef = collection(db, 'attendanceRecords')
    const q = query(
      attendanceRef, 
      where('courseId', '==', courseId),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const records = []
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, data: records }
  } catch (error) {
    console.error('Error fetching attendance records:', error)
    return { success: false, error: error.message }
  }
}

// Get attendance records by faculty
export const getAttendanceRecordsByFaculty = async (facultyId) => {
  try {
    const attendanceRef = collection(db, 'attendanceRecords')
    const q = query(
      attendanceRef, 
      where('facultyId', '==', facultyId),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const records = []
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, data: records }
  } catch (error) {
    console.error('Error fetching attendance records:', error)
    return { success: false, error: error.message }
  }
}

// Get recent attendance records (for dashboard)
export const getRecentAttendanceRecords = async (facultyId, limitCount = 5) => {
  try {
    const attendanceRef = collection(db, 'attendanceRecords')
    const q = query(
      attendanceRef, 
      where('facultyId', '==', facultyId),
      orderBy('date', 'desc'),
      limit(limitCount)
    )
    const querySnapshot = await getDocs(q)
    
    const records = []
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, data: records }
  } catch (error) {
    console.error('Error fetching recent attendance records:', error)
    return { success: false, error: error.message }
  }
}

// Calculate attendance statistics
export const calculateAttendanceStats = (attendanceRecords, courses) => {
  const stats = {
    totalClasses: attendanceRecords.length,
    totalStudents: 0,
    averageAttendance: 0,
    courseStats: {}
  }

  if (attendanceRecords.length === 0) {
    return stats
  }

  let totalPresentSum = 0
  let totalStudentsSum = 0

  // Calculate stats by course
  courses.forEach(course => {
    const courseRecords = attendanceRecords.filter(record => record.courseId === course.courseId)
    const enrolledCount = course.enrolledStudents ? course.enrolledStudents.length : 0
    
    let coursePresentSum = 0
    let courseTotalClasses = courseRecords.length

    courseRecords.forEach(record => {
      const presentCount = Object.values(record.students || {})
        .filter(student => student.status === 'present').length
      
      coursePresentSum += presentCount
      totalPresentSum += presentCount
      totalStudentsSum += enrolledCount
    })

    const courseAverage = courseTotalClasses > 0 
      ? Math.round((coursePresentSum / (courseTotalClasses * enrolledCount)) * 100)
      : 0

    stats.courseStats[course.courseId] = {
      courseName: course.courseName,
      courseCode: course.courseCode,
      totalClasses: courseTotalClasses,
      enrolledStudents: enrolledCount,
      averageAttendance: courseAverage,
      lastClassAttendance: courseRecords.length > 0 
        ? Object.values(courseRecords[0].students || {})
            .filter(student => student.status === 'present').length
        : 0
    }
  })

  // Calculate overall stats
  stats.totalStudents = Math.max(...courses.map(c => c.enrolledStudents?.length || 0))
  stats.averageAttendance = totalStudentsSum > 0 
    ? Math.round((totalPresentSum / totalStudentsSum) * 100)
    : 0

  return stats
}