import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  isAdmin: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, setProjects, isAdmin }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Project>>({
    title: '', desc: '', tech: [], link: '', linkLabel: '', updated: ''
  });
  const [tempTechString, setTempTechString] = useState('');

  const handleEditClick = (p: Project) => {
    setEditingId(p.id);
    setEditValues(p);
    setTempTechString(p.tech.join(', '));
  };

  const handleSave = (id: number) => {
    const updatedList = projects.map(pr => pr.id === id ? {
      ...pr,
      ...editValues,
      tech: tempTechString.split(',').map(t => t.trim()).filter(Boolean)
    } as Project : pr);
    setProjects(updatedList);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
    setTempTechString('');
  };

  return (
    <section id="projects" className="mt-16 scroll-mt-28">
      <h2 className="text-2xl font-bold">Selected Projects</h2>
      <p className="text-gray-600 mt-2">A snapshot of recent work: reproducible, documented, and shipped.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <article key={p.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow relative border border-transparent hover:border-gray-100">
            {isAdmin && (
              <div className="absolute right-3 top-3 z-10">
                {editingId === p.id ? (
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-green-600 text-white text-xs shadow-sm hover:bg-green-700"
                      onClick={() => handleSave(p.id)}
                    >Save</button>
                    <button
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs shadow-sm hover:bg-gray-300"
                      onClick={handleCancel}
                    >Cancel</button>
                  </div>
                ) : (
                  <button 
                    className="px-3 py-1 rounded bg-indigo-50 text-indigo-700 text-xs border hover:bg-indigo-100" 
                    onClick={() => handleEditClick(p)}
                  >
                    Edit
                  </button>
                )}
              </div>
            )}

            {editingId === p.id ? (
              <div className="space-y-2 mt-6">
                <input 
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={editValues.title} 
                  onChange={e => setEditValues(v => ({ ...v, title: e.target.value }))} 
                  placeholder="Project Title"
                />
                <textarea 
                  rows={3} 
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={editValues.desc} 
                  onChange={e => setEditValues(v => ({ ...v, desc: e.target.value }))} 
                  placeholder="Description"
                />
                <input 
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={tempTechString} 
                  onChange={e => setTempTechString(e.target.value)} 
                  placeholder="Tech tags (comma separated)" 
                />
                <input 
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={editValues.link} 
                  onChange={e => setEditValues(v => ({ ...v, link: e.target.value }))} 
                  placeholder="Link URL" 
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={editValues.linkLabel} 
                    onChange={e => setEditValues(v => ({ ...v, linkLabel: e.target.value }))} 
                    placeholder="Link Label" 
                  />
                  <input 
                    className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={editValues.updated} 
                    onChange={e => setEditValues(v => ({ ...v, updated: e.target.value }))} 
                    placeholder="Year" 
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-semibold pr-12">{p.title}</h3>
                <p className="text-sm text-gray-600 mt-2 min-h-[3rem]">{p.desc}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tech.map((t, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{t}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <a href={p.link} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                    {p.linkLabel || 'View repo'} &rarr;
                  </a>
                  <div className="text-xs text-gray-400">Updated • {p.updated}</div>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};