import PropTypes from 'prop-types';

function TagSkills({ children }) {
  return (
    <div className="justify-center px-3 py-1.5 bg-white rounded-3xl border border-solid border-neutral-200">
      {children}
    </div>
  );
}
TagSkills.propTypes = {
    children: PropTypes.any,
};

const TypeTag = ({ type }) => {
    return (
        <div className="absolute right-0 " >
            <div className="justify-center px-3 py-1 font-semibold text-white whitespace-nowrap bg-amber-500" style={{ borderTopLeftRadius: '0.25rem', borderBottomLeftRadius: '0.25rem' }}>
                {type}
            </div>
            <div className="w-0 h-0 border-t-8 border-l-8 absolute right-0 top-[calc(100%+0px)]" style={{ borderTopColor: '#ff9119', borderLeftColor: 'transparent' }}></div>
        </div>
    );
};
TypeTag.propTypes = {
    type: PropTypes.string,
};


function JobCardSimilar(
    {
        tag,
        jobTitle,
        labels,
        time,
        companyLogo,
        companyName,
        position,
        location
    }
) {
    return (
        <article className="relative flex flex-col gap-0 self-stretch pt-4 bg-white rounded-lg shadow-lg max-w-[500px]">
            <div className="flex flex-col gap-1 items-start pb-12 pl-3 pr-2 w-full">
                <div className="flex gap-5 justify-between self-stretch text-sm leading-5">
                    {/* Time */}
                    {/* <time className="gap-0 text-neutral-400" dateTime="2023-05-20">Đăng 5 ngày trước</time> */}
                    <time className="gap-0 text-neutral-400" dateTime="2023-05-20">{time}</time>
                </div>
                {/* Type: Hot, Job */}
                <TypeTag type={tag} />
                
                {/* Title */}
                <h2 className="gap-0 self-stretch mt-3 text-lg font-bold leading-7 text-neutral-900">
                    {jobTitle}
                </h2>

                {/* Company */}
                <div className="flex gap-0 justify-between mt-2">
                    <div className="flex gap-0 justify-center items-center p-px bg-white rounded border border-solid shadow-lg border-neutral-200 h-[50px] w-[50px]">
                        <img
                            loading="lazy"
                            // src="https://cdn.builder.io/api/v1/image/assets/TEMP/d5cef94958a49fc66e4384dee5b730d0cb3317ed17f0641d763a3b0d3ae906be?apiKey=1293b2add2d347908b4e11760098fdbe&"
                            src = {companyLogo}
                            alt="Company logo"
                            className="gap-0 w-full aspect-square"
                        />
                    </div>
                    <div className="gap-0 my-auto text-sm leading-5 text-neutral-700 ml-2">
                        {/* FuelCloud */}
                        {companyName}
                    </div>
                </div>

                {/* Salary */}
                <div className="flex gap-2 mt-2 text-base font-medium leading-6 text-neutral-700">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/bae9ab998e25a72c07142e6b6031923143bfa7ea4f367fa563d2d297c77a7c84?apiKey=1293b2add2d347908b4e11760098fdbe&"
                        alt=""
                        className="shrink-0 gap-0 my-auto w-4 aspect-square"
                    />
                    <div className="gap-0 underline">Đăng nhập để xem mức lương</div>
                </div>
                <hr className="shrink-0 gap-0 mt-3 max-w-full h-px border-t border-dashed border-neutral-200 w-[411px]" />
                
                {/* Position */}
                <div className="flex gap-2 py-px mt-3 text-sm leading-4 text-neutral-700">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7aa2e480495b628fe06e3a139f386c4d7d6098ed96338f6732bb4df7f4bd74eb?apiKey=1293b2add2d347908b4e11760098fdbe&"
                        alt=""
                        className="shrink-0 gap-0 self-start w-4 aspect-square"
                    />
                    <div className="gap-0">{position}</div>
                </div>

                {/* Location */}
                <div className="flex gap-2 mt-1 text-sm leading-5 text-neutral-700">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/74de5ca668519e69a499d5a3997d331f5d163fd099a1a71d90e4f93a392371ac?apiKey=1293b2add2d347908b4e11760098fdbe&"
                        alt=""
                        className="shrink-0 gap-0 self-start w-4 aspect-square"
                    />
                    <div className="gap-0">{location}</div>
                </div>

                {/* labels */}
                <div className="flex flex-wrap gap-2 pr-20 mt-3 text-xs leading-5 whitespace-nowrap text-neutral-700">
                    {labels.map((tag, index) => (
                        <TagSkills key={index}>{tag}</TagSkills>
                    ))}
                </div>
            </div>
        </article>
    );
}
JobCardSimilar.propTypes = {
    tag: PropTypes.string,
    jobTitle: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    time: PropTypes.string,
    companyLogo: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    position: PropTypes.string,
    location: PropTypes.string,
};

export default JobCardSimilar;