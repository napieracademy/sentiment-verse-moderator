
import { 
  MessageSquare, Mail, Shield, Zap, BarChart2, 
  Home, Calendar, Users, Tag, Clock, Download, 
  Search, Settings
} from "lucide-react";

// Main navigation menu items
export const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    value: "comments"
  },
  {
    title: "Commenti",
    icon: MessageSquare,
    value: "comments" 
  },
  {
    title: "Messaggi",
    icon: Mail,
    value: "messages",
    badge: "3"
  },
  {
    title: "Moderazione",
    icon: Shield,
    value: "moderation"
  },
  {
    title: "Automazione",
    icon: Zap,
    value: "automation"
  },
  {
    title: "Analytics",
    icon: BarChart2,
    value: "insights"
  }
];

// Tools menu items
export const toolItems = [
  {
    title: "Calendario",
    icon: Calendar,
    value: "calendar"
  },
  {
    title: "Utenti Attivi",
    icon: Users,
    value: "users"
  },
  {
    title: "Tag",
    icon: Tag,
    value: "tags"
  },
  {
    title: "Attività",
    icon: Clock,
    value: "activity"
  },
  {
    title: "Esporta dati",
    icon: Download,
    value: "export"
  },
  {
    title: "Ricerca avanzata",
    icon: Search,
    value: "search"
  },
  {
    title: "Impostazioni",
    icon: Settings,
    value: "settings"
  }
];
