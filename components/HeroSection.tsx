import React, { useRef, useState, useEffect } from 'react';
import { Stat, SocialIcon } from './Shared';
import { Profile } from '../types';

interface HeroSectionProps {
  isAdmin: boolean;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  profileImage: string | null;
  setProfileImage: (img: string) => void;
  resumeUrl: string;
  setResumeUrl: (url: string) => void;
  projectCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isAdmin,
  profile,
  setProfile,
  profileImage,
  setProfileImage,
  resumeUrl,
  setResumeUrl,
  projectCount
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Profile>(profile);

  // Sync editValues if profile changes externally (though mainly controlled here)
  useEffect(() => {
    if (!isEditing) setEditValues(profile);
  }, [profile, isEditing]);

  const handleSave = () => {
    setProfile(editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues(profile);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // LocalStorage has a limit (usually 5MB total). 
      // We limit resume upload to 2MB to leave room for other data.
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large for local storage (Limit 2MB). Please compress your PDF or use a smaller file.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative group/hero">
      {isAdmin && !isEditing && (
         <button 
           onClick={() => setIsEditing(true)}
           className="absolute top-0 right-0 z-10 px-3 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-200 text-xs font-medium hover:bg-indigo-100 opacity-0 group-hover/hero:opacity-100 transition-opacity"
         >
           Edit Profile Details
         </button>
      )}

      <div className="md:col-span-2">
        {isEditing ? (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Edit Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                <input 
                  className="w-full border rounded px-3 py-2 text-sm" 
                  value={editValues.name}
                  onChange={e => setEditValues({...editValues, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Role / Job Title</label>
                 <input 
                  className="w-full border rounded px-3 py-2 text-sm" 
                  value={editValues.role}
                  onChange={e => setEditValues({...editValues, role: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bio</label>
              <textarea 
                rows={3}
                className="w-full border rounded px-3 py-2 text-sm" 
                value={editValues.bio}
                onChange={e => setEditValues({...editValues, bio: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                <label className="block text-xs text-gray-500 mb-1">Years Exp</label>
                <input 
                  className="w-full border rounded px-3 py-2 text-sm" 
                  value={editValues.stats.yearsExp}
                  onChange={e => setEditValues({...editValues, stats: {...editValues.stats, yearsExp: e.target.value}})}
                />
               </div>
               <div>
                <label className="block text-xs text-gray-500 mb-1">Certifications</label>
                <input 
                  className="w-full border rounded px-3 py-2 text-sm" 
                  value={editValues.stats.certs}
                  onChange={e => setEditValues({...editValues, stats: {...editValues.stats, certs: e.target.value}})}
                />
               </div>
               <div>
                <label className="block text-xs text-gray-500 mb-1">Uptime</label>
                <input 
                  className="w-full border rounded px-3 py-2 text-sm" 
                  value={editValues.stats.uptime}
                  onChange={e => setEditValues({...editValues, stats: {...editValues.stats, uptime: e.target.value}})}
                />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-xs text-gray-500 mb-1">Location</label>
                <input 
                  className="w-full border rounded px-3 py-2 text-sm" 
                  value={editValues.location}
                  onChange={e => setEditValues({...editValues, location: e.target.value})}
                />
               </div>
               <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input 
                  className="w-full border rounded px-3 py-2 text-sm" 
                  value={editValues.email}
                  onChange={e => setEditValues({...editValues, email: e.target.value})}
                />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-xs text-gray-500 mb-1">GitHub URL</label>
                <input 
                  className="w-full border rounded px-3 py-2 text-sm" 
                  value={editValues.socials.github}
                  onChange={e => setEditValues({...editValues, socials: {...editValues.socials, github: e.target.value}})}
                  placeholder="https://github.com/..."
                />
               </div>
               <div>
                <label className="block text-xs text-gray-500 mb-1">LinkedIn URL</label>
                <input 
                  className="w-full border rounded px-3 py-2 text-sm" 
                  value={editValues.socials.linkedin}
                  onChange={e => setEditValues({...editValues, socials: {...editValues.socials, linkedin: e.target.value}})}
                  placeholder="https://linkedin.com/in/..."
                />
               </div>
            </div>
            
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <label className="block text-xs font-bold text-gray-700 mb-1">Contact Form Service URL (Optional)</label>
                <p className="text-xs text-gray-500 mb-2">
                  Paste a URL from a service like <a href="https://formspree.io" target="_blank" className="underline text-indigo-600">Formspree</a> to receive emails directly. 
                  <br/>If left empty, the "Send Message" button will open the user's default email client (mailto).
                </p>
                <input 
                  className="w-full border rounded px-3 py-2 text-sm placeholder:text-gray-300" 
                  value={editValues.formActionUrl || ''}
                  onChange={e => setEditValues({...editValues, formActionUrl: e.target.value})}
                  placeholder="e.g. https://formspree.io/f/your_id"
                />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">Save Changes</button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">{profile.name}</span> <br/> {profile.role}
            </h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <a href="#projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors font-medium">See projects</a>
              <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium shadow-md shadow-indigo-200">Get in touch</a>
              
              <div className="relative group">
                <a 
                  href={resumeUrl} 
                  download={resumeUrl !== '#' ? "Resume.pdf" : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium ${(!resumeUrl || resumeUrl === '#') && !isAdmin ? 'opacity-50 cursor-not-allowed' : 'bg-white'}`}
                  onClick={(e) => { if((!resumeUrl || resumeUrl === '#') && !isAdmin) e.preventDefault() }}
                >
                  Download Resume
                </a>
                {isAdmin && (
                  <>
                    <button 
                      onClick={() => resumeInputRef.current?.click()}
                      className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-full shadow-sm hover:bg-indigo-700 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Upload Resume (PDF)"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <input 
                      type="file" 
                      ref={resumeInputRef} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleResumeUpload}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="Years Exp." value={profile.stats.yearsExp} />
              <Stat label="Projects" value={projectCount.toString()} />
              <Stat label="Certs" value={profile.stats.certs} />
              <Stat label="Uptime" value={profile.stats.uptime} />
            </div>
          </>
        )}
      </div>

      <div className="order-first md:order-last flex justify-center md:justify-end">
        <div className="rounded-2xl p-4 bg-white shadow-xl shadow-gray-200/50 border border-gray-100 w-full max-w-sm relative group">
          
          <div className="w-full aspect-square rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400 overflow-hidden relative">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-center px-4">Profile Image Placeholder<br/>(Drop image here)</span>
            )}

            {isAdmin && (
              <div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={() => imageInputRef.current?.click()}
              >
                <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-md backdrop-blur-sm">Upload Photo</span>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={imageInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload}
          />

          <div className="mt-6 space-y-3">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</div>
              <div className="font-medium text-gray-800">{profile.location}</div>
            </div>
            <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</div>
                <a href={`mailto:${profile.email}`} className="block font-medium text-indigo-600 hover:underline">{profile.email}</a>
            </div>
            
            <div className="pt-2 flex gap-2">
              <SocialIcon label="GitHub" href={profile.socials.github} />
              <SocialIcon label="LinkedIn" href={profile.socials.linkedin} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}