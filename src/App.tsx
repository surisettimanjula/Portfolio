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

// Persist state to local storage to prevent data loss on refresh during editing
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
  const [projectList, setProjectList] = useStickyState<Project[]>(INITIAL_PROJECTS, 'portfolio_projects');
  const [experienceList, setExperienceList] = useStickyState<Experience[]>(INITIAL_EXPERIENCES, 'portfolio_experiences');
  const [skillsList, setSkillsList] = useStickyState<string[]>(INITIAL_SKILLS, 'portfolio_skills');
  const [profile, setProfile] = useStickyState<Profile>(INITIAL_PROFILE, 'portfolio_profile');
  
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    const stored = window.localStorage.getItem('portfolio_profileImage');
    return stored !== null ? stored : INITIAL_PROFILE_IMAGE;
  });

  const [resumeUrl, setResumeUrl] = useState<string>(() => {
    const stored = window.localStorage.getItem('portfolio_resumeUrl');
    return stored !== null ? stored : INITIAL_RESUME_URL;
  });

  // CRITICAL: Check if the deployed code is newer than local data.
  // If so, update the UI to match the latest deployment.
  useEffect(() => {
    try {
      const storedLastUpdated = localStorage.getItem('portfolio_last_updated');
      const storedTime = storedLastUpdated ? parseInt(storedLastUpdated, 10) : 0;
      
      // If deployed code has a newer timestamp (from admin push), force sync
      if (LAST_UPDATED > storedTime) {
        console.log('New deployment detected. Syncing data...');
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
  }, []);

  useEffect(() => {
    if (profileImage) {
      try { window.localStorage.setItem('portfolio_profileImage', profileImage); } catch (e) {}
    } else {
      window.localStorage.removeItem('portfolio_profileImage');
    }
  }, [profileImage]);

  useEffect(() => {
    if (resumeUrl && resumeUrl !== '#') {
      try { window.localStorage.setItem('portfolio_resumeUrl', resumeUrl); } catch (e) {}
    }
  }, [resumeUrl]);
  
  const [adminMode, setAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAdminMode(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminMode(false);
  };

  const handleResetData = () => {
    if (confirm("Reset to latest live version? Unsaved changes will be lost.")) {
       setProjectList(INITIAL_PROJECTS);
       setSkillsList(INITIAL_SKILLS);
       setExperienceList(INITIAL_EXPERIENCES);
       setProfile(INITIAL_PROFILE);
       setProfileImage(INITIAL_PROFILE_IMAGE);
       setResumeUrl(INITIAL_RESUME_URL);
       localStorage.setItem('portfolio_last_updated', LAST_UPDATED.toString());
       alert("Data reset.");
    }
  };

  const formAction = profile.formActionUrl?.trim() || undefined;

  const handleContactSubmit = (e: React.FormEvent) => {
    if (formAction) return;
    e.preventDefault();
    const subject = `Portfolio Contact from ${contactForm.name}`;
    const body = `Name: ${contactForm.name}%0D%0AEmail: ${contactForm.email}%0D%0A%0D%0AMessage:%0D%0A${contactForm.message}`;
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
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
            <a href={resumeUrl} download="Resume.pdf" className={`px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors shadow-sm ${(!resumeUrl || resumeUrl === '#') ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>Resume</a>
          </nav>
          
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="bg-gray-900 text-white py-2 shadow-inner border-t border-gray-800 animate-in slide-in-from-top-2">
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Admin Active
              </span>
              <div className="flex items-center gap-3">
                <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold bg-green-600 text-white hover:bg-green-500 transition-all shadow-sm"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    Publish Changes
                </button>

                <button
                    onClick={handleResetData}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-gray-800 text-red-200 border border-red-900 hover:bg-red-900 transition-all ml-2"
                >
                    Reset
                </button>

                <div className="flex bg-gray-800 rounded-md p-1 shadow-sm border border-gray-700 ml-2">
                  <button
                    onClick={() => setAdminMode(false)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${!adminMode ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    View
                  </button>
                  <button
                    onClick={() => setAdminMode(true)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${adminMode ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Edit
                  </button>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-white font-medium ml-2 px-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
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

        <ProjectsSection 
          projects={projectList} 
          setProjects={setProjectList} 
          isAdmin={adminMode} 
        />

        <SkillsSection
          skills={skillsList}
          setSkills={setSkillsList}
          isAdmin={adminMode}
        />

        <ExperienceSection 
          experiences={experienceList} 
          setExperiences={setExperienceList} 
          isAdmin={adminMode} 
        />

        <section id="contact" className="mt-24 mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-28">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl text-gray-900">Send a Message</h3>
            <p className="text-gray-600 mt-2 mb-6">Available for freelance or full-time roles.</p>

            <form className="grid gap-4" onSubmit={handleContactSubmit} action={formAction} method="POST">
              <div className="grid grid-cols-2 gap-4">
                <input name="name" className="border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Name" required value={contactForm.name} onChange={e => setContactForm(v => ({...v, name: e.target.value}))} />
                <input name="email" type="email" className="border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Email" required value={contactForm.email} onChange={e => setContactForm(v => ({...v, email: e.target.value}))} />
              </div>
              <textarea name="message" className="border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" rows={4} placeholder="Message" required value={contactForm.message} onChange={e => setContactForm(v => ({...v, message: e.target.value}))}></textarea>
              <button type="submit" className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md">{formAction ? 'Send Message' : 'Send via Email App'}</button>
            </form>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-8 rounded-2xl shadow-lg text-white">
            <h3 className="font-bold text-xl">Contact Details</h3>
            <p className="text-indigo-100 mt-2">Open to contracts and collaborations.</p>
            <div className="mt-8 space-y-4">
               <div>
                  <div className="text-xs font-semibold text-indigo-300 uppercase">Email</div>
                  <div className="font-medium">{profile.email}</div>
               </div>
               <div>
                  <div className="text-xs font-semibold text-indigo-300 uppercase">Location</div>
                  <div className="font-medium">{profile.location}</div>
               </div>
            </div>
          </div>
        </section>

        <footer id="resume" className="py-12 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="flex justify-center gap-6 mb-4">
             <a href={profile.socials.github} className="hover:text-indigo-600">GitHub</a>
             <a href={profile.socials.linkedin} className="hover:text-indigo-600">LinkedIn</a>
          </div>
          <div className="mt-3">© {new Date().getFullYear()} {profile.name}</div>
          
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