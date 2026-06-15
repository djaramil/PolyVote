import { useState } from 'react';
import { BarChart3, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, logOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleLogOut = () => {
    logOut();
  };

  const handleLogInClick = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-edge/70 bg-ink/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-6">
          <div className="flex items-center gap-2 font-extrabold text-lg">
            <span className="grid place-items-center h-8 w-8 rounded-xl bg-brand/20 text-brand">
              <BarChart3 className="h-5 w-5" />
            </span>
            Poly<span className="text-brand">Vote</span>
          </div>
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            <button className="tab tab-active px-3 py-1.5 rounded-full border border-transparent">All</button>
            <button className="tab px-3 py-1.5 rounded-full border border-transparent hover:bg-surface2">Politics</button>
            <button className="tab px-3 py-1.5 rounded-full border border-transparent hover:bg-surface2">Technology</button>
            <button className="tab px-3 py-1.5 rounded-full border border-transparent hover:bg-surface2">Sports</button>
            <button className="tab px-3 py-1.5 rounded-full border border-transparent hover:bg-surface2">Business</button>
            <button className="tab px-3 py-1.5 rounded-full border border-transparent hover:bg-surface2">Science</button>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-sm">{user.username || user.email}</span>
                </div>
                <button
                  onClick={handleLogOut}
                  className="px-3 py-1.5 text-sm rounded-lg hover:bg-surface2 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={handleLogInClick} className="px-3 py-1.5 text-sm rounded-lg hover:bg-surface2">Log in</button>
                <button onClick={handleSignUpClick} className="px-3 py-1.5 text-sm rounded-lg bg-brand text-white font-medium hover:opacity-90">Sign up</button>
              </>
            )}
          </div>
        </div>
      </header>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode={authMode} />
    </>
  );
}
