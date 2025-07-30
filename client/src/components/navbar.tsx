import { Link, useLocation } from 'wouter';
import { Building2, FileText, Home, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      // Invalidate session cache and redirect
      queryClient.invalidateQueries({ queryKey: ['/api/session'] });
      setLocation('/');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    },
  });

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <Building2 className="text-black text-lg" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">bellu.ai</div>
                  <div className="text-gray-400 text-xs -mt-1">Seller Platform</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                        item.active
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* Authentication Section */}
            {!isLoading && (
              <div className="flex items-center space-x-4 ml-4 border-l border-gray-800 pl-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-white">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{user?.brandName || user?.email}</span>
                    </div>
                    <Button
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setLocation('/login')}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Login
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`p-2 rounded-md transition-colors duration-200 cursor-pointer ${
                        item.active
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile Authentication */}
            {!isLoading && (
              <div className="border-l border-gray-800 pl-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setLocation('/login')}
                    className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;