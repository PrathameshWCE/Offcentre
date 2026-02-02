import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, Bookmark, Calendar, User, LogOut, MapPin } from 'lucide-react';
import logo from 'figma:asset/5ae4b0c49506b866536d27f05461c1989d8ee60b.png';

interface NavigationProps {
  user: any;
  onLogout: () => void;
}

export function Navigation({ user, onLogout }: NavigationProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/post', icon: Plus, label: 'Post' },
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { path: '/planner', icon: Calendar, label: 'Weekend Planner' },
    { path: '/account', icon: User, label: 'Account' },
  ];

  return (
    <div className="w-64 bg-neutral-950 border-r border-neutral-800 fixed left-0 top-0 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="OffCentre Logo" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-xl font-semibold">OffCentre</h1>
            <p className="text-xs text-neutral-500">A Little Left. To The Heart.</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}