import { Link, useLocation } from 'react-router-dom';
import { Code2, Home, GraduationCap, Wallet } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import WalletButton from './WalletButton';

const Navbar = () => {
  const location = useLocation();
  const { isConnected } = useWallet();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/converter', icon: Code2, label: 'Converter' },
    { path: '/tutor', icon: GraduationCap, label: 'AI Tutor' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Code2 className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <div className="absolute inset-0 bg-purple-400 opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sol2Clarity
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-purple-600/30 text-purple-300 shadow-lg shadow-purple-600/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <WalletButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;