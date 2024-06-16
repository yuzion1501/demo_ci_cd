import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const CompanyDetailPage = () => {
    const [searchParams] = useSearchParams();
    const [selectedCompany, setSelectedCompany] = useState(null);

    const companyId = searchParams.get("id");

    return (
        <div>
            <p>{companyId}</p>
        </div>
    );
};

export default CompanyDetailPage;
