
import { Mail} from 'lucide-react';
import PropTypes from "prop-types";

const CandidateItem = ({ candidate , statusOptions,  onCVViewer}) => {

  const handleViewCV = () => {
    onCVViewer(candidate);
  };
  return (
    <tr className="border-t">
      <td className="p-2 flex items-center">
        <div>
          <p className='text-wrap'>{candidate.applicationName}</p>
        </div>
      </td>
      <td className="p-2">
        <p className=''>{candidate.jobInfo.jobTitle}</p>
        <p className="text-xs text-gray-500">{candidate.jobId}</p>
      </td>
      <td className="p-2">
        <div className="flex items-center mb-1">
          <span className="text-primary mr-2">
            <Mail size={12} />
          </span>
          <span className='text-sm'>{candidate.contactInfo.email}</span>
        </div>
      </td>
      <td className="p-2">
        
        <p className='text-sm'>{candidate.applyAt}</p>
        
      </td>
      <td className="p-2">
          <button onClick={handleViewCV} className="text-blue-500 border border-blue-500 rounded px-2 py-1">
            {statusOptions[candidate.applicationStatus]}
          </button>
        
      </td>
    </tr>
  );
};



CandidateItem.propTypes = {
    candidate: PropTypes.object.isRequired,
    statusOptions: PropTypes.object.isRequired,
    onCVViewer: PropTypes.func,
  };
export default CandidateItem;

