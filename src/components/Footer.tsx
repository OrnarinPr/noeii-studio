import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl tracking-[0.15em] font-light mb-4">
              NOEII
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Architecture studio dedicated to creating minimal spaces with timeless elegance.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-caption mb-6">Navigation</h4>
            <ul className="space-y-3">
              {["Home", "Projects", "About", "Staff", "Shop"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-caption mb-6">Contact</h4>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              <p>Tokyo, Japan</p>
              <p>info@noeii-arch.jp</p>
              <p>+81 3 1234 5678</p>
            </address>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} NOEII ARCH STUDIO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
