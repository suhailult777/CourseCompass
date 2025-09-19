import { Link, useLocation } from "wouter";
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigationItems = [
  { path: "/", label: "Dashboard" },
  { path: "/course-types", label: "Course Types" },
  { path: "/courses", label: "Courses" },
  { path: "/course-offerings", label: "Course Offerings" },
  { path: "/registrations", label: "Registrations" },
];

export default function Header() {
  const [location] = useLocation();

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigationItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <Button
            variant={location === item.path ? "secondary" : "ghost"}
            size={mobile ? "default" : "sm"}
            className={mobile ? "w-full justify-start" : ""}
            data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </>
  );

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <GraduationCap className="h-8 w-8 text-primary" data-testid="logo" />
            </div>
            <h1 className="text-xl font-semibold text-foreground" data-testid="app-title">
              Student Registration System
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <NavItems />
          </nav>
          
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" data-testid="mobile-menu-trigger">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-2 mt-8">
                <NavItems mobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
