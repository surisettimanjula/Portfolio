import React, { useState } from 'react';
import { Experience } from '../types';

interface ExperienceSectionProps {
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  isAdmin: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, setExperiences, isAdmin }) => {
  const [editingExpId, setEditingExpId] = useState<number | null>(null);
  const [expValues, setExpValues] = useState<Partial<Experience>>({ 
    title: '', company: '', date: '', desc: '', type: 'Full-time' 
  });

  const handleAdd = () => {
    const newExp: Experience = { 
      id: Date.now(), 
      title: 'New Role', 
      company: 'Company', 
      date: 'YYYY — YYYY', 
      desc: '', 
      type: 'Full-time' 
    };
    setExperiences(prev => [newExp, ...prev]);
    setEditingExpId(newExp.id);
    setExpValues(newExp);
  };

  const handleSave = (id: number) => {
    const updated = experiences.map(ex => ex.id === id ? { ...ex, ...expValues } as Experience : ex);
    setExperiences(updated);
    setEditingExpId(null);
    setExpValues({});
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this experience?')) {
      setExperiences(prev => prev.filter(ex => ex.id !== id));
      if (editingExpId === id) {
        setEditingExpId(null);
        setExpValues({});
      }
    }
  };

  const handleEditClick = (item: Experience) => {
    setEditingExpId(item.id);
    setExpValues(item);
  };

  return (
    <section id="experience" className="mt-16 scroll-mt-28">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Experience</h2>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 rounded bg-indigo-50 text-indigo-700 text-sm border hover:bg-indigo-100 transition-colors"
              onClick={handleAdd}
              aria-label="Add experience"
            >
              + Add Experience
            </button>
          </div>
        )}
      </div>

      <ol className="mt-6 space-y-6 relative border-l border-gray-200 ml-2">
        {experiences.map(item => (
          <li key={item.id} className="ml-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
             <div className="absolute -left-1.5 mt-6 w-3 h-3 bg-gray-200 rounded-full border border-white"></div>
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {editingExpId === item.id ? (
                  <div className="grid gap-3">
                    <input 
                      className="w-full border rounded px-2 py-1 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={expValues.title} 
                      onChange={e => setExpValues(v => ({ ...v, title: e.target.value }))} 
                      placeholder="Role Title"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                        value={expValues.company} 
                        onChange={e => setExpValues(v => ({ ...v, company: e.target.value }))} 
                        placeholder="Company"
                      />
                      <input 
                        className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                        value={expValues.date} 
                        onChange={e => setExpValues(v => ({ ...v, date: e.target.value }))} 
                        placeholder="Duration"
                      />
                    </div>
                    <select 
                      className="w-44 border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={expValues.type} 
                      onChange={e => setExpValues(v => ({ ...v, type: e.target.value }))}
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Intern</option>
                      <option>Contract</option>
                    </select>
                    <textarea 
                      rows={3} 
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={expValues.desc} 
                      onChange={e => setExpValues(v => ({ ...v, desc: e.target.value }))} 
                      placeholder="Description"
                    />
                    
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700"
                        onClick={() => handleSave(item.id)}
                      >Save Changes</button>
                      <button
                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs hover:bg-gray-300"
                        onClick={() => {
                          setEditingExpId(null);
                          setExpValues({});
                        }}
                      >Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-lg text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 font-medium">{item.company} • {item.date}</div>
                      </div>
                      {isAdmin && (
                         <div className="flex gap-2 ml-4">
                           <button
                             className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 text-xs border hover:bg-indigo-100"
                             onClick={() => handleEditClick(item)}
                           >Edit</button>
                           <button
                             className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs border hover:bg-red-100"
                             onClick={() => handleDelete(item.id)}
                           >Delete</button>
                         </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    <span className="inline-block mt-3 text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-500">{item.type}</span>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};