import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MoonStar,
  Palette,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserCog,
  UserRound,
  Users,
  WalletCards,
  X,
} from 'lucide-react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const COLORS = {
  primary: '#0C7C82',
  secondary: '#35B4B0',
  mint: '#AED581',
  yellow: '#FFCA28',
  orange: '#FF8A65',
  red: '#EF5350',
  purple: '#4A2C6D',
  deepRed: '#D32F2F',
  amber: '#F57C00',
  gold: '#FBC02D',
  blue: '#0288D1',
};

const schoolData = {
  name: 'โรงเรียนสาธิตนครพนม',
  department: 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน',
  academicYear: '2568',
  semester: 'ภาคเรียนที่ 1',
};

const menuItems = {
  admin: [
    { key: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { key: 'settings', label: 'ตั้งค่าระบบ', icon: Settings },
    { key: 'users', label: 'จัดการผู้ใช้งาน', icon: UserCog },
    { key: 'students', label: 'จัดการข้อมูลนักเรียน', icon: Users },
    { key: 'assignments', label: 'มอบหมายงาน', icon: ClipboardList },
    { key: 'review', label: 'ตรวจ��ารส่งงาน', icon: CheckCircle2 },
    { key: 'search', label: 'ค้นหาผู้เรียน', icon: Search },
    { key: 'missing', label: 'ติดตามไม่ส่งงาน', icon: AlertCircle },
  ],
  student: [
    { key: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { key: 'assignments', label: 'งานที่ครูมอบหมาย', icon: BookOpen },
    { key: 'submit', label: 'ส่งงาน', icon: Upload },
    { key: 'submitted', label: 'งานที่ส่งแล้ว', icon: CheckCircle2 },
    { key: 'notSubmitted', label: 'งานที่ยังไม่ส่ง', icon: Clock3 },
    { key: 'messages', label: 'ข้อความจากครู', icon: MessageSquareText },
  ],
};

const assignmentTypeColors = {
  สมุด: '#0C7C82',
  ใบงาน: '#35B4B0',
  'งานกลุ่ม': '#AED581',
};

const mockStats = {
  totalAssignments: 124,
  textbook: 42,
  worksheet: 58,
  group: 24,
  completed: 89,
  pending: 35,
};

const studentTable = [
  { name: 'นางสาวกัญญารัตน์ ดวงใจ', grade: 'ม.1', room: '1/1', subject: 'คณิตศาสตร์', status: 'ส่งแล้ว', color: '#10B981' },
  { name: 'นายธนภัทร ทองดี', grade: 'ม.1', room: '1/1', subject: 'วิทยาศาสตร์', status: 'ยังไม่ส่ง', color: '#EF4444' },
  { name: 'นางสาวชุติมา ไพรสณฑ์', grade: 'ม.2', room: '2/3', subject: 'ภาษาไทย', status: 'ส่งแล้ว', color: '#10B981' },
  { name: 'นายปัณณวิชญ์ แสงสว่าง', grade: 'ม.3', room: '3/2', subject: 'สังคมศึกษา', status: 'ยังไม่ส่ง', color: '#EF4444' },
];

const assignmentList = [
  { subject: 'คณิตศาสตร์', title: 'แบบฝึกหัดบทที่ 1', assigned: '10 ต.ค. 2568', due: '17 ต.ค. 2568', type: 'สมุด', score: 20 },
  { subject: 'วิทยาศาสตร์', title: 'รายงานการทดลอง', assigned: '12 ต.ค. 2568', due: '19 ต.ค. 2568', type: 'ใบงาน', score: 30 },
  { subject: 'ภาษาไทย', title: 'สรุปเรื่องโครงงาน', assigned: '14 ต.ค. 2568', due: '21 ต.ค. 2568', type: 'งานกลุ่ม', score: 25 },
  { subject: 'สังคมศึกษา', title: 'แบบทดสอบหลังเรียน', assigned: '15 ต.ค. 2568', due: '23 ต.ค. 2568', type: 'สมุด', score: 15 },
];

const submissionQueue = [
  { name: 'นางสาวกัญญารัตน์ ดวงใจ', grade: 'ม.1/1', subject: 'คณิตศาสตร์', task: 'แบบฝึกหัดบทที่ 1', status: 'ตรวจแล้ว', score: 18 },
  { name: 'นายธนภัทร ทองดี', grade: 'ม.1/1', subject: 'วิทยาศาสตร์', task: 'รายงานการทดลอง', status: 'ยังไม่ตรวจ', score: null },
  { name: 'นางสาวชุติมา ไพรสณฑ์', grade: 'ม.2/3', subject: 'ภาษาไทย', task: 'สรุปเรื่องโครงงาน', status: 'งานไม่สมบูรณ์', score: 12 },
  { name: 'นายปัณณวิชญ์ แสงสว่าง', grade: 'ม.3/2', subject: 'สังคมศึกษา', task: 'แบบทดสอบหลังเรียน', status: 'ให้คะแนน', score: 10 },
];

const staffUsers = [
  { username: 'admin', password: 'admin123', name: 'ผู้ดูแลระบบ', role: 'ผู้ดูแลระบบ' },
  { username: 'teacher01', password: 'teacher123', name: 'นางสาวสุรีย์', role: 'ครู' },
  { username: 'teacher02', password: 'teacher123', name: 'นายกิตติพงษ์', role: 'ครู' },
];

const studentAccounts = [
  { username: '100001', password: '100001', name: 'นางสาวกัญญารัตน์ ดวงใจ', grade: 'ม.1', room: '1/1' },
  { username: '100002', password: '100002', name: 'นายธนภัทร ทองดี', grade: 'ม.1', room: '1/1' },
  { username: '100003', password: '100003', name: 'นางสาวชุติมา ไพรสณฑ์', grade: 'ม.2', room: '2/3' },
  { username: '100004', password: '100004', name: 'นายปัณณวิชญ์ แสงสว่าง', grade: 'ม.3', room: '3/2' },
];

const systemSettings = {
  grades: ['ม.1', 'ม.2', 'ม.3'],
  rooms: ['1/1', '1/2', '2/3', '3/2'],
  subjects: ['คณิตศาสตร์', 'วิทยาศาสตร์', 'ภาษาไทย', 'สังคมศึกษา', 'ภาษาอังกฤษ'],
  semesters: ['ภาคเรียนที่ 1/2568', 'ภาคเรียนที่ 2/2568'],
};

const barChartData = {
  labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
  datasets: [
    {
      label: 'ส่งงานครบ',
      data: [62, 71, 74, 79, 85, 92],
      backgroundColor: '#0C7C82',
      borderRadius: 10,
    },
    {
      label: 'ยังไม่ส่ง',
      data: [18, 16, 12, 11, 10, 8],
      backgroundColor: '#EF5350',
      borderRadius: 10,
    },
  ],
};

const lineChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [
    {
      label: 'งานที่ตรวจแล้ว',
      data: [55, 68, 74, 88, 80, 94],
      borderColor: '#35B4B0',
      backgroundColor: 'rgba(53,180,176,0.15)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const doughnutData = {
  labels: ['สมุด', 'ใบงาน', 'งานกลุ่ม'],
  datasets: [
    {
      label: 'ประเภทงาน',
      data: [42, 58, 24],
      backgroundColor: ['#0C7C82', '#35B4B0', '#AED581'],
      borderWidth: 0,
    },
  ],
};

const statusStyles = {
  'ตรวจแล้ว': 'bg-emerald-100 text-emerald-700',
  'ยังไม่ตรวจ': 'bg-amber-100 text-amber-700',
  'งานไม่สมบูรณ์': 'bg-red-100 text-red-700',
  'ให้คะแนน': 'bg-blue-100 text-blue-700',
  'ส่งแล้ว': 'bg-emerald-100 text-emerald-700',
  'ยังไม่ส่ง': 'bg-red-100 text-red-700',
};

function formatMoney(value) {
  return Number(value).toLocaleString('th-TH');
}

function App() {
  const [role, setRole] = useState('admin');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loginMode, setLoginMode] = useState('login');
  const [registerData, setRegisterData] = useState({
    fullName: '',
    studentId: '',
    studentCode: '',
    password: '',
  });
  const [loginForm, setLoginForm] = useState({
    username: 'admin',
    password: 'admin123',
  });

  const isAdminRole = role === 'admin';

  const currentMenu = menuItems[role] || menuItems.admin;

  const dashboardStats = useMemo(() => [
    { label: 'งานทั้งหมด', value: mockStats.totalAssignments, icon: ClipboardList, color: 'bg-primary', text: 'text-primary' },
    { label: 'สมุด', value: mockStats.textbook, icon: BookOpen, color: 'bg-cyan-500', text: 'text-cyan-600' },
    { label: 'ใบงาน', value: mockStats.worksheet, icon: FileText, color: 'bg-teal-500', text: 'text-teal-600' },
    { label: 'งานกลุ่ม', value: mockStats.group, icon: Users, color: 'bg-lime-500', text: 'text-lime-600' },
  ], []);

  const handleLogin = (e) => {
    e.preventDefault();
    const adminMatch = loginForm.username === 'admin' && loginForm.password === 'admin123';
    const staffMatch = staffUsers.find(
      (user) => user.username === loginForm.username && user.password === loginForm.password
    );
    const studentMatch = studentAccounts.find(
      (user) => user.username === loginForm.username && user.password === loginForm.password
    );

    if (adminMatch || staffMatch) {
      setRole('admin');
      setCurrentPage('dashboard');
      setIsLoggedIn(true);
      return;
    }

    if (studentMatch) {
      setRole('student');
      setCurrentPage('dashboard');
      setIsLoggedIn(true);
      return;
    }

    alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerData.fullName || !registerData.studentId || !registerData.studentCode) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสนักเรียนที่ใช้สมัคร');
    setLoginMode('login');
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('ต้องการออกจากระบบหรือไม่?');
    if (confirmLogout) {
      setIsLoggedIn(false);
      setCurrentPage('dashboard');
      setShowMenu(false);
    }
  };

  const renderAdminContent = () => {
    switch (currentPage) {
      case 'settings':
        return (
          <div className="space-y-6">
            <SectionHeader title="ตั้งค่าระบบ" subtitle="จัดการข้อมูลหลักของโรงเรียน" icon={<Settings className="w-5 h-5" />} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[
                ['ชื่อโรงเรียน', schoolData.name],
                ['ชื่อสังกัด', schoolData.department],
                ['ภาคเรียน / ปีการศึกษา', `${schoolData.semester} ${schoolData.academicYear}`],
                ['ระดับชั้น', systemSettings.grades.join(', ')],
                ['ห้องเรียน', systemSettings.rooms.join(', ')],
                ['รหัสว��ชา', 'คณิตศาสตร์, วิทยาศาสตร์, ภาษาไทย'],
              ].map(([label, value]) => (
                <div key={label} className="card-shadow rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</div>
                  <div className="mt-3 text-base font-bold text-slate-800">{value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <FormCard title="เพิ่มระดับชั้น" fields={['ม.4', 'ม.5', 'ม.6']} />
              <FormCard title="เพิ่มห้องเรียน" fields={['1/3', '2/1', '3/3']} />
              <FormCard title="เพิ่มภาคเรียน / ปีการศึกษา" fields={['ภาคเรียนที่ 1/2569', 'ภาคเรียนที่ 2/2569']} />
              <FormCard title="ประเภทงาน" fields={['สมุด', 'ใบงาน', 'งานกลุ่ม']} />
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            <SectionHeader title="จัดการผู้ใช้งาน" subtitle="เพิ่ม ลบ แก้ไข และบริหารข้อมูลผู้ใช้" icon={<UserCog className="w-5 h-5" />} />
            <div className="flex flex-wrap gap-3">
              <button className="grad-primary text-white rounded-xl px-4 py-2 font-semibold shadow-soft flex items-center gap-2">
                <Plus className="w-4 h-4" /> เพิ่มผู้ใช้
              </button>
              <button className="bg-white text-slate-700 border border-slate-200 rounded-xl px-4 py-2 font-semibold">
                <Download className="w-4 h-4 inline mr-2" /> Excel
              </button>
              <button className="bg-white text-slate-700 border border-slate-200 rounded-xl px-4 py-2 font-semibold">
                <Upload className="w-4 h-4 inline mr-2" /> Import Excel
              </button>
            </div>
            <TableCard
              headers={['username', 'password', 'ชื่อ-นามสกุล', 'บทบาท', 'การจัดการ']}
              rows={staffUsers.map((user) => [
                user.username,
                user.password,
                user.name,
                user.role,
                <div className="flex gap-2"><button className="text-blue-600">แก้ไข</button><button className="text-red-600">ลบ</button></div>,
              ])}
            />
          </div>
        );
      case 'students':
        return (
          <div className="space-y-6">
            <SectionHeader title="จัดการข้อมูลนักเรียน" subtitle="บริหารข้อมูลนักเรียนและการลงทะเบียน" icon={<Users className="w-5 h-5" />} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {['รหัสนักเรียน', 'ชื่อ-นามสกุล', 'ระดับชั้น', 'ห้องเรียน'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <label className="block text-xs font-semibold text-slate-500 mb-2">{item}</label>
                  <input className="input-modern" placeholder={item} />
                </div>
              ))}
            </div>
            <TableCard
              headers={['รหัส', 'ชื่อ-นามสกุล', 'ระดับชั้น', 'ห้องเรียน', 'สี', 'การจัดการ']}
              rows={studentAccounts.map((student) => [
                student.username,
                student.name,
                student.grade,
                student.room,
                <div className="w-6 h-6 rounded-full bg-emerald-500" />,
                <div className="flex gap-2"><button className="text-blue-600">แก้ไข</button><button className="text-red-600">ลบ</button></div>,
              ])}
            />
          </div>
        );
      case 'assignments':
        return (
          <div className="space-y-6">
            <SectionHeader title="มอบหมายงาน" subtitle="���ั้งค่าและจัดการงานที่ต้องส่ง" icon={<ClipboardList className="w-5 h-5" />} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['ชื่องาน', 'รายวิชา', 'ระดับชั้น', 'ห้องเรียน', 'วันส่งงาน', 'คะแนน', 'รายละเอียดงาน'].map((field) => (
                    <div key={field} className="md:col-span-1">
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">{field}</label>
                      <input className="input-modern" placeholder={field} />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">ตั้งค่าสี</label>
                    <input type="color" className="w-full h-12 rounded-xl border border-slate-200 bg-white" defaultValue="#0C7C82" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {assignmentList.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-slate-800">{item.title}</div>
                        <div className="text-sm text-slate-500">{item.subject}</div>
                      </div>
                      <span className="status-badge" style={{ background: `${assignmentTypeColors[item.type]}20`, color: assignmentTypeColors[item.type] }}>{item.type}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                      <div>มอบหมาย: {item.assigned}</div>
                      <div>กำหนดส่ง: {item.due}</div>
                      <div>คะแนน: {item.score}</div>
                      <div>ชั้น: ม.1</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-6">
            <SectionHeader title="ตรวจการส่งงาน" subtitle="ตรวจและให้คะแนนงานตามค่าสถานะ" icon={<CheckCircle2 className="w-5 h-5" />} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectBox label="ระดับชั้น" options={['ทั้งหมด', 'ม.1', 'ม.2', 'ม.3']} />
              <SelectBox label="ห้องเรียน" options={['ทั้งหมด', '1/1', '2/3', '3/2']} />
              <SelectBox label="รายวิชา" options={['ทั้งหมด', 'คณิตศาสตร์', 'วิทยาศาสตร์', 'ภาษาไทย']} />
              <SelectBox label="ส��านะ" options={['ทั้งหมด', 'ตรวจแล้ว', 'ยังไม่ตรวจ', 'งานไม่สมบูรณ์', 'ให้คะแนน']} />
            </div>
            <TableCard
              headers={['ชื่อนักเรียน', 'ชั้นเรียน', 'รายวิชา', 'ชื่องาน', 'สถานะ', 'คะแนน']}
              rows={submissionQueue.map((item) => [
                item.name,
                item.grade,
                item.subject,
                item.task,
                <span className={`status-badge ${statusStyles[item.status]}`}>{item.status}</span>,
                item.score ?? '-',
              ])}
            />
          </div>
        );
      case 'search':
        return (
          <div className="space-y-6">
            <SectionHeader title="ค้นหาผู้เรียน" subtitle="ค้นหาผลการส่งงานและข้อมูลนักเรียน" icon={<Search className="w-5 h-5" />} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectBox label="ระดับ���ั้น" options={['ม.1', 'ม.2', 'ม.3']} />
              <SelectBox label="ห้องเรียน" options={['1/1', '2/3', '3/2']} />
              <SelectBox label="จากรหัส" options={['100001', '100002', '100003']} />
              <SelectBox label="ประเภท" options={['ทั้งหมด', 'ส่งแล้ว', 'ยังไม่ส่ง']} />
            </div>
            <TableCard
              headers={['ชื่อ-นามสกุล', 'ระดับชั้น', 'ห้องเรียน', 'รายวิชา', 'งานส่งแล้ว / ยังไม่ส่ง']}
              rows={studentTable.map((student) => [
                student.name,
                student.grade,
                student.room,
                student.subject,
                <span className="status-badge" style={{ background: `${student.color}20`, color: student.color }}>{student.status}</span>,
              ])}
            />
          </div>
        );
      case 'missing':
        return (
          <div className="space-y-6">
            <SectionHeader title="ติดตามไม่ส่งงาน" subtitle="ตรวจสอบนักเรียนที่ยังไม่ส่งงาน" icon={<Bell className="w-5 h-5" />} />
            <TableCard
              headers={['ชื่อ-นามสกุล', 'ห้องเรียน', 'ชั้นเรียน', 'รายวิชา', 'สถานะ', 'วันที่ส่ง']}
              rows={[
                ['นายธนภัทร ทองดี', '1/1', 'ม.1', 'วิทยาศาสตร์', <span className="status-badge bg-red-100 text-red-700">ยังไม่ส่ง</span>, '17 ต.ค. 2568'],
                ['นายปัณณวิชญ์ แสงสว่าง', '3/2', 'ม.3', 'สังคมศึกษา', <span className="status-badge bg-red-100 text-red-700">ยังไม่ส่ง</span>, '18 ต.ค. 2568'],
              ]}
            />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <SectionHeader title="แดชบอร์ด" subtitle="ภาพรวมระบบตรวจการส่งงาน" icon={<LayoutDashboard className="w-5 h-5" />} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {dashboardStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="chart-shell p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-bold text-slate-800">สถิติการส่งงาน</div>
                    <div className="text-sm text-slate-500">แต่ละเดือน</div>
                  </div>
                  <div className="badge bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">+12%</div>
                </div>
                <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } } }} height={240} />
              </div>

              <div className="chart-shell p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-bold text-slate-800">ประเภทงาน</div>
                    <div className="text-sm text-slate-500">สัดส่วนทั้งหมด</div>
                  </div>
                  <div className="badge bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold">124 งาน</div>
                </div>
                <div className="h-64">
                  <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                </div>
              </div>

              <div className="chart-shell p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-bold text-slate-800">อัตราการตรวจแล้ว</div>
                    <div className="text-sm text-slate-500">7 วันล่าสุด</div>
                  </div>
                  <div className="badge bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">89%</div>
                </div>
                <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} height={240} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {Object.entries(assignmentTypeColors).map(([label, color]) => (
                <div key={label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <div className="text-lg font-bold text-slate-800">{label}</div>
                    </div>
                    <div className="text-sm text-slate-500">{label === 'สมุด' ? 42 : label === 'ใบงาน' ? 58 : 24} งาน</div>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: label === 'สมุด' ? '52%' : label === 'ใบงาน' ? '63%' : '29%', background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  const renderStudentContent = () => {
    switch (currentPage) {
      case 'assignments':
        return (
          <div className="space-y-6">
            <SectionHeader title="งานที่ครูมอบหมาย" subtitle="งานทั้งหมดที่ต้องทำ" icon={<BookOpen className="w-5 h-5" />} />
            <TableCard
              headers={['รายวิชา', 'ชื่องาน', 'วันที่มอบหมาย', 'วันกำหนดส่ง']}
              rows={assignmentList.map((item) => [
                item.subject,
                item.title,
                item.assigned,
                <span className="text-red-600 font-bold">{item.due}</span>,
              ])}
            />
          </div>
        );
      case 'submit':
        return (
          <div className="space-y-6">
            <SectionHeader title="ส่งงาน" subtitle="อัปโหลดไฟล์งานหรือส่งลิงก์" icon={<Upload className="w-5 h-5" />} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="space-y-4">
                  <SelectBox label="รายวิชา" options={['คณิตศาสตร์', 'วิทยาศาสตร์', 'ภาษาไทย']} />
                  <SelectBox label="เลือกงาน" options={['แบบฝึกหัดบทที่ 1', 'รายงานการทดลอง', 'สรุปเรื่องโครงงาน']} />
                  <SelectBox label="ประเภท" options={['สมุด', 'ใบงาน', 'งานกลุ่ม']} />
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">อัปโหลดงาน</label>
                    <div className="border-2 border-dashed border-teal-200 rounded-2xl p-6 text-center bg-teal-50">
                      <Upload className="mx-auto text-primary mb-3" />
                      <div className="text-sm font-semibold text-slate-700">ลากไฟล์มาวางหรือคลิกเพื่อเลือก</div>
                      <div className="text-xs text-slate-500 mt-1">รองรับ .png .jpg .pdf และลิงก์</div>
                    </div>
                  </div>
                  <button className="grad-primary text-white rounded-xl px-4 py-3 font-bold w-full">ส่งงาน</button>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="text-lg font-bold mb-3">รายละเอียดงาน</div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between"><span>รายวิชา</span><span className="font-bold text-slate-800">คณิตศาสตร์</span></div>
                  <div className="flex justify-between"><span>ชื่องาน</span><span className="font-bold text-slate-800">แบบฝึกหัดบทที่ 1</span></div>
                  <div className="flex justify-between"><span>กำหนดส่ง</span><span className="font-bold text-red-600">17 ต.ค. 2568</span></div>
                  <div className="flex justify-between"><span>คะแนน</span><span className="font-bold text-slate-800">20</span></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'submitted':
        return (
          <div className="space-y-6">
            <SectionHeader title="งานที่ส่งแล้ว" subtitle="รายการงานที่นักเรียนส่งเรียบร้อย" icon={<CheckCircle2 className="w-5 h-5" />} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'ส่งแล้ว', value: 18, color: 'bg-emerald-500' },
                { label: 'รอตรวจ', value: 6, color: 'bg-yellow-500' },
                { label: 'ยังไม่ส่ง', value: 4, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl ${item.color} text-white flex items-center justify-center font-bold text-xl`}>{item.value}</div>
                  <div className="mt-4 text-sm text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'notSubmitted':
        return (
          <div className="space-y-6">
            <SectionHeader title="งานที่ยังไม่ส่ง" subtitle="รายการงานที่ยังไม่ได้ส่ง" icon={<Clock3 className="w-5 h-5" />} />
            <TableCard
              headers={['รายวิชา', 'ประเภทงาน', 'ชื่องาน', 'งานที่ยังไม่ส่ง', 'วันกำหนดส่ง']}
              rows={[
                ['วิทยาศาสตร์', 'ใบงาน', 'รายงานการทดลอง', 'ยังไม่ส่ง', <span className="text-red-600 font-bold">19 ต.ค. 2568</span>],
                ['สังคมศึกษา', 'สมุด', 'แบบทดสอบหลังเรียน', 'ยังไม่ส่ง', <span className="text-red-600 font-bold">23 ต.ค. 2568</span>],
              ]}
            />
          </div>
        );
      case 'messages':
        return (
          <div className="space-y-6">
            <SectionHeader title="ข้อความจากครู" subtitle="ข้อความแจ้งเตือนและคำแนะนำ" icon={<MessageSquareText className="w-5 h-5" />} />
            <div className="space-y-4">
              {[
                'กรุณาเข้าสู่ระบบส่งงานภายในวันศุกร์นี้ ���พื่อให้ตรงตามกำหนด',
                'งานคำอธิบายรายงานวิทยาศาสตร์ กรุณาใส่รูปภาพประกอบให้ครบถ้วน',
                'นักเรียนที่ยังไม่ส่งงานให้รีบทำและส่งภายใน 2 วัน',
              ].map((msg, index) => (
                <div key={index} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center"><Bell className="w-4 h-4" /></div>
                    <div className="font-bold text-slate-800">ข้อความจากครู #{index + 1}</div>
                  </div>
                  <div className="text-slate-600">{msg}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <SectionHeader title="แดชบอร์ด" subtitle="ภาพรวมการเรียนและการส่งงาน" icon={<LayoutDashboard className="w-5 h-5" />} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'งานทั้งหมด', value: 24, icon: ClipboardList, color: 'bg-primary' },
                { label: 'ส่งแล้ว', value: 16, icon: CheckCircle2, color: 'bg-emerald-500' },
                { label: 'รอตรวจ', value: 5, icon: Clock3, color: 'bg-amber-500' },
                { label: 'ยังไม่ส่ง', value: 3, icon: AlertCircle, color: 'bg-red-500' },
              ].map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} color={stat.color} />
              ))}
            </div>
            <div className="chart-shell p-5">
              <div className="text-lg font-bold text-slate-800 mb-4">สถิติการส่งงาน</div>
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} height={260} />
            </div>
          </div>
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen background-pattern bg-slate-50 px-4 py-8 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 overflow-hidden rounded-[32px] border border-slate-200 bg-white/85 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur-md lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative bg-gradient-to-br from-[#0C7C82] via-[#35B4B0] to-[#A7E4D9] p-6 md:p-10 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),transparent_35%)]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-sm">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold">{schoolData.name}</div>
                    <div className="text-xs text-white/80">{schoolData.department}</div>
                  </div>
                </div>

                <div className="mt-12 max-w-md">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    <Sparkles className="w-3.5 h-3.5" /> Smart School System
                  </div>
                  <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">ระบบตรวจการส่งงานและติดตามนักเรียน</h1>
                  <p className="mt-4 max-w-sm text-sm text-white/85 md:text-base">
                    จัดการงาน อัปโหลดผลงาน ตรวจให้คะแนน และติดตามความก้าวหน้าของนักเรียนด้วยระบบที่ทันสมัย ตอบโจทย์การใช้งานจริง
                  </p>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
                  {[
                    { label: 'งานทั้งหมด', value: '124' },
                    { label: 'นักเรียน', value: '1,300' },
                    { label: 'ตรวจแล้ว', value: '89%' },
                    { label: 'ยังไม่ส่ง', value: '35' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                      <div className="text-2xl font-extrabold">{item.value}</div>
                      <div className="text-xs text-white/80">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Welcome</div>
                  <div className="text-2xl font-extrabold text-slate-800">เข้าสู่ระบบ</div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  <MoonStar className="w-4 h-4" /> Responsive
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
                <button
                  onClick={() => setRole('admin')}
                  className={`rounded-xl px-4 py-3 text-sm font-bold ${role === 'admin' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                >
                  ผู้ดูแล / ครู
                </button>
                <button
                  onClick={() => setRole('student')}
                  className={`rounded-xl px-4 py-3 text-sm font-bold ${role === 'student' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                >
                  นักเรียน
                </button>
              </div>

              {loginMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">ชื่อเข้าใช้</label>
                    <input
                      className="input-modern"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      placeholder={role === 'admin' ? 'admin' : 'รหัสนักเรียน'}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">รหัสผ่าน</label>
                    <input
                      type="password"
                      className="input-modern"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder={role === 'admin' ? 'admin123' : 'รหัสนักเรียน'}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4 text-primary" /> จดจำฉัน
                    </label>
                    <button type="button" className="font-semibold text-primary">ลืมรหัสผ่าน?</button>
                  </div>

                  <button type="submit" className="grad-primary w-full rounded-2xl py-3.5 text-base font-extrabold text-white shadow-soft">
                    เข้าสู่ระบบ
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">ชื่อ-นามสกุล</label>
                    <input className="input-modern" value={registerData.fullName} onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })} placeholder="กรอกชื่อ-นามสกุล" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">เลขที่</label>
                    <input className="input-modern" value={registerData.studentId} onChange={(e) => setRegisterData({ ...registerData, studentId: e.target.value })} placeholder="เลขที่นักเรียน" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">รหัสนักเรียน 6 หลัก</label>
                    <input className="input-modern" value={registerData.studentCode} onChange={(e) => setRegisterData({ ...registerData, studentCode: e.target.value })} placeholder="xxxxxx" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">รหัสผ่าน</label>
                    <input type="password" className="input-modern" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} placeholder="ตั้งรหัสผ่าน" />
                  </div>
                  <button type="submit" className="grad-primary w-full rounded-2xl py-3.5 text-base font-extrabold text-white shadow-soft">
                    สมัครสมาชิก
                  </button>
                </form>
              )}

              <div className="mt-6 flex items-center justify-center gap-3 text-sm">
                <span className="text-slate-500">{loginMode === 'login' ? 'ยังไม่มีบัญชี?' : 'มีบัญชีแล้ว?'}</span>
                <button type="button" className="font-bold text-primary" onClick={() => setLoginMode(loginMode === 'login' ? 'register' : 'login')}>
                  {loginMode === 'login' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform ${showMenu ? 'translate-x-0' : '-translate-x-full'} border-r border-slate-200 bg-[#0f172a] text-white transition-transform duration-200 lg:translate-x-0 lg:static` }>
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold">{role === 'admin' ? 'ผู้ดูแลระบบ' : 'นักเรียน'}</div>
                <div className="text-xs text-slate-300">{schoolData.name}</div>
              </div>
            </div>
            <button className="lg:hidden" onClick={() => setShowMenu(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="sidebar-scroll h-[calc(100vh-140px)] overflow-y-auto p-4">
            {currentMenu.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setCurrentPage(item.key);
                    setShowMenu(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all ${active ? 'bg-white/10 text-white ring-1 ring-white/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="border-t border-white/10 p-4">
            <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-500/25">
              <LogOut className="w-4 h-4" /> ออกจากระบบ
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 py-3 md:px-8">
              <div className="flex items-center gap-3">
                <button className="lg:hidden rounded-xl border border-slate-200 p-2" onClick={() => setShowMenu(true)}>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">School System</div>
                  <div className="text-xl font-extrabold text-slate-800">{schoolData.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {role === 'admin' ? 'A' : 'S'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{role === 'admin' ? 'ผู้ดูแลระบบ' : 'นางสาวกัญญารัตน์ ดวงใจ'}</div>
                    <div className="text-xs text-slate-500">{role === 'admin' ? 'admin' : '100001'}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-8">
            {isAdminRole ? renderAdminContent() : renderStudentContent()}
          </main>

          <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center text-sm text-slate-600 md:px-8">
            ระบบตรวจงานและส่งงานนักเรียน - {schoolData.name}
          </footer>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, icon }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <div className="text-xl font-extrabold text-slate-800">{title}</div>
          <div className="text-sm text-slate-500">{subtitle}</div>
        </div>
      </div>
      <button className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">เพิ่มใหม่</button>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color = 'bg-primary', text = 'text-primary' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-800">{value}</div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function TableCard({ headers, rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="table-scroll overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-bold uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t border-slate-200 hover:bg-slate-50">
                {row.map((cell, i) => (
                  <td key={i} className="px-4 py-3 text-slate-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SelectBox({ label, options }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</label>
      <select className="input-modern">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function FormCard({ title, fields }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 text-lg font-bold text-slate-800">{title}</div>
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <span className="text-sm font-medium text-slate-700">{field}</span>
            <div className="flex items-center gap-2">
              <button className="text-blue-600">แก้ไข</button>
              <button className="text-red-600">ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
