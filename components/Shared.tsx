import React from 'react';
import { StatProps, SocialIconProps } from '../types';

export const Stat: React.FC<StatProps> = ({ label, value }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
};

export const SocialIcon: React.FC<SocialIconProps> = ({ label, href }) => {
  return (
    <a href={href} className="px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-50 transition-colors">
      {label}
    </a>
  );
};

export const MobileMenu: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="px-3 py-2 rounded-md border hover:bg-gray-50">Menu</button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-3 border z-50">
          <a className="block py-2 hover:text-indigo-600" href="#projects" onClick={() => setOpen(false)}>Projects</a>
          <a className="block py-2 hover:text-indigo-600" href="#skills" onClick={() => setOpen(false)}>Skills</a>
          <a className="block py-2 hover:text-indigo-600" href="#experience" onClick={() => setOpen(false)}>Experience</a>
          <a className="block py-2 hover:text-indigo-600" href="#contact" onClick={() => setOpen(false)}>Contact</a>
        </div>
      )}
    </div>
  );
};