
import React from "react";
import { 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Shield, 
  Zap
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "./Logo";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  const menuItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: MessageSquare,
      label: "Messaggi",
      path: "/messages",
    },
    {
      icon: Shield,
      label: "Moderazione",
      path: "/moderation",
    },
    {
      icon: Zap,
      label: "Automazione",
      path: "/automation",
    },
    {
      icon: Settings,
      label: "Impostazioni",
      path: "/settings",
    },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex justify-center items-center py-4 border-b border-sidebar-border">
        <Logo collapsed={collapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                tooltip={item.label}
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border py-2 px-2">
        <div className="text-xs text-sidebar-foreground/50 text-center">
          {!collapsed && "© 2025 CatAdmin"}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
