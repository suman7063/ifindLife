
import React from 'react';
import { Target, Wrench, Award, Brain } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';

interface CoverageSectionProps {
  coverage: ProgramDetail['coverage'];
}

const CoverageSection: React.FC<CoverageSectionProps> = ({ coverage }) => {
  return (
    <div className="space-y-6">
      {/* Main Topics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-ifind-teal" />
          Main Topics Covered
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coverage.mainTopics.map((topic, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">{topic}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Techniques & Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-ifind-teal" />
            Techniques
          </h3>
          <ul className="space-y-2">
            {coverage.techniques.map((technique, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-ifind-teal rounded-full"></div>
                <span className="text-gray-700">{technique}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-ifind-teal" />
            Tools & Resources
          </h3>
          <ul className="space-y-2">
            {coverage.tools.map((tool, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-ifind-teal rounded-full"></div>
                <span className="text-gray-700">{tool}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-ifind-teal" />
            Skills Developed
          </h3>
          <ul className="space-y-2">
            {coverage.skills.map((skill, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-ifind-teal rounded-full"></div>
                <span className="text-gray-700">{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoverageSection;
