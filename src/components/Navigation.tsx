import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "Staff", path: "/staff" },
  { name: "Shop", path: "/shop" },
];

interface NavigationProps {
  transparent?: boolean;
}

export const Navigation = ({ transparent = false }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!transparent) return;
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  const isTransparent = transparent && !scrolled && !isOpen;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent 
          ? "bg-transparent" 
          : "bg-background/95 backdrop-blur-sm"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link 
            to="/" 
            className={`font-serif text-xl md:text-2xl tracking-[0.15em] font-light transition-colors ${
              isTransparent ? "text-white" : "text-foreground"
            }`}
          >
            NOEII
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`text-caption link-underline transition-colors ${
                    isTransparent 
                      ? location.pathname === link.path 
                        ? "text-white" 
                        : "text-white/70 hover:text-white"
                      : location.pathname === link.path 
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 -mr-2 transition-colors ${
              isTransparent ? "text-white" : "text-foreground"
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border/50 animate-fade-in">
            <ul className="container-custom py-8 space-y-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-caption block py-2 ${
                      location.pathname === link.path 
                        ? "text-foreground" 
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};
