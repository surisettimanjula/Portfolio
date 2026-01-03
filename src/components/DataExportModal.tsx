import React, { useState, useEffect } from 'react';
import { Project, Experience, Profile } from '../types';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  skills: string[];
  experiences: Experience[];
  profile: Profile;
  profileImage: string | null;
  resumeUrl: string;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({ 
  isOpen, onClose, projects, skills, experiences, profile, profileImage, resumeUrl
}) => {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  // GitHub Configuration State
  const [ghConfig, setGhConfig] = useState({
    owner: '',
    repo: '',
    token: '',
    path: 'src/constants.ts' // Ensure this matches your folder structure
  });

  // Load saved config on mount
  useEffect(() => {
    const savedOwner = localStorage.getItem('gh_owner') || '';
    const savedRepo = localStorage.getItem('gh_repo') || '';
    const savedToken = localStorage.getItem('gh_token') || '';
    const savedPath = localStorage.getItem('gh_path') || 'src/constants.ts';
    setGhConfig({ owner: savedOwner, repo: savedRepo, token: savedToken, path: savedPath });
  }, []);

  if (!isOpen) return null;

  // Generate the content of constants.ts based on current state
  const generateCode = () => {
    return `import { Project, Experience, Profile } from "./types";

export const LAST_UPDATED = ${Date.now()};

// These will hold the Base64 strings for your image and resume when exported
export const INITIAL_PROFILE_IMAGE: string | null = ${JSON.stringify(profileImage)};

export const INITIAL_RESUME_URL: string = ${JSON.stringify(resumeUrl)};

export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};

export const INITIAL_SKILLS: string[] = ${JSON.stringify(skills, null, 2)};

export const INITIAL_EXPERIENCES: Experience[] = ${JSON.stringify(experiences, null, 2)};

export const INITIAL_PROFILE: Profile = ${JSON.stringify(profile, null, 2)};`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveConfig = () => {
    localStorage.setItem('gh_owner', ghConfig.owner);
    localStorage.setItem('gh_repo', ghConfig.repo);
    localStorage.setItem('gh_token', ghConfig.token);
    localStorage.setItem('gh_path', ghConfig.path);
  };

  // Helper to encode string to Base64 (supporting Unicode/Emoji)
  const utf8_to_b64 = (str: string) => {
    return window.btoa(unescape(encodeURIComponent(str)));
  };

  const handlePushToGithub = async () => {
    if (!ghConfig.owner || !ghConfig.repo || !ghConfig.token) {
      setStatus('error');
      setStatusMsg('Please fill in all GitHub details.');
      return;
    }

    saveConfig();
    setStatus('loading');
    setStatusMsg('Connecting to GitHub...');

    try {
      const baseUrl = `https://api.github.com/repos/${ghConfig.owner}/${ghConfig.repo}/contents/${ghConfig.path}`;
      const headers = {
        'Authorization': `Bearer ${ghConfig.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      };

      // 1. Get the current SHA of the file (required to update it)
      const getResponse = await fetch(baseUrl, { headers });
      
      if (!getResponse.ok) {
        if (getResponse.status === 404) {
           setStatus('error');
           setStatusMsg(`File '${ghConfig.path}' not found in repo. Check the file path input.`);
           return;
        }
        throw new Error('Failed to fetch file info. Check your token permissions (need "repo" scope).');
      }

      const getData = await getResponse.json();
      const sha = getData.sha;

      // 2. Push the new content
      setStatusMsg('Pushing new data to GitHub...');
      
      const newContent = generateCode();
      const body = {
        message: `Update portfolio content (${new Date().toLocaleDateString()})`,
        content: utf8_to_b64(newContent),
        sha: sha
      };

      const putResponse = await fetch(baseUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });

      if (!putResponse.ok) {
        const err = await putResponse.json();
        throw new Error(err.message || 'Failed to update file');
      }

      setStatus('success');
      setStatusMsg('Success! GitHub updated. Your site will go live in ~1-2 minutes.');

    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setStatusMsg(error.message || 'An unknown error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-100">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Publish Changes</h3>
            <p className="text-sm text-gray-500 mt-1">
              Save your changes to GitHub to update the live site.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'auto' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setMode('auto')}
          >
            Automatic (Push to GitHub)
          </button>
          <button 
             className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'manual' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700'}`}
             onClick={() => setMode('manual')}
          >
            Manual (Copy Code)
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          
          {mode === 'auto' ? (
            <div className="space-y-6">
               <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg text-sm text-indigo-800 flex gap-3 items-start">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <div>
                    <strong>How this works:</strong> <br/>
                    Enter your GitHub details below. When you click "Publish", this app updates the code in your repository. Netlify/Vercel will detect the change and automatically rebuild your site.
                  </div>
               </div>

               <div className="grid gap-4 md:grid-cols-2">
                 <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1">GitHub Username</label>
                   <input 
                     className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                     placeholder="e.g. ramky3064"
                     value={ghConfig.owner}
                     onChange={e => setGhConfig({...ghConfig, owner: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1">Repository Name</label>
                   <input 
                     className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                     placeholder="e.g. devops-portfolio"
                     value={ghConfig.repo}
                     onChange={e => setGhConfig({...ghConfig, repo: e.target.value})}
                   />
                 </div>
               </div>

               <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1">
                     Personal Access Token
                     <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-600 underline font-normal">Generate Token (Classic)</a>
                   </label>
                   <input 
                     type="password"
                     className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                     placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                     value={ghConfig.token}
                     onChange={e => setGhConfig({...ghConfig, token: e.target.value})}
                   />
                   <p className="text-xs text-gray-500 mt-1">
                     <strong>Important:</strong> Token must have the <code>repo</code> scope checked.
                   </p>
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">File Path</label>
                  <input 
                     className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600 bg-gray-50"
                     value={ghConfig.path}
                     onChange={e => setGhConfig({...ghConfig, path: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 mt-1">Default: <code>src/constants.ts</code></p>
               </div>

               <div className="pt-2">
                 {status === 'loading' && (
                    <div className="flex items-center gap-2 text-indigo-600 font-medium">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {statusMsg}
                    </div>
                 )}
                 {status === 'error' && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                      <strong>Error:</strong> {statusMsg}
                    </div>
                 )}
                 {status === 'success' && (
                    <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      {statusMsg}
                    </div>
                 )}
                 
                 {status !== 'loading' && status !== 'success' && (
                    <button 
                      onClick={handlePushToGithub}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      Publish Updates to Live Site
                    </button>
                 )}
               </div>

            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4 bg-gray-100 text-gray-700 p-4 rounded-lg text-sm border border-gray-200 shadow-sm">
                <strong>Manual Mode:</strong> Copy the code below and paste it into <code>src/constants.ts</code> in your GitHub repository manually.
              </div>
              <div className="relative group">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs md:text-sm overflow-x-auto font-mono border border-gray-700 h-96 shadow-inner">
                  <code>{generateCode()}</code>
                </pre>
                <button 
                  onClick={handleCopy}
                  className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-lg"
                >
                  {copied ? (
                    <>Copied!</>
                  ) : (
                    <>Copy Code</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};