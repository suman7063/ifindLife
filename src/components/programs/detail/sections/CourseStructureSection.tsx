
import React from 'react';
import { Clock, Users, Calendar, BookOpen } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';

interface CourseStructureSectionProps {
  courseStructure: ProgramDetail['courseStructure'];
}

const CourseStructureSection: React.FC<CourseStructureSectionProps> = ({ courseStructure }) => {
  // Use modules if available, otherwise fall back to weeklyBreakdown
  const breakdown = courseStructure.modules || courseStructure.weeklyBreakdown;
  
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <BookOpen className="h-6 w-6 text-ifind-teal mx-auto mb-2" />
          <p className="text-sm text-gray-600">Total Sessions</p>
          <p className="font-semibold">{courseStructure.totalSessions}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Clock className="h-6 w-6 text-ifind-teal mx-auto mb-2" />
          <p className="text-sm text-gray-600">Duration</p>
          <p className="font-semibold">{courseStructure.sessionDuration}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Calendar className="h-6 w-6 text-ifind-teal mx-auto mb-2" />
          <p className="text-sm text-gray-600">Frequency</p>
          <p className="font-semibold">{courseStructure.frequency}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Users className="h-6 w-6 text-ifind-teal mx-auto mb-2" />
          <p className="text-sm text-gray-600">Format</p>
          <p className="font-semibold capitalize">{courseStructure.format}</p>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Weekly Breakdown</h3>
        <div className="space-y-4">
          {breakdown.map((module) => (
            <div key={module.week} className="border rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="bg-ifind-teal text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                  {module.week}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{module.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseStructureSection;
