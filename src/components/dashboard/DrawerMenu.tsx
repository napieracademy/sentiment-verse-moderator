
import { ChevronUp, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { 
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent 
} from "@/components/ui/collapsible";
import { menuItems, toolItems } from "./MenuItems";
import { useState } from "react";

interface DrawerMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DrawerMenu = ({ activeTab, setActiveTab }: DrawerMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mainMenuOpen, setMainMenuOpen] = useState(true);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerTrigger asChild>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Menu</h2>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>

            {/* Main Menu */}
            <Collapsible
              open={mainMenuOpen}
              onOpenChange={setMainMenuOpen}
              className="mb-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">MENU PRINCIPALE</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {mainMenuOpen ? "Collassa" : "Espandi"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="flex flex-col space-y-1 mt-2">
                  {menuItems.map((item) => (
                    <Button
                      key={item.value}
                      variant={activeTab === item.value ? "default" : "ghost"}
                      className={`justify-start h-10 px-2 ${
                        activeTab === item.value ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => {
                        setActiveTab(item.value);
                        setMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <div className="ml-auto bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
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
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">STRUMENTI</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {toolsMenuOpen ? "Collassa" : "Espandi"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="flex flex-col space-y-1 mt-2">
                  {toolItems.map((item) => (
                    <Button
                      key={item.value}
                      variant={activeTab === item.value ? "default" : "ghost"}
                      className={`justify-start h-10 px-2 ${
                        activeTab === item.value ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => {
                        setActiveTab(item.value);
                        setMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.title}</span>
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="mt-8 text-center text-xs text-gray-500">
              SentimentVerse v1.0.0
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DrawerMenu;
