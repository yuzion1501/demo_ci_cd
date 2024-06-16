import PropTypes from 'prop-types';

function CompanyInfoSection({job_detail}) {
  return (
    <>
      <article className="company-card">
        <header className="company-header">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e47c4b93b4d4f47b986be54c2cb34896b91d806b8eb5fa5384bf432953b26567?apiKey=1293b2add2d347908b4e11760098fdbe&" alt={job_detail?.employerInfo?.logoUrl} className="company-logo" />
          <div className="company-header-info">
            <h2 className="company-name">{job_detail?.employerInfo?.companyName}</h2>
            <a href="#" className="company-link">
              <div>View company</div>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/32a56c793b7a187bfb978ef5618af22dd9123dcdd096fddd829bcaeb4bce5e99?apiKey=1293b2add2d347908b4e11760098fdbe&" alt="Arrow icon" className="arrow-icon" />
            </a>
          </div>
        </header>
        <p className="company-description">
          {job_detail?.employerInfo?.companyOverview}
        </p>
        <div className="company-model">
          <div className="company-model-label">Company type</div>
          <div className="company-model-value">{job_detail?.employerInfo?.companyType}</div>
        </div>
        <div className="company-info-item">
          <div className="company-info-label">Company size</div>
          <div className="company-info-value">{job_detail?.employerInfo?.companySize}</div>
        </div>
        <div className="company-info-item">
          <div className="company-info-label">Country</div>
          <div className="company-info-value">
            <div>{job_detail?.employerInfo?.country}</div>
          </div>
        </div>
        <div className="company-info-item">
          <div className="company-info-label">Working Days</div>
          <div className="company-info-value">{job_detail?.employerInfo?.workingDays}</div>
        </div>
        <div className="company-info-item">
          <div className="company-info-label">Overtime policy</div>
          <div className="company-info-value">{job_detail?.employerInfo?.overtimePolicy}</div>
        </div>
        <div className="expand-container">
        </div>
        
      </article>

      <style >{`
        .company-card {
          border-radius: 8px;
          box-shadow: 0 6px 32px 0 rgba(0, 0, 0, 0.08);
          background-color: #fff;
          display: flex;
          max-width: 423px;
          flex-direction: column;
          line-height: 150%;
          padding: 24px 20px 0;
        }

        .company-header {
          display: flex;
          gap: 12px;
        }

        .company-logo {
          width: 120px;
          border: 1px solid rgba(222, 226, 230, 1);
          max-width: 100%;
        }

        .company-header-info {
          align-self: start;
          display: flex;
          margin-top: 10px;
          flex-direction: column;
          flex-grow: 1;
          flex-basis: 0;
          width: fit-content;
        }

        .company-name {
          color: #121212;
          font: 700 18px Lexend, sans-serif;
          margin: 0;
        }

        .company-link {
          display: flex;
          margin-top: 6px;
          gap: 9px;
          font-size: 16px;
          color: #0e2eed;
          font-weight: 400;
        }

        .arrow-icon {
          width: 16px;
          align-self: start;
        }

        .company-description {
          color: #414042;
          margin-top: 26px;
          font: 400 16px/24px Lexend, -apple-system, Roboto, Helvetica, sans-serif;
        }

        .company-model {
          justify-content: center;
          border-bottom: 1px dashed rgba(222, 222, 222, 1);
          display: flex;
          margin-top: 18px;
          gap: 20px;
          font-size: 16px;
          font-weight: 400;
          padding: 11px 0;
        }

        .company-model-label {
          color: #a6a6a6;
          font-family: Lexend, sans-serif;
          flex-grow: 1;
          flex-basis: auto;
        }

        .company-model-value {
          color: #121212;
          text-align: right;
          font-family: Lexend, sans-serif;
        }

        .company-info-item {
          justify-content: center;
          border-bottom: 1px dashed rgba(222, 222, 222, 1);
          display: flex;
          gap: 20px;
          font-size: 16px;
          font-weight: 400;
          padding: 13px 0;
        }

        .company-info-label {
          color: #a6a6a6;
          font-family: Lexend, sans-serif;
          flex-grow: 1;
          flex-basis: auto;
        }

        .company-info-value {
          color: #121212;
          text-align: right;
          font-family: Lexend, sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        .country-flag {
          width: 20px;
        }

        .company-image {
          width: 300px;
          align-self: center;
          margin-top: 35px;
          max-width: 300px;
        }

        .expand-container {
          height: 50px;
        }
      `}</style>
    </>
  );
}

CompanyInfoSection.propTypes = {
  job_detail: PropTypes.object.isRequired,
};

export default CompanyInfoSection;