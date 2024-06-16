import React, { useState } from "react";
import PropTypes from "prop-types";
const Gallery = ({ image }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="bg-white p-6 rounded-b-md shadow-md">
      
        <div className="flex justify-center ">
          
            <div  className="flex-none mr-4">
              <img
                src={image}
                alt={`image`}
                className="cursor-pointer max-w-[300px] h-[184px]"
                onClick={() => setSelectedImage(image)}
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
  image: PropTypes.string.isRequired,
};
export default Gallery;
