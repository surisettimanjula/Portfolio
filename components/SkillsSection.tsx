import React, { useState } from 'react';

interface SkillsSectionProps {
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
  isAdmin: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, setSkills, isAdmin }) => {
  const [newSkill, setNewSkill] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    if (confirm(`Remove skill: ${skillToDelete}?`)) {
      setSkills(prev => prev.filter(s => s !== skillToDelete));
    }
  };

  return (
    <section id="skills" className="mt-16 scroll-mt-28">
      <h2 className="text-2xl font-bold">Skills & Tools</h2>
      <p className="text-gray-600 mt-2">Tools I use daily to build infra, pipelines, and monitoring.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {skills.map(s => (
          <div key={s} className="group relative px-4 py-2 rounded-full border border-gray-200 text-sm bg-white font-medium text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-default">
            {s}
            {isAdmin && (
              <button 
                onClick={() => handleDeleteSkill(s)}
                className="absolute -top-2 -right-2 hidden group-hover:flex w-5 h-5 items-center justify-center bg-red-500 text-white rounded-full text-xs shadow-sm hover:bg-red-600"
                title="Remove Skill"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        
        {isAdmin && (
          <div className="flex items-center gap-2">
            {isAdding ? (
              <div className="flex items-center gap-2">
                <input 
                  autoFocus
                  className="px-3 py-2 rounded-full border border-indigo-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Skill name..."
                />
                <button 
                  onClick={handleAddSkill}
                  className="px-3 py-2 rounded-full bg-green-600 text-white text-xs hover:bg-green-700"
                >
                  Add
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-2 rounded-full bg-gray-200 text-gray-700 text-xs hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 rounded-full border border-dashed border-gray-300 text-sm bg-gray-50 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
              >
                + Add Skill
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};