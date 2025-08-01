import { useState, useEffect, useRef } from 'react';
import {
  Home,
  User,
  CalendarDays,
  MessagesSquare,
  ClipboardList,
  Phone,
  LogOut,
  Menu,
  X,
  RefreshCcw,
  Eye,
  EyeOff,
  Briefcase,
  Building,
  Calendar,
  School,
  GraduationCap,
  Check,
  Ban,
  MessageCircle,
  Search,
} from 'lucide-react';

// Main application component
export default function App() {
  // State to manage the application's view: 'landing', 'teacherLogin', 'studentLogin', 'dashboard', or 'studentDashboard'
  const [appState, setAppState] = useState('landing');
  const [userName, setUserName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [highlightedSlots, setHighlightedSlots] = useState({});
  const [requests, setRequests] = useState([
    { id: 1, studentRegNo: '21BCE1234', comment: 'Doubt in MAT2002', status: 'pending' },
    { id: 2, studentRegNo: '21BCE5678', comment: 'Request to discuss project', status: 'pending' },
  ]);
  const [studentMessages, setStudentMessages] = useState([
    { id: 1, teacherName: 'Dr. Jane Doe', message: 'Please see me during my office hours this Friday.' },
  ]);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  
  const sidebarRef = useRef(null);

  // This function would handle actual login logic, including validation
  const handleTeacherLogin = (employeeId, password, captcha) => {
    console.log(`Attempting login for Employee ID: ${employeeId}`);
    setAppState('teacherDashboard');
    setUserName('Dr. Jane Doe'); // Placeholder name
    setCurrentPage('teacherDashboard');
  };

  const handleStudentLogin = (regNo, password, captcha) => {
    console.log(`Attempting login for Student ID: ${regNo}`);
    setAppState('studentDashboard');
    setUserName('Student Name'); // Placeholder name
    setCurrentPage('studentDashboard');
  };

  const handleLogout = () => {
    setAppState('landing'); // Return to the landing page on logout
    setUserName('');
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Function to get initials from the user's full name
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return parts.map(part => part.charAt(0)).join('').toUpperCase();
  };

  // Effect to handle clicks outside the sidebar on mobile to close it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the sidebar is open and the click is outside the sidebar
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Also check if the clicked element is not the mobile menu button
        if (!event.target.closest('.mobile-menu-button')) {
            setIsSidebarOpen(false);
        }
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  // Check for new messages on student dashboard
  useEffect(() => {
    if (appState === 'studentDashboard' && studentMessages.length > 0) {
      setShowNewMessageAlert(true);
    }
  }, [appState, studentMessages]);
  
  if (appState === 'landing') {
    return (
        <LandingPage 
            onSelectTeacher={() => setAppState('teacherLogin')} 
            onSelectStudent={() => setAppState('studentLogin')} 
        />
    );
  }

  if (appState === 'teacherLogin') {
    return <TeacherLoginPage onLogin={handleTeacherLogin} />;
  }

  if (appState === 'studentLogin') {
    return <StudentLoginPage onLogin={handleStudentLogin} />;
  }

  // Tailwind CSS classes for responsive design
  const sidebarClass = isSidebarOpen
    ? 'transform translate-x-0'
    : 'transform -translate-x-full lg:translate-x-0';

  const mainContentClass = isSidebarOpen
    ? 'lg:ml-64'
    : 'lg:ml-64';

  const handleRequestAction = (requestId, action) => {
    setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    console.log(`Request ${requestId} was ${action}.`);
  };

  // Render different pages based on appState and currentPage
  const renderCurrentPage = () => {
    if (appState === 'studentDashboard') {
        switch(currentPage) {
            case 'studentInfo': return <StudentInfoPage userName={userName} />;
            case 'meetView': return <MeetViewPage />;
            case 'studentComments': return <StudentCommentsPage messages={studentMessages} />;
            case 'ctsContact': return <CTSContactPage />;
            default: return <StudentDashboardPage userName={userName} />;
        }
    } else {
        switch (currentPage) {
            case 'teacherInfo': return <TeacherInfoPage userName={userName} />;
            case 'timetable': return <TimeTableViewPage highlightedSlots={highlightedSlots} setHighlightedSlots={setHighlightedSlots} />;
            case 'communication': return <CommunicationPage />;
            case 'requestView': return <RequestViewPage requests={requests} onRequestAction={handleRequestAction} />;
            case 'ctsContact': return <CTSContactPage />;
            default: return <TeacherDashboardPage userName={userName} highlightedSlots={highlightedSlots} />;
        }
    }
  };

  const dashboardSidebar = appState === 'studentDashboard' ? (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        <li>
          <a
            href="#"
            onClick={() => { setCurrentPage('studentInfo'); setIsSidebarOpen(false); }}
            className="flex items-center p-3 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            <User size={20} className="mr-3 text-lime-500" />
            Student Info
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => { setCurrentPage('meetView'); setIsSidebarOpen(false); }}
            className="flex items-center p-3 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            <MessagesSquare size={20} className="mr-3 text-lime-500" />
            Meet View
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => { setCurrentPage('studentComments'); setIsSidebarOpen(false); }}
            className="flex items-center p-3 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            <MessageCircle size={20} className="mr-3 text-lime-500" />
            Comments
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => { setCurrentPage('ctsContact'); setIsSidebarOpen(false); }}
            className="flex items-center p-3 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            <Phone size={20} className="mr-3 text-lime-500" />
            CTS Office Info
          </a>
        </li>
      </ul>
    </nav>
  ) : (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        <li>
          <a
            href="#"
            onClick={() => { setCurrentPage('teacherInfo'); setIsSidebarOpen(false); }}
            className="flex items-center p-3 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            <User size={20} className="mr-3 text-lime-500" />
            Teacher Info
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => { setCurrentPage('timetable'); setIsSidebarOpen(false); }}
            className="flex items-center p-3 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            <CalendarDays size={20} className="mr-3 text-lime-500" />
            Time Table View
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => { setCurrentPage('communication'); setIsSidebarOpen(false); }}
            className="flex items-center p-3 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            <MessagesSquare size={20} className="mr-3 text-lime-500" />
            Communication
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => { setCurrentPage('requestView'); setIsSidebarOpen(false); }}
            className="flex items-center p-3 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            <ClipboardList size={20} className="mr-3 text-lime-500" />
            Request View
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => { setCurrentPage('ctsContact'); setIsSidebarOpen(false); }}
            className="flex items-center p-3 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            <Phone size={20} className="mr-3 text-lime-500" />
            CTS Office Contact
          </a>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="flex bg-white font-sans text-gray-800 antialiased min-h-screen">
      {/* Sign Out Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 text-center">
            <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={cancelLogout}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="mobile-menu-button fixed top-4 left-4 z-50 p-2 text-white bg-lime-500 rounded-full lg:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-600"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Left-side menu */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-100 transition-transform duration-300 ease-in-out border-r border-gray-200 shadow-lg ${sidebarClass}`}
      >
        <div className="flex items-center justify-center p-4 h-16 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-lime-600 tracking-wide">
            Meet Me
          </h2>
        </div>
        {dashboardSidebar}
      </aside>

      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${mainContentClass}`}>
        {/* Header - Top bar */}
        <header className="flex items-center justify-between h-16 px-6 bg-lime-500 text-white shadow-md">
          {/* Left section of header */}
          <div className="flex items-center space-x-4">
            {/* VIT Logo and Home Button */}
            <div className="flex items-center space-x-2">
                <img
                    src="https://placehold.co/40x40/ffffff/000000?text=V"
                    alt="VIT Logo"
                    className="h-10 w-10 rounded-full"
                />
                <span className="font-semibold text-lg hidden md:block">
                    VIT (Bhopal Campus)
                </span>
            </div>
            <a href="#" onClick={() => {
                if (appState === 'studentDashboard') {
                  setCurrentPage('studentDashboard');
                } else {
                  setCurrentPage('teacherDashboard');
                }
              }} className="flex items-center justify-center p-2 rounded-full hover:bg-lime-600 transition-colors">
              <Home size={24} />
            </a>
          </div>

          {/* Right section of header */}
          <div className="flex items-center space-x-4">
            {/* User Profile and Sign Out */}
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white cursor-pointer">
                  {/* Display initials instead of a placeholder image */}
                  <span className="text-gray-800 font-bold text-sm">
                    {getInitials(userName)}
                  </span>
                </div>
                {/* Profile dropdown (can be implemented later) */}
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg hidden group-hover:block">
                  <div className="p-3">
                    <p className="font-semibold">{userName}</p>
                    <p className="text-sm text-gray-500">{appState === 'studentDashboard' ? 'Student' : 'Admin'}</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center p-2 rounded-full hover:bg-lime-600 transition-colors"
            >
              <LogOut size={24} />
            </button>
          </div>
        </header>

        {/* Main page content goes here */}
        <main className="flex-1 p-6 lg:p-10">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

// Landing Page Component
function LandingPage({ onSelectTeacher, onSelectStudent }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center mb-10">
        {/* 'M' logo for the landing page */}
        <div className="flex items-center justify-center w-24 h-24 mb-4 rounded-full bg-lime-500">
            <span className="text-6xl font-bold text-white tracking-widest">M</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide mb-2">Welcome to Meet Me</h1>
        <p className="text-lg font-semibold text-gray-500">VIT (Bhopal Campus)</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Teacher Icon */}
        <div 
          onClick={onSelectTeacher}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <School size={80} className="text-lime-500 mb-4" />
          <span className="text-xl font-semibold text-gray-700">Teacher</span>
        </div>
        {/* Student Icon */}
        <div 
          onClick={onSelectStudent}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <GraduationCap size={80} className="text-gray-400 mb-4" />
          <span className="text-xl font-semibold text-gray-700">Student</span>
        </div>
      </div>
    </div>
  );
}

// Teacher Login Page Component
function TeacherLoginPage({ onLogin }) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Function to generate a random CAPTCHA string
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha(); // Generate a CAPTCHA when the component mounts
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Case-sensitive CAPTCHA check
    if (userCaptcha === captcha) {
      onLogin(employeeId, password, userCaptcha);
    } else {
      // Replaced `alert` with a custom message for a better user experience
      // This is a browser alert for demonstration, but a modal is recommended.
      alert('Incorrect CAPTCHA. Please try again.');
      generateCaptcha(); // Refresh CAPTCHA on failure
      setUserCaptcha('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        {/* Header section with logo and title */}
        <div className="flex flex-col items-center mb-6">
          {/* 'V' logo for the login page */}
          <div className="flex items-center justify-center w-20 h-20 mb-2 rounded-full bg-lime-500">
            <span className="text-5xl font-bold text-white tracking-widest">V</span>
          </div>
          <h1 className="text-3xl font-bold text-lime-600 mb-1">Teacher Login</h1>
          <p className="text-sm font-semibold text-gray-500">VIT (Bhopal Campus)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-lime-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                CAPTCHA
              </label>
              <a href="#" className="text-sm text-lime-600 hover:underline">Forgot Password?</a>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="flex-shrink-0 w-32 h-10 bg-gray-200 rounded-lg flex items-center justify-center font-bold text-lg tracking-wider text-gray-800 select-none"
                style={{
                  textDecoration: 'line-through',
                  letterSpacing: '0.25rem',
                  fontFamily: 'monospace'
                }}
              >
                {captcha}
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                aria-label="Refresh CAPTCHA"
              >
                <RefreshCcw size={20} />
              </button>
            </div>
            <input
              type="text"
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              placeholder="Enter CAPTCHA"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-lime-500 text-white py-2.5 rounded-lg font-semibold text-lg hover:bg-lime-600 transition-colors shadow-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// Student Login Page Component
function StudentLoginPage({ onLogin }) {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Function to generate a random CAPTCHA string
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha(); // Generate a CAPTCHA when the component mounts
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Case-sensitive CAPTCHA check
    if (userCaptcha === captcha) {
      onLogin(regNo, password, userCaptcha);
    } else {
      alert('Incorrect CAPTCHA. Please try again.');
      generateCaptcha(); // Refresh CAPTCHA on failure
      setUserCaptcha('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        {/* Header section with logo and title */}
        <div className="flex flex-col items-center mb-6">
          {/* 'V' logo for the login page */}
          <div className="flex items-center justify-center w-20 h-20 mb-2 rounded-full bg-lime-500">
            <span className="text-5xl font-bold text-white tracking-widest">V</span>
          </div>
          <h1 className="text-3xl font-bold text-lime-600 mb-1">Student Login</h1>
          <p className="text-sm font-semibold text-gray-500">VIT (Bhopal Campus)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Registration ID
            </label>
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-lime-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                CAPTCHA
              </label>
              <a href="#" className="text-sm text-lime-600 hover:underline">Forgot Password?</a>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="flex-shrink-0 w-32 h-10 bg-gray-200 rounded-lg flex items-center justify-center font-bold text-lg tracking-wider text-gray-800 select-none"
                style={{
                  textDecoration: 'line-through',
                  letterSpacing: '0.25rem',
                  fontFamily: 'monospace'
                }}
              >
                {captcha}
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                aria-label="Refresh CAPTCHA"
              >
                <RefreshCcw size={20} />
              </button>
            </div>
            <input
              type="text"
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              placeholder="Enter CAPTCHA"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-lime-500 text-white py-2.5 rounded-lg font-semibold text-lg hover:bg-lime-600 transition-colors shadow-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// Teacher Dashboard Page Component
function TeacherDashboardPage({ userName, highlightedSlots }) {
  // Placeholder timetable data
  const timetable = {
    MON: { '08:30': 'A11', '10:05': 'B11', '11:40': 'C11', '13:15': 'A21', '14:50': 'A14', '16:25': 'B21', '18:00': 'C21' },
    TUE: { '08:30': 'D11', '10:05': 'E11', '11:40': 'F11', '13:15': 'D21', '14:50': 'E14', '16:25': 'E21', '18:00': 'F21' },
    WED: { '08:30': 'A12', '10:05': 'B12', '11:40': 'C12', '13:15': 'A22', '14:50': 'B14', '16:25': 'B22', '18:00': 'A24' },
    THU: { '08:30': 'D12', '10:05': 'E12', '11:40': 'F12', '13:15': 'D22', '14:50': 'F14', '16:25': 'E22', '18:00': 'F22' },
    FRI: { '08:30': 'A13', '10:05': 'B13', '11:40': 'C13', '13:15': 'A23', '14:50': 'C14', '16:25': 'B23', '18:00': 'B24' },
    SAT: { '08:30': 'D13', '10:05': 'E13', '11:40': 'F13', '13:15': 'D23', '14:50': 'D14', '16:25': 'D24', '18:00': 'E23' },
  };
  
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const getNextClass = () => {
    const now = currentDateTime;
    const currentDayIndex = now.getDay(); // Sunday is 0, Monday is 1, etc.
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const currentDay = days[currentDayIndex].toUpperCase();
    const currentTime = now.getHours() * 60 + now.getMinutes();
  
    // Combine timetable with highlighted slots for dynamic scheduling
    const activeTimetable = {};
    const timeSlots = ['08:30', '10:05', '11:40', '13:15', '14:50', '16:25', '18:00'];
    days.forEach((day) => {
      activeTimetable[day] = {};
      timeSlots.forEach((time, timeIndex) => {
        const key = `${day}-${timeIndex}`;
        if (highlightedSlots[key]) {
          activeTimetable[day][time] = timetable[day][time];
        } else if (timetable[day] && timetable[day][time] && timetable[day][time] !== 'Lunch') {
          // If not highlighted, still consider it a class
          activeTimetable[day][time] = timetable[day][time];
        }
      });
    });

    // Find the next class from the highlighted slots first
    const highlightedKeys = Object.keys(highlightedSlots);
    if (highlightedKeys.length > 0) {
      const sortedHighlightedKeys = highlightedKeys.sort((a, b) => {
        const [dayA, timeIndexA] = a.split('-');
        const [dayB, timeIndexB] = b.split('-');
        const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const timeOrder = ['08:30', '10:05', '11:40', '13:15', '14:50', '16:25', '18:00'];
        const dayDiff = dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB);
        if (dayDiff !== 0) return dayDiff;
        // Compare time indices as numbers
        return parseInt(timeIndexA, 10) - parseInt(timeIndexB, 10);
      });

      for (const key of sortedHighlightedKeys) {
        const [day, timeIndex] = key.split('-');
        const time = timeSlots[parseInt(timeIndex, 10)];
        const dayIndex = days.indexOf(day);
        
        // Calculate the full date for this potential next class
        const classDate = new Date(now);
        const currentDayOfWeek = now.getDay();
        const daysToAdd = (dayIndex - currentDayOfWeek + 7) % 7;
        classDate.setDate(now.getDate() + daysToAdd);
        const [hour, minute] = time.split(':').map(Number);
        classDate.setHours(hour, minute, 0, 0);

        // Only show if the class is in the future
        if (classDate.getTime() > now.getTime()) {
          const subject = timetable[day][time];
          return { day: day, time: time, subject: subject, date: classDate };
        }
      }
    }
    
    // If no highlighted slots or all highlighted slots are in the past, find the next class
    const daySchedule = activeTimetable[currentDay];
    if (daySchedule) {
      const sortedTimes = Object.keys(daySchedule).sort();
      for (const time of sortedTimes) {
        const [hour, minute] = time.split(':').map(Number);
        const classTime = hour * 60 + minute;
        if (classTime > currentTime) {
          const classInfo = daySchedule[time];
          if (classInfo) {
            return { day: currentDay, time: time, subject: classInfo, date: now };
          }
        }
      }
    }
  
    // If no more classes today, find the first class on the next day
    for (let i = 1; i <= 7; i++) {
      const nextDayDate = new Date(now);
      nextDayDate.setDate(now.getDate() + i);
      const nextDay = days[nextDayDate.getDay()].toUpperCase();
      const nextDaySchedule = activeTimetable[nextDay];
      if (nextDaySchedule && Object.keys(nextDaySchedule).length > 0) {
        const sortedTimes = Object.keys(nextDaySchedule).sort();
        const firstClassTime = sortedTimes[0];
        const firstClassSubject = nextDaySchedule[firstClassTime];
        return { day: nextDay, time: firstClassTime, subject: firstClassSubject, date: nextDayDate };
      }
    }
  
    return null; // No classes found for the rest of the week
  };
  
  const nextClass = getNextClass();

  const getCountdown = () => {
    if (!nextClass) return 'No upcoming classes.';

    const now = new Date();
    const nextClassDate = new Date(nextClass.date);
    const [hour, minute] = nextClass.time.split(':').map(Number);
    nextClassDate.setHours(hour, minute, 0, 0);

    const timeDiff = nextClassDate.getTime() - now.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `in ${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    if (seconds > 0) {
      return `in ${seconds} second${seconds > 1 ? 's' : ''}`;
    }
    return 'Class is starting now!';
  };

  const formattedDate = currentDateTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentDateTime.toLocaleTimeString();

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome, {userName}!
      </h1>
      <p className="text-sm font-medium text-gray-500">{formattedDate}</p>
      <p className="text-2xl font-bold text-lime-600 mb-6">{formattedTime}</p>
      
      {/* Next Class Reminder */}
      <div className="mb-6 p-4 border border-gray-300 rounded-md bg-gray-50">
        <h3 className="font-semibold text-lg mb-2">Your Next Class</h3>
        {nextClass ? (
          <div>
            <p className="text-lime-600 font-medium mb-2">
              {nextClass.subject} at {nextClass.time} on {nextClass.day}
            </p>
            <p className="text-sm text-gray-700">{getCountdown()}</p>
          </div>
        ) : (
          <p className="text-gray-500">No classes scheduled for the rest of the week.</p>
        )}
      </div>

      <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
        <h3 className="font-semibold text-lg">Quick Links</h3>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li><a href="#" className="text-lime-600 hover:underline">View New Student Requests</a></li>
          <li><a href="#" className="text-lime-600 hover:underline">Manage Teacher Timetable</a></li>
          <li><a href="#" className="text-lime-600 hover:underline">Contact CTS Office</a></li>
        </ul>
      </div>
    </div>
  );
}

// Student Dashboard Page Component
function StudentDashboardPage({ userName }) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentDateTime.toLocaleTimeString();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {userName}!</h1>
        <p className="text-sm font-medium text-gray-500">{formattedDate}</p>
        <p className="text-2xl font-bold text-lime-600 mb-6">{formattedTime}</p>
      </div>
    </div>
  );
}

// Student Info Page Component
function StudentInfoPage({ userName }) {
  const studentData = {
    name: userName,
    regNo: '21BCE1234',
    school: 'School of Computing Science and Engineering',
    year: '3rd Year',
    joiningDate: '2021-08-15',
    graduationDate: '2025-05-30',
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <User size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg font-semibold text-gray-900">{studentData.name}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <Briefcase size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Registration Number</p>
            <p className="text-lg font-semibold text-gray-900">{studentData.regNo}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <Building size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">School</p>
            <p className="text-lg font-semibold text-gray-900">{studentData.school}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <GraduationCap size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Study Year</p>
            <p className="text-lg font-semibold text-gray-900">{studentData.year}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <Calendar size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Date of Joining</p>
            <p className="text-lg font-semibold text-gray-900">{studentData.joiningDate}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <Calendar size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Graduation Date</p>
            <p className="text-lg font-semibold text-gray-900">{studentData.graduationDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Meet View Page Component
function MeetViewPage() {
  const [teacherName, setTeacherName] = useState('');
  const [requestComment, setRequestComment] = useState('');
  const [teacherInfo, setTeacherInfo] = useState(null);

  const mockTeachers = [
    { name: 'Dr. Jane Doe', employeeId: 'EMP001', cabinNumber: 'CS-405' },
    { name: 'Dr. John Smith', employeeId: 'EMP002', cabinNumber: 'CS-406' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const foundTeacher = mockTeachers.find(
      (t) => t.name.toLowerCase() === teacherName.toLowerCase()
    );
    setTeacherInfo(foundTeacher);
  };

  const handleRequest = (e) => {
    e.preventDefault();
    alert(`Meeting request sent to ${teacherInfo.name} with comment: "${requestComment}"`);
    setRequestComment('');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Meet a Teacher</h1>
      
      <form onSubmit={handleSearch} className="flex mb-6 space-x-2">
        <input
          type="text"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          placeholder="Search teacher by name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
        />
        <button
          type="submit"
          className="p-2 bg-lime-500 text-white rounded-lg shadow-md hover:bg-lime-600 transition-colors"
        >
          <Search size={24} />
        </button>
      </form>
      
      {teacherInfo && (
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Teacher Found: {teacherInfo.name}</h3>
          <p className="text-sm text-gray-600">Employee ID: {teacherInfo.employeeId}</p>
          <p className="text-sm text-gray-600">Cabin Number: {teacherInfo.cabinNumber}</p>
          
          <form onSubmit={handleRequest} className="mt-4 space-y-4">
            <div>
              <label htmlFor="request-comment" className="block text-sm font-medium text-gray-700 mb-1">
                Request a meeting
              </label>
              <textarea
                id="request-comment"
                value={requestComment}
                onChange={(e) => setRequestComment(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
                placeholder="Enter your reason for the meeting..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-lime-500 text-white font-semibold rounded-lg shadow-md hover:bg-lime-600 transition-colors"
            >
              Send Meeting Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Student Comments Page
function StudentCommentsPage({ messages }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Comments</h1>
      {messages.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
          <p>Seems like you have no new messages.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-800">From: {msg.teacherName}</p>
              <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Teacher Info Page Component
function TeacherInfoPage({ userName }) {
  // Placeholder data for the teacher
  const teacherData = {
    name: userName,
    employeeId: 'EMP12345',
    school: 'School of Computing Science and Engineering',
    phone: '+91 98765 43210',
    cabinNumber: 'CS-405',
    dateOfJoining: '2019-08-15',
    dateOfLeaving: 'N/A', // Assuming they are still employed
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Teacher Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <User size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg font-semibold text-gray-900">{teacherData.name}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <Briefcase size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Employee ID</p>
            <p className="text-lg font-semibold text-gray-900">{teacherData.employeeId}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <Building size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">School</p>
            <p className="text-lg font-semibold text-gray-900">{teacherData.school}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <Phone size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p className="text-lg font-semibold text-gray-900">{teacherData.phone}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <Home size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Cabin Number</p>
            <p className="text-lg font-semibold text-gray-900">{teacherData.cabinNumber}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <Calendar size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Date of Joining</p>
            <p className="text-lg font-semibold text-gray-900">{teacherData.dateOfJoining}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <LogOut size={24} className="text-lime-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Date of Leaving</p>
            <p className="text-lg font-semibold text-gray-900">{teacherData.dateOfLeaving}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Time Table View Page Component
function TimeTableViewPage({ highlightedSlots, setHighlightedSlots }) {
  // Hardcoded timetable data as a placeholder
  const timetable = {
    MON: {
      '08:30': 'A11', '10:05': 'B11', '11:40': 'C11', '13:15': 'A21', '14:50': 'A14', '16:25': 'B21', '18:00': 'C21'
    },
    TUE: {
      '08:30': 'D11', '10:05': 'E11', '11:40': 'F11', '13:15': 'D21', '14:50': 'E14', '16:25': 'E21', '18:00': 'F21'
    },
    WED: {
      '08:30': 'A12', '10:05': 'B12', '11:40': 'C12', '13:15': 'A22', '14:50': 'B14', '16:25': 'B22', '18:00': 'A24'
    },
    THU: {
      '08:30': 'D12', '10:05': 'E12', '11:40': 'F12', '13:15': 'D22', '14:50': 'F14', '16:25': 'E22', '18:00': 'F22'
    },
    FRI: {
      '08:30': 'A13', '10:05': 'B13', '11:40': 'C13', '13:15': 'A23', '14:50': 'C14', '16:25': 'B23', '18:00': 'B24'
    },
    SAT: {
      '08:30': 'D13', '10:05': 'E13', '11:40': 'F13', '13:15': 'D23', '14:50': 'D14', '16:25': 'D24', '18:00': 'E23'
    }
  };

  const timeSlots = ['08:30-10:00', '10:05-11:35', '11:40-13:10', '13:10-14:45', '14:50-16:20', '16:25-17:55', '18:00-19:30'];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Function to handle clicking on a timetable slot
  const handleSlotClick = (day, timeIndex) => {
    const key = `${day}-${timeIndex}`;
    setHighlightedSlots(prev => {
      const newSlots = { ...prev };
      if (newSlots[key]) {
        delete newSlots[key]; // Un-highlight if already highlighted
      } else {
        newSlots[key] = 'blue'; // Highlight in blue
      }
      return newSlots;
    });
  };

  const getSlotColor = (day, timeIndex) => {
    const key = `${day}-${timeIndex}`;
    // Check if the slot is lunch
    if ((day === 'MON' || day === 'TUE' || day === 'WED' || day === 'THU' || day === 'FRI' || day === 'SAT') && timeIndex === 3) {
      return 'bg-gray-400';
    }
    // Check if the slot is highlighted
    if (highlightedSlots[key]) {
        return `bg-${highlightedSlots[key]}-200`;
    }
    // Set default colors based on the new image
    if (day === 'MON') {
      if (timeIndex === 0 || timeIndex === 4) return 'bg-green-200';
      if (timeIndex === 1) return 'bg-blue-200';
      if (timeIndex === 2) return 'bg-orange-200';
    } else if (day === 'TUE') {
      if (timeIndex === 0) return 'bg-yellow-200';
      if (timeIndex === 2) return 'bg-red-200';
    } else if (day === 'WED') {
      if (timeIndex === 0) return 'bg-green-200';
      if (timeIndex === 1) return 'bg-blue-200';
      if (timeIndex === 2) return 'bg-orange-200';
      if (timeIndex === 4) return 'bg-blue-200';
      if (timeIndex === 6) return 'bg-blue-200';
    } else if (day === 'THU') {
      if (timeIndex === 0) return 'bg-yellow-200';
      if (timeIndex === 2) return 'bg-red-200';
      if (timeIndex === 4) return 'bg-amber-200';
    } else if (day === 'FRI') {
      if (timeIndex === 0) return 'bg-lime-200';
      if (timeIndex === 1) return 'bg-cyan-200';
      if (timeIndex === 4) return 'bg-orange-200';
      if (timeIndex === 6) return 'bg-cyan-200';
      if (timeIndex === 5 || timeIndex === 6) return 'bg-blue-200';
    }
    return 'bg-white hover:bg-gray-200';
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Time Table View</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-lime-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Day / Time</th>
              {timeSlots.map((time, index) => (
                <th key={index} className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {days.map((day) => (
              <tr key={day} className="transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-100">
                  {day}
                </td>
                {timeSlots.map((time, index) => (
                  <td
                    key={index}
                    onClick={() => handleSlotClick(day, index)}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 cursor-pointer text-center ${getSlotColor(day, index)}`}
                  >
                    {timetable[day][time.split('-')[0]] === 'Lunch' ? (
                      <span className="font-semibold text-gray-500 italic">Lunch</span>
                    ) : (
                      timetable[day][time.split('-')[0]]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <span className="w-4 h-4 bg-blue-200 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">Selected Slot</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-green-200 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">A11, A12</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-red-200 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">F11, F12</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-orange-200 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">C11, C12, C14</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-yellow-200 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">D11, D12</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-blue-200 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">B11, B12, B13</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-amber-200 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">D22, F14</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-lime-200 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">A13</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-cyan-200 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">B13</span>
        </div>
      </div>
    </div>
  );
}

// Communication Page Component
function CommunicationPage() {
  const [regNo, setRegNo] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending message:', { regNo, comment });
    // Add logic to send the message to the student
    setRegNo('');
    setComment('');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Communication</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="regNo" className="block text-sm font-medium text-gray-700 mb-1">
            Student Registration Number
          </label>
          <input
            type="text"
            id="regNo"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            required
          />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-lime-500 text-white font-semibold rounded-lg shadow-md hover:bg-lime-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

// Request View Page Component
function RequestViewPage({ requests, onRequestAction }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pending Requests</h1>
      {requests.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
          <p>Seems like you don't have any pending requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
              <div>
                <p className="font-semibold text-gray-800">Student: {request.studentRegNo}</p>
                <p className="text-sm text-gray-600 mt-1">Comment: {request.comment}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onRequestAction(request.id, 'accepted')}
                  className="p-2 rounded-full text-white bg-green-500 hover:bg-green-600 transition-colors"
                  aria-label="Accept request"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => onRequestAction(request.id, 'rejected')}
                  className="p-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors"
                  aria-label="Reject request"
                >
                  <Ban size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// CTS Office Contact Page Component
function CTSContactPage() {
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const consultants = [
    { name: 'Dr. Anjali Sharma', phone: '+91 91234 56789' },
    { name: 'Dr. Vikas Kumar', phone: '+91 99887 76655' },
    { name: 'Dr. Meena Gupta', phone: '+91 90000 11111' },
  ];

  const getContactInfo = () => {
    const consultant = consultants.find(c => c.name === selectedConsultant);
    return consultant ? consultant.phone : 'Please select a consultant to view contact information.';
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">CTS Office Contact</h1>
      <div className="space-y-4 max-w-sm">
        <div>
          <label htmlFor="consultant-select" className="block text-sm font-medium text-gray-700 mb-1">
            Consultant Name
          </label>
          <select
            id="consultant-select"
            value={selectedConsultant}
            onChange={(e) => setSelectedConsultant(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
          >
            <option value="">-- Select a Consultant --</option>
            {consultants.map((consultant, index) => (
              <option key={index} value={consultant.name}>{consultant.name}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Contact Information</p>
          <p className="mt-1 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
            {getContactInfo()}
          </p>
        </div>
      </div>
    </div>
  );
}
