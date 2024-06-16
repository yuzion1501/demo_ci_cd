import { useState } from 'react';
import {Mail, School} from 'lucide-react'
import { Link } from 'react-router-dom';

// Sample Data
const stats = {
  totalCVs: 10,
  appliedCVs: 1,
  newContactCVs: 9,
};

const tabs = [
  { name: 'Tin tuyển dụng', content: 'Content for Tin tuyển dụng' },
  { name: 'CV ứng tuyển', content: 'Content for CV ứng tuyển' },
  { name: 'Ứng viên đã xem tin', content: 'Content for Ứng viên đã xem tin', badge: 1 },
  { name: 'CV tìm kiếm', content: 'Content for CV tìm kiếm' },
  { name: 'CV đang theo dõi', content: 'Content for CV đang theo dõi' },
  { name: 'CV được hỗ trợ', content: 'Content for CV được hỗ trợ' },
];

const applicants = [
  {
    initials: 'PN',
    name: 'Trần Phúc Nguyên',
    email: 'tr.phucnguyen@gmail.com',
    id: '004008251',
    dateSent: '20/05/2022',
    experience: 'Nhân viên bán hàng - Công ty Family Mart',
    education: 'THPT Thanh Đa',
    status: 'Hẹn phỏng vấn',
  },
  {
    initials: 'PN',
    name: 'Nguyễn Thu Trang',
    email: 'ng.thutrang@gmail.com',
    id: '004008251',
    dateSent: '20/05/2022',
    experience: 'Nhân viên phục vụ - Nhà hàng Lẩu Phan',
    education: 'Quản trị nhà hàng và dịch vụ ăn uống',
    status: 'Hẹn phỏng vấn',
  },
];

const TableApplicants = ({applicants}) => {
  return <table className="min-w-full border rounded">
    <thead>
      <tr className="bg-gray-100">
        <th className="p-2 text-left">Ảnh</th>
        <th className="p-2 text-left">Tên</th>
        <th className="p-2 text-left">Thông tin</th>
        <th className="p-2 text-left">Trạng thái</th>
      </tr>
    </thead>
    <tbody>
      {applicants.map((candidate, index) => (
        
        <tr key={index} className="border-t">
          {/* col "Ảnh" */}
          <td className="p-2 flex items-center">
            <div className={`w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-white font-bold mr-2`}>
              {candidate.initials}
            </div>
          </td>
          {/* col "Tên" */}
          <td className="p-2">
            <div>
              <p>{candidate.name}</p>
            </div>
          </td>
          {/* col "Thông tin" */}
          <td className="p-2">
              <div className="flex items-center mb-1">
                  <span className='text-primary mr-2'><Mail size={12}/></span>
                  <span>{candidate.email}</span>
              </div>
              <div className="flex items-center">
                  <span className='text-primary mr-2'><School size={12}/></span>
                  <span>{candidate.education}</span>
              </div>
          </td>

          {/* col "Trạng thái" */}
          <td className="p-2">
            <Link to ={"/cv-detail"}> 
              <button className="text-gray-700 border bg-gray-200 rounded-full px-2 py-1">
                {candidate.status} 
              </button></Link>
          </td>
        </tr>
      ))}
    </tbody>
    </table>
}


const JobApplicants = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className="p-4">
      {/* Header with Stats */}
      <div className="flex justify-between items-center mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-2 bg-white border rounded text-center">
            <p className="text-gray-500">Tổng lượng CV ứng viên</p>
            <p className="text-2xl font-semibold">{stats.totalCVs}</p>
          </div>
          <div className="p-2 bg-white border rounded text-center">
            <p className="text-gray-500">CV ứng tuyển</p>
            <p className="text-2xl font-semibold">{stats.appliedCVs}</p>
          </div>
          <div className="p-2 bg-white border rounded text-center">
            <p className="text-gray-500">CV mới liên hệ</p>
            <p className="text-2xl font-semibold">{stats.newContactCVs}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`px-4 py-2 border-b-2 ${
              activeTab === tab.name ? 'border-black' : ''
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
            {tab.badge && (
              <span className="ml-2 bg-primary text-white rounded-full text-xs px-2">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white p-4 rounded shadow">
        {activeTab === 'Tin tuyển dụng' && (
          <>
            <div className='flex justify-between'>
              <div>
                <h2 className="text-lg font-bold mb-4">Scout AI hết hạn dịch vụ</h2>
                <p>Thời gian hoạt động: 20/05/2022 - 03/06/2022</p>
              </div>
              
            </div>

            <h3 className="text-lg font-bold mt-6 mb-4">Kết quả Scout của chiến dịch này</h3>
            <div className="flex space-x-4 mb-4">
              <button className="bg-primary text-white px-4 py-2 rounded">Tất cả (2)</button>
              <button className="bg-gray-200 px-4 py-2 rounded">CV chưa tương tác</button>
              <button className="bg-gray-200 px-4 py-2 rounded">CV quan tâm</button>
              <button className="bg-gray-200 px-4 py-2 rounded">CV đã liên hệ</button>
              <button className="bg-gray-200 px-4 py-2 rounded">CV đã bỏ qua</button>
            </div>

          </>
        )}

        {activeTab === 'CV ứng tuyển' && (
          <TableApplicants applicants={applicants}/>
        )}

        {tabs.filter(tab => tab.name !== 'Tin tuyển dụng' && tab.name !== 'CV ứng tuyển').map(tab => (
          activeTab === tab.name && (
            <div key={tab.name}>
              {tab.content}
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default JobApplicants;


      