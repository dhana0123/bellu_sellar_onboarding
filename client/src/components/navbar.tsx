import { Link, useLocation } from 'wouter';
import { Building2, FileText, Home } from 'lucide-react';

const Navbar = () => {
  const [location] = useLocation();

  const navItems = [
    {
      href: '/',
      label: 'Onboarding',
      icon: Home,
      active: location === '/',
    },
    {
      href: '/api-docs',
      label: 'API Docs',
      icon: FileText,
      active: location === '/api-docs',
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-bellu-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-bellu-primary to-bellu-gold rounded-lg flex items-center justify-center">
                  <Building2 className="text-black text-lg" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Bellu Kart</div>
                  <div className="text-bellu-primary text-xs -mt-1">Seller Platform</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                        item.active
                          ? 'bg-bellu-primary/20 text-bellu-primary'
                          : 'text-gray-300 hover:text-white hover:bg-bellu-dark'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`p-2 rounded-md transition-colors duration-200 cursor-pointer ${
                        item.active
                          ? 'bg-bellu-primary/20 text-bellu-primary'
                          : 'text-gray-300 hover:text-white hover:bg-bellu-dark'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;