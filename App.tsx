import React, { useState, useEffect } from 'react';
import { INITIAL_PROJECTS, INITIAL_SKILLS, INITIAL_EXPERIENCES, INITIAL_PROFILE, INITIAL_PROFILE_IMAGE, INITIAL_RESUME_URL, LAST_UPDATED } from './constants';
import { Project, Experience, Profile } from './types';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsSection } from './components/SkillsSection';
import { MobileMenu } from './components/Shared';
import { HeroSection } from './components/HeroSection';
import { AdminLoginModal } from './components/AdminLoginModal';
import { DataExportModal } from './components/DataExportModal';

// Custom hook for persisting state to localStorage
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing ${key} to localStorage`, e);
    }
  }, [key, value]);

  return [value, setValue];
}

export default function DevOpsPortfolio() {
  // Application Data State with Persistence
  const [projectList, setProjectList] = useStickyState<Project[]>(INITIAL_PROJECTS, 'portfolio_projects');
  const [experienceList, setExperienceList] = useStickyState<Experience[]>(INITIAL_EXPERIENCES, 'portfolio_experiences');
  const [skillsList, setSkillsList] = useStickyState<string[]>(INITIAL_SKILLS, 'portfolio_skills');
  const [profile, setProfile] = useStickyState<Profile>(INITIAL_PROFILE, 'portfolio_profile');
  
  // Handle Profile Image (Priority: LocalStorage -> Constant -> Null)
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    const stored = window.localStorage.getItem('portfolio_profileImage');
    return stored !== null ? stored : INITIAL_PROFILE_IMAGE;
  });

  // Handle Resume (Priority: LocalStorage -> Constant -> '#')
  const [resumeUrl, setResumeUrl] = useState<string>(() => {
    const stored = window.localStorage.getItem('portfolio_resumeUrl');
    return stored !== null ? stored : INITIAL_RESUME_URL;
  });

  // Auto-Sync: If the deployed code is newer than local storage, overwrite local storage.
  useEffect(() => {
    try {
      const storedLastUpdated = localStorage.getItem('portfolio_last_updated');
      const storedTime = storedLastUpdated ? parseInt(storedLastUpdated, 10) : 0;
      
      // Check if code has a newer timestamp than what's stored
      if (LAST_UPDATED > storedTime) {
        console.log('App updated. Syncing data from constants...');
        setProjectList(INITIAL_PROJECTS);
        setSkillsList(INITIAL_SKILLS);
        setExperienceList(INITIAL_EXPERIENCES);
        setProfile(INITIAL_PROFILE);
        setProfileImage(INITIAL_PROFILE_IMAGE);
        setResumeUrl(INITIAL_RESUME_URL);
        localStorage.setItem('portfolio_last_updated', LAST_UPDATED.toString());
      }
    } catch (e) {
      console.warn('Error checking version', e);
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (profileImage) {
      try {
        window.localStorage.setItem('portfolio_profileImage', profileImage);
      } catch (e) {
        console.warn('Profile image too large for localStorage', e);
      }
    } else {
      window.localStorage.removeItem('portfolio_profileImage');
    }
  }, [profileImage]);

  useEffect(() => {
    if (resumeUrl && resumeUrl !== '#') {
      try {
        window.localStorage.setItem('portfolio_resumeUrl', resumeUrl);
      } catch (e) {
        console.warn('Resume file too large for localStorage', e);
      }
    }
  }, [resumeUrl]);
  
  // Admin Mode State
  const [adminMode, setAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAdminMode(true); // Automatically switch to edit mode on login
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminMode(false);
  };

  const handleResetData = () => {
    if (confirm("Reset all data to the latest deployed version? This will discard any local unsaved changes.")) {
       setProjectList(INITIAL_PROJECTS);
       setSkillsList(INITIAL_SKILLS);
       setExperienceList(INITIAL_EXPERIENCES);
       setProfile(INITIAL_PROFILE);
       setProfileImage(INITIAL_PROFILE_IMAGE);
       setResumeUrl(INITIAL_RESUME_URL);
       localStorage.setItem('portfolio_last_updated', LAST_UPDATED.toString());
       alert("Data reset to defaults.");
    }
  };

  // Helper to check valid form URL
  const formAction = profile.formActionUrl && profile.formActionUrl.trim() !== '' 
    ? profile.formActionUrl.trim() 
    : undefined;

  const handleContactSubmit = (e: React.FormEvent) => {
    // If a service URL is present, let the form submit naturally (it's set as action)
    if (formAction) {
      // Allow default form submission
      return;
    }

    // Fallback: Mailto
    e.preventDefault();
    const subject = `Portfolio Contact from ${contactForm.name}`;
    const body = `Name: ${contactForm.name}%0D%0AEmail: ${contactForm.email}%0D%0A%0D%0AMessage:%0D%0A${contactForm.message}`;
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white font-semibold shadow-lg shadow-indigo-200 overflow-hidden">
               {profileImage ? (
                 <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 profile.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()
               )}
            </div>
            <div>
              <div className="font-bold leading-tight">{profile.name}</div>
              <div className="text-xs text-gray-500">{profile.tagline}</div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#projects" className="hover:text-indigo-600 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-indigo-600 transition-colors">Skills</a>
            <a href="#experience" className="hover:text-indigo-600 transition-colors">Experience</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
            <a href={resumeUrl} download={resumeUrl !== '#' ? "Resume.pdf" : undefined} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors shadow-sm">Resume</a>
          </nav>
          
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
        
        {/* Admin Switcher Bar - Only Visible when Authenticated */}
        {isAuthenticated && (
          <div className="bg-gray-900 text-white py-2 shadow-inner border-t border-gray-800 animate-in slide-in-from-top-2">
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Admin Logged In
              </span>
              <div className="flex items-center gap-3">
                
                {/* Save Changes Button */}
                <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1 px-3 py-1 rounded text-xs font-bold bg-green-600 text-white hover:bg-green-500 transition-all shadow-sm"
                    title="Export changes to code"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    Save / Export
                </button>

                 {/* Reset Button */}
                <button
                    onClick={handleResetData}
                    className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium bg-red-800/50 text-red-200 border border-red-800 hover:bg-red-800 hover:text-white transition-all ml-2"
                    title="Discard local changes"
                >
                    Reset
                </button>

                <div className="flex bg-gray-800 rounded-md p-1 shadow-sm border border-gray-700 ml-2">
                  <button
                    onClick={() => setAdminMode(false)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${!adminMode ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setAdminMode(true)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${adminMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                  >
                    Edit Mode
                  </button>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-red-400 font-medium ml-2 px-2 py-1 hover:bg-gray-800 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <HeroSection 
          isAdmin={adminMode}
          profile={profile}
          setProfile={setProfile}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          resumeUrl={resumeUrl}
          setResumeUrl={setResumeUrl}
          projectCount={projectList.length}
        />

        {/* Projects Component */}
        <ProjectsSection 
          projects={projectList} 
          setProjects={setProjectList} 
          isAdmin={adminMode} 
        />

        {/* Skills Section */}
        <SkillsSection
          skills={skillsList}
          setSkills={setSkillsList}
          isAdmin={adminMode}
        />

        {/* Experience Component */}
        <ExperienceSection 
          experiences={experienceList} 
          setExperiences={setExperienceList} 
          isAdmin={adminMode} 
        />

        {/* Contact Section */}
        <section id="contact" className="mt-24 mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-28">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl text-gray-900">Send a Message</h3>
            <p className="text-gray-600 mt-2 mb-6">Available for freelance or full-time roles. I respond quickly to specific project details.</p>

            <form 
              className="grid gap-4" 
              onSubmit={handleContactSubmit}
              action={formAction}
              method="POST"
            >
              <div className="grid grid-cols-2 gap-4">
                <input 
                  name="name"
                  className="border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="Name" 
                  required
                  value={contactForm.name}
                  onChange={e => setContactForm(v => ({...v, name: e.target.value}))}
                />
                <input 
                  name="email"
                  type="email"
                  className="border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="Email" 
                  required
                  value={contactForm.email}
                  onChange={e => setContactForm(v => ({...v, email: e.target.value}))}
                />
              </div>
              <textarea 
                name="message"
                className="border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                rows={4} 
                placeholder="How can I help?"
                required
                value={contactForm.message}
                onChange={e => setContactForm(v => ({...v, message: e.target.value}))}
              ></textarea>
              <div className="flex items-center gap-4 mt-2">
                <button type="submit" className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                  {formAction ? 'Send Message' : 'Send via Email App'}
                </button>
                <a href={`mailto:${profile.email}`} className="text-sm text-gray-500 hover:text-gray-800">Or email me directly</a>
              </div>
            </form>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-8 rounded-2xl shadow-lg text-white">
            <h3 className="font-bold text-xl">Availability & Rates</h3>
            <p className="text-indigo-100 mt-2 leading-relaxed">Open to 3–6 month freelance contracts or part-time contributions. Rates vary by scope—DM for details.</p>

            <div className="mt-8 space-y-6">
              <div>
                <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Preferred Communication</div>
                <div className="font-medium text-white mt-1">Email, LinkedIn, or Google Meet</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Collab Tools</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-md bg-indigo-800/50 border border-indigo-600 text-xs text-indigo-100">Slack</span>
                  <span className="px-3 py-1 rounded-md bg-indigo-800/50 border border-indigo-600 text-xs text-indigo-100">Zoom</span>
                  <span className="px-3 py-1 rounded-md bg-indigo-800/50 border border-indigo-600 text-xs text-indigo-100">Jira</span>
                  <span className="px-3 py-1 rounded-md bg-indigo-800/50 border border-indigo-600 text-xs text-indigo-100">Notion</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="resume" className="py-12 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="flex justify-center gap-6 mb-4">
             <a href={profile.socials.github} className="hover:text-indigo-600">GitHub</a>
             <a href={profile.socials.linkedin} className="hover:text-indigo-600">LinkedIn</a>
          </div>
          <div className="mt-3">© {new Date().getFullYear()} {profile.name} — Built with React & Tailwind.</div>
          
          {/* Admin Login Trigger - Hidden when logged in */}
          {!isAuthenticated && (
            <button 
              onClick={() => setShowLoginModal(true)} 
              className="mt-6 text-xs text-gray-300 hover:text-indigo-500 transition-colors opacity-50 hover:opacity-100"
            >
              Admin Login
            </button>
          )}
        </footer>
      </main>

      <AdminLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLoginSuccess} 
      />
      
      <DataExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        projects={projectList}
        skills={skillsList}
        experiences={experienceList}
        profile={profile}
        profileImage={profileImage}
        resumeUrl={resumeUrl}
      />
    </div>
  );
}