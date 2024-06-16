import React, { useState } from 'react';

const FilterForm = ({ onApply, onReset }) => {
    const [selectedLevel, setSelectedLevel] = useState([]);
    const [salaryRange, setSalaryRange] = useState([500, 6000]);
    const [selectedCompanyType, setSelectedCompanyType] = useState([]);
    const [selectedWorkingModel, setSelectedWorkingModel] = useState([]);

    const levels = ['Fresher', 'Junior', 'Senior', 'Manager'];
    const companyTypes = [
        'IT Outsourcing', 'IT Product', 'Headhunt',
        'IT Service and IT Consulting', 'Non-IT'
    ];
    const workingModels = ['At Office', 'Remote', 'Hybrid'];

    const handleToggleSelection = (item, setSelectedItems, selectedItems) => {
        setSelectedItems(
            selectedItems.includes(item)
                ? selectedItems.filter(i => i !== item)
                : [...selectedItems, item]
        );
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Level</h4>
                <div className="flex flex-wrap gap-2">
                    {levels.map(level => (
                        <button
                            key={level}
                            className={`px-3 py-1 rounded-full border ${selectedLevel.includes(level) ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleToggleSelection(level, setSelectedLevel, selectedLevel)}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Salary</h4>
                <input
                    type="range"
                    min="500"
                    max="6000"
                    value={salaryRange[1]}
                    onChange={(e) => setSalaryRange([salaryRange[0], Number(e.target.value)])}
                    className="w-full"
                />
                <p className="mt-2">{`${salaryRange[0]}$ - ${salaryRange[1]}$`}</p>
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Company Type</h4>
                <div className="flex flex-wrap gap-2">
                    {companyTypes.map(type => (
                        <button
                            key={type}
                            className={`px-3 py-1 rounded-full border ${selectedCompanyType.includes(type) ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleToggleSelection(type, setSelectedCompanyType, selectedCompanyType)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Working Model</h4>
                <div className="flex flex-wrap gap-2">
                    {workingModels.map(model => (
                        <button
                            key={model}
                            className={`px-3 py-1 rounded-full border ${selectedWorkingModel.includes(model) ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleToggleSelection(model, setSelectedWorkingModel, selectedWorkingModel)}
                        >
                            {model}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between">
                <button onClick={onReset} className="px-4 py-2 border border-red-500 text-red-500 rounded-full">Reset filter</button>
                <button onClick={() => onApply({ selectedLevel, salaryRange, selectedCompanyType, selectedWorkingModel })} className="px-4 py-2 bg-red-500 text-white rounded-full">Apply</button>
            </div>
        </div>
    );
};

export default FilterForm;
