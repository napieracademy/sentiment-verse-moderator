import { ChevronUp, Menu } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { 
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent 
} from "@/components/ui/collapsible";
import { menuItems, toolItems } from "./MenuItems";
import { Home, BarChart2, MessageSquare, Database } from "lucide-react";

interface DrawerMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DrawerMenu = ({ activeTab, setActiveTab }: DrawerMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mainMenuOpen, setMainMenuOpen] = useState(true);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Array delle pagine principali per la navigazione
  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/facebook-data", label: "Facebook Data", icon: Database },
    { path: "/insights", label: "Insights", icon: BarChart2 },
    { path: "/post-insights", label: "Post Insights", icon: BarChart2 }
  ];
  
  // Add border effect when menu is open
  useEffect(() => {
    const root = document.getElementById('root');
    if (root && menuOpen) {
      root.style.border = '2px solid black';
      root.style.borderRadius = '12px';
      root.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    } else if (root) {
      root.style.border = 'none';
      root.style.borderRadius = '0';
      root.style.boxShadow = 'none';
    }
    
    return () => {
      if (root) {
        root.style.border = 'none';
        root.style.borderRadius = '0';
        root.style.boxShadow = 'none';
      }
    };
  }, [menuOpen]);
  
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerTrigger asChild>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg bg-facebook hover:bg-facebook/90 transition-all"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent 
          className="max-h-[80vh] w-[250px] left-6 right-auto bottom-[72px] top-auto rounded-lg shadow-xl"
        >
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          <div className="px-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <DrawerTitle className="text-xl font-bold">Menu</DrawerTitle>
              <DrawerDescription className="sr-only">Navigation menu</DrawerDescription>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" aria-label="Close menu">
                  <ChevronUp className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </div>

            {/* Navigation Menu */}
            <Collapsible
              open={navMenuOpen}
              onOpenChange={setNavMenuOpen}
              className="mb-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-semibold text-gray-500 mb-1">Navigazione</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    {navMenuOpen ? "Chiudi" : "Apri"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="flex flex-col space-y-1 mt-2">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className={`justify-start h-10 text-sm ${
                        location.pathname === item.path 
                          ? "bg-facebook text-primary-foreground font-medium" 
                          : "hover:bg-accent"
                      }`}
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.label}</span>
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Main Menu */}
            <Collapsible
              open={mainMenuOpen}
              onOpenChange={setMainMenuOpen}
              className="mb-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-semibold text-gray-500 mb-1">Menu Principale</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    {mainMenuOpen ? "Chiudi" : "Apri"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="flex flex-col space-y-1 mt-2">
                  {menuItems.map((item) => (
                    <Button
                      key={item.value}
                      variant={activeTab === item.value ? "default" : "ghost"}
                      className={`justify-start h-10 text-sm ${
                        activeTab === item.value 
                          ? "bg-facebook text-primary-foreground font-medium" 
                          : "hover:bg-accent"
                      }`}
                      onClick={() => {
                        setActiveTab(item.value);
                        setMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <div className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {item.badge}
                        </div>
                      )}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Tools Menu */}
            <Collapsible
              open={toolsMenuOpen}
              onOpenChange={setToolsMenuOpen}
              className="mb-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-semibold text-gray-500 mb-1">Strumenti</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    {toolsMenuOpen ? "Chiudi" : "Apri"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="flex flex-col space-y-1 mt-2">
                  {toolItems.map((item) => (
                    <Button
                      key={item.value}
                      variant={activeTab === item.value ? "default" : "ghost"}
                      className={`justify-start h-10 text-sm ${
                        activeTab === item.value 
                          ? "bg-facebook text-primary-foreground font-medium" 
                          : "hover:bg-accent"
                      }`}
                      onClick={() => {
                        setActiveTab(item.value);
                        setMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="mt-6 text-center text-xs text-gray-500 font-medium">
              SentimentVerse v1.0.0
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DrawerMenu;
