import { User, Mail, Clock, Target } from 'lucide-react';

export default function ProfileCard({ resumeData }) {
  if (!resumeData) return null;

  const name = resumeData.name || 'Unknown';
  const email = resumeData.email || '';
  const skills = resumeData.skills || [];
  const experience = resumeData.experience_years ?? resumeData.experienceYears ?? null;
  const preferredRoles = resumeData.preferred_roles || resumeData.preferredRoles || [];

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {name}
          </h3>
          {email && (
            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
              <Mail className="w-3 h-3 shrink-0" />
              {email}
            </p>
          )}
        </div>
      </div>

      {experience !== null && (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>{experience} years experience</span>
        </div>
      )}

      {preferredRoles.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>Preferred Roles</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {preferredRoles.map((role, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Skills</p>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 12).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {skills.length > 12 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{skills.length - 12}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
