import PropTypes from "prop-types"

const JobDetailsSection = ({job_detail}) => {
  // const benefits = [
  //   "Top Salary, Awesome Benefits",
  //   "Premium healthcare for 3 members in family",
  //   "Grab to work, Lunch allowance for all employee"
  // ];

  // const jobDescriptions = [
  //   "Design and build advanced components for highly scalable, reliable, maintainable, and secure mobile projects.",
  //   "Develop robust, testable, and efficient code, ensuring optimal performance, quality, and a smooth user experience on diverse devices models and operating systems.",
  //   "Perform unit testing and participate in code reviews to maintain code quality.",
  //   "Adopt problem-solving approaches, innovate and contribute to technological and product development.",
  //   "Maintain effective communication and collaboration with cross-functional teams (Product, Backend, QA, DevOps, Design, etc.) to provide technical input, define, design, and ship new features and improvements as part of an Agile team.",
  //   "Support and mentor team members to raise the bar."
  // ];

  // const jobRequirements = [
  //   "5+ years of experience in mobile development, with at least 3 years specializing in Flutter for large-scale applications.",
  //   "Deep understanding of Flutter and the Dart language, including object-oriented and functional programming, coding principles, design patterns, threading, memory management, performance optimization, networking, asynchronous programming, and leveraging popular Flutter libraries.",
  //   "Comprehensive knowledge of security, API design, mobile app UI/UX principles, CI/CD practices and tools.",
  //   "Proficient in Agile development methodologies with experience in TDD and knowledge of automated testing frameworks.",
  //   "Ability to break down complex user stories into actionable tasks and ensure technical feasibility.",
  //   "Excellent analytical, troubleshooting, and problem-solving skills.",
  //   "Ability to define technical requirements and work effectively with minimal supervision.",
  //   "A proactive attitude and willingness to engage in a diverse and collaborative team environment.",
  //   "Proficient in written and verbal communication skills in English.",
  //   "Experience with platforms such as native Android/iOS, or React Native is advantageous, as is a willingness to learn and work with additional technologies."
  // ];

  // const whyYouWillLoveWorkingHere = [
  //   "Competitive compensation package, including 13th-month salary and performance bonuses",
  //   "Comprehensive health care coverage for you and your dependents",
  //   "Generous leave policies, including annual leave, sick leave, and flexible work hours",
  //   "Convenient central district 1 office location, next to a future metro station",
  //   "Onsite lunch with multiple options, including vegetarian",
  //   "Grab for work allowance and fully equipped workstations",
  //   "Fun and engaging team building activities, sponsored sports clubs, and happy hour every Thursday",
  //   "Unlimited free coffee, tea, snacks, and fruit to keep you energized",
  //   "An opportunity to make a social impact by helping to democratize credit access in emerging markets."
  // ];

  return (
    <>
      <style>{`
        .job-post {
          margin-top: 20px;
          background-color: #fff;
          font-size: 16px;
          color: #121212;
          font-weight: 400;
          line-height: 29px;
          padding: 10px 20px;
          border-radius: 8px;
          box-shadow: 0 6px 32px 0 rgba(0, 0, 0, 0.08);
        }
        
        .section-title {
          font: 700 22px/150% Lexend, sans-serif;
          margin-bottom: 5px;
        }
        
        .section-content {
          font-family: Lexend, sans-serif;
          margin-left: 18px;
          margin-top: 0;
        }

        .section-content li {
            position: relative;
            list-style-type: none;
          }
        
        .section-content li:before {
            content: '';
            position: absolute;
            left: -15px;
            top: 11px;
            //transform: translateY(-50%);
            transform: none;
            width: 5px;
            height: 5px;
            background-color: red;
            border-radius: 80%;
        }
        
        .section-divider {
          border-color: rgba(222, 222, 222, 1);
          border-style: dashed;
          border-bottom-width: 1px;
        }

        .job-post hr {
          margin-top: 20px;
        }

        .job-post h2 {
          margin: 20px 0 0 0;
          font: 700 22px/150% Lexend, sans-serif;
        }
        
        @media (max-width: 991px) {
          .section-title,
          .section-content {
            max-width: 100%;
          }
          
        }
      `}</style>

      <article className="job-post">
        <header>
          <h2 className="section-title">Top 3 reasons to join us</h2>
          <ul className="section-content">
            <div dangerouslySetInnerHTML={{ __html: job_detail?.jobTopReasons }} />
          </ul>
        </header>

        <hr className="section-divider" />

        <section>
          <h2 className="section-title">Job description</h2>
          <ul className="section-content">
            <div dangerouslySetInnerHTML={{ __html: job_detail?.jobDescription }} />
          </ul>
        </section>

        <hr className="section-divider" />

        <section>
          <h2 className="section-title">Your skills and experience</h2>
          <ul className="section-content">
            <div dangerouslySetInnerHTML={{ __html: job_detail?.jobRequirement }} />
          </ul>
        </section>

        <hr className="section-divider" />

        <section>
          <h2 className="section-title">Why you will love working here</h2>
          <ul className="section-content">
            <div dangerouslySetInnerHTML={{ __html: job_detail?.jobBenefit }} />
          </ul>
        </section>
      </article>
    </>
  );
};
JobDetailsSection.propTypes = {
  job_detail: PropTypes.object.isRequired,
};
export default JobDetailsSection;