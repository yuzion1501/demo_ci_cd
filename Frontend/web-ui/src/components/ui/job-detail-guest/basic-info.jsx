import {useState} from "react";
import PropTypes from "prop-types";
// Basic info
const Gallery = ({ job_detail }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <div className="bg-white p-6 rounded-b-md shadow-md">
        <div className="flex justify-center ">
            <div  className="flex-none mr-4">
              <img
                src={job_detail?.employerInfo.image}
                alt={job_detail?.employerInfo.companyName}
                className="cursor-pointer max-w-[300px] h-[184px]"
                onClick={() => setSelectedImage(job_detail?.employerInfo.image)}
              />
            </div>
        </div>
        {selectedImage && (
            <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            onClick={() => setSelectedImage(null)} // Đóng modal khi nhấp ra ngoài
            >
                <div className="relative"> 
                
                <img
                    src={selectedImage}
                    alt="Selected Image"
                    className="h-[50vh] object-contain "
                    onClick={(e) => e.stopPropagation()} 
                />
                
                <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-0 right-0 p-2 bg-black bg-opacity-25 "
                >
                    X
                </button>
                </div>

            </div>
        )}
      
    </div>
  );
};

Gallery.propTypes = {
  job_detail: PropTypes.object.isRequired,
};

function IconText({ iconSrc, text, alt }) {
    return (
        <div className="icon-text">
            <img src={iconSrc} alt={alt} className="basic-info-icon" />
            <div className="text">{text}</div>
        </div>
    );
}

IconText.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  alt: PropTypes.string,
};


function SkillTags() {
    const skills = ["Flutter", "React Native", "Dart"];

    return (
        <div className="skill-tags">
            <div className="skill-label">Kỹ năng:</div>
            <div className="skill-list">
                {skills.map((skill, index) => (
                    <div key={index} className="skill-tag">
                        {skill}
                    </div>
                ))}
            </div>
        </div>
    );
}



function JobDetails({job_detail}) {
    return (
        <article className="job-details">
            <Gallery job_detail={job_detail}/>
            <div className="job-info">
                <IconText
                    iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/c0626a6a4a2acda85275ab5536f06c95177df1a626adecf3aaca0e4d6ce3e6f2?apiKey=1293b2add2d347908b4e11760098fdbe&"
                    text={job_detail?.jobLocation}
                    alt="Location icon"
                />
                
                <IconText  iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/6d831fdaf31e8169acfb119810b46f9bf0bba65340e3dda6252b5f6ef449a66b?apiKey=1293b2add2d347908b4e11760098fdbe&" text={job_detail?.jobType} alt="Office icon" />
                
            </div>
            <SkillTags />
        </article>
    );
}

JobDetails.propTypes = {
  job_detail: PropTypes.object.isRequired,
};
function BasicInfo( {job_detail}) {
    return (
        <>
            <JobDetails job_detail={job_detail}/>

            <style>{`
          .job-details {
            border-radius: 0 0 8px 8px;
            box-shadow: 0 6px 32px 0 rgba(0, 0, 0, 0.08);
            background-color: #fff;
            display: flex;
            // max-width: 893px;
            flex-direction: column;
            align-items: start;
            padding: 16px 20px 36px;
            z-index: 0;
          }
  
          .image-gallery {
            display: flex;
            gap: 20px;
            width: 100%;
          }
  
          @media (max-width: 991px) {
            .image-gallery {
              flex-direction: column;
              gap: 9px;
            }
          }
  
          .image-column {
            width: 33%;
            position: relative;
          }
  
          @media (max-width: 991px) {
            .image-column {
              width: 100%;
            }
          }
  
          .gallery-image {
            aspect-ratio: 1.49;
            object-fit: cover;
            width: 100%;
          }
  
          .last-image {
            position: relative;
          }
  
          .image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          }
  
          .job-info {
            margin-top: 28px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            color: #414042;
            font-size: 16px;
            line-height: 1.5;
          }
  
          .icon-text {
            display: flex;
            align-items: center;
            gap: 8px;
          }
  
          .basic-info-icon {
            width: 16px;
            height: 16px;
          }
  
          .skill-tags {
            margin-top: 19px;
            display: flex;
            align-items: center;
            gap: 19px;
            color: #414042;
            line-height: 1.5;
          }
  
          .skill-label {
            font-size: 14px;
            font-family: Lexend, sans-serif;
          }
  
          .skill-list {
            display: flex;
            gap: 4px;
            font-size: 12px;
          }
  
          .skill-tag {
            font-family: Lexend, sans-serif;
            border-radius: 20px;
            border: 1px solid #dedede;
            background-color: #fff;
            padding: 10px 11px;
            white-space: nowrap;
          }
  
          @media (max-width: 991px) {
            .skill-tag {
              white-space: normal;
            }
          }
        `}</style>
        </>
    );
}

BasicInfo.propTypes = {
  job_detail: PropTypes.object.isRequired,
};
export default BasicInfo;