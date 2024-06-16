import  { useState } from 'react';
import { X } from 'lucide-react';

const statusOptions = {
  'CV tiếp nhận': 'cv-received',
  'Phù hợp': 'suitable',
  'Hẹn phỏng vấn': 'interview',
  'Gửi đề nghị': 'offer-sent',
  'Nhận việc': 'hired',
  'Từ chối': 'rejected'
};

const ReviewModal = ({ isOpen, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState('CV tiếp nhận');
  const [notes, setNotes] = useState('');

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  const handleUpdate = () => {
    const data = {
      status: statusOptions[selectedStatus], 
      notes: notes
    };

    // Simulating sending data to the server
    console.log('Sending data to the server:', data);

    // You can replace the console.log with an actual API call to your server
    // Example using fetch (uncomment and adjust the URL and options as needed):
    /*
    fetch('https://your-api-endpoint.com/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Close the modal after successful update
      onClose();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    */
    
    // Close the modal after logging the data (or after a successful API response)
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Đánh giá CV ứng viên</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <div className="flex space-x-2">
            {Object.keys(statusOptions).map((status) => (
              <button
                key={status}
                className={`px-3 py-1 rounded ${
                  selectedStatus === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                }`}
                onClick={() => handleStatusClick(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <textarea
            className="w-full border rounded p-2"
            placeholder="Bạn có muốn thêm ghi chú cho sự thay đổi này không?"
            rows="8"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2">Hủy bỏ</button>
          <button onClick={handleUpdate} className="px-4 py-2 bg-primary text-white rounded">Cập nhật</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
