import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Home, User, Activity, BarChart3, Menu, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Activities", href: "/activities", icon: Activity },
    { name: "Progress", href: "/progress", icon: BarChart3 },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Top Navigation */}
      <nav className="bg-card/80 backdrop-blur border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover-lift">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic">
                EMR Play
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="font-comic"
                >
                  <Link to={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50">
              <div className="grid grid-cols-2 gap-2">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    variant={isActive(item.href) ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className="font-comic justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur border-t border-border/50 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={isActive(item.href) ? "default" : "ghost"}
              size="sm"
              asChild
              className="flex-col h-12 font-comic"
            >
              <Link to={item.href}>
                <item.icon className="h-4 w-4 mb-1" />
                <span className="text-xs">{item.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </nav>

      {/* Bottom spacing for mobile nav */}
      <div className="md:hidden h-16" />
    </div>
  );
};

export default Layout;