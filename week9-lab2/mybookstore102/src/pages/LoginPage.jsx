// นำเข้า Hooks และ Icons ที่จำเป็น
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/outline';

const LoginPage = () => {
  // 1. สร้าง State สำหรับเก็บข้อมูล
  const [username, setUsername] = useState('');  // เก็บ username
  const [password, setPassword] = useState('');  // เก็บ password
  const [error, setError] = useState('');        // เก็บข้อความ error

  // 2. เตรียม navigate function สำหรับเปลี่ยนหน้า
  const navigate = useNavigate();

  // 3. ฟังก์ชันที่ทำงานเมื่อกด Submit ฟอร์ม
  const handleSubmit = (e) => {
    e.preventDefault();  // ป้องกันการ reload หน้า
    setError('');        // ล้างข้อความ error เก่า

    // 4. ตรวจสอบ username และ password
    if (username === 'bookstoreadmin' && password === 'ManageBook68') {
      // 5. ถ้าถูกต้อง: บันทึกสถานะล็อกอินใน localStorage
      localStorage.setItem('isAdminAuthenticated', 'true');

      // 6. เปลี่ยนหน้าไปยังหน้า Add Book
      navigate('/store-manager/all-book');
    } else {
      // 7. ถ้าไม่ถูกต้อง: แสดงข้อความ error
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-viridian-600
      to-green-700 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">

        <div>
          <div className="mx-auto h-16 w-16 bg-white rounded-full
            flex items-center justify-center">
            <LockClosedIcon className="h-10 w-10 text-viridian-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
            เข้าสู่ระบบ BackOffice
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
         
          <form className="space-y-6" onSubmit={handleSubmit}>

            
            {error && (
              <div className="bg-red-50 border border-red-400
                text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            
            <div>
              <label htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3
                  flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border
                    border-gray-300 rounded-lg focus:ring-2
                    focus:ring-viridian-500"
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </div>
            </div>

            
            <div>
              <label htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3
                  flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border
                    border-gray-300 rounded-lg focus:ring-2
                    focus:ring-viridian-500"
                  placeholder="กรอกรหัสผ่าน"
                />
              </div>
            </div>

            
            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-viridian-600
                  text-white font-medium rounded-lg
                  hover:bg-viridian-700 transition-colors"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>

        
        <div className="text-center">
          <a href="/"
            className="text-sm text-white hover:text-viridian-100">
            ← กลับสู่หน้าแรก
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;