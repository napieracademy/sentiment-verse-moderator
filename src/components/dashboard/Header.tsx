import { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { Bell, Home, BarChart2, MessageSquare, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  // Array delle pagine principali per la navigazione
  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/facebook-data", label: "Facebook Data", icon: Database }
  ];

  return (
    <header className="border-b py-3 px-6 bg-white z-10">
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="bg-facebook p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M13 8H7" />
                <path d="M13 12H7" />
              </svg>
            </div>
            <span className="font-bold">SentimentVerse</span>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors
                   ${isActive 
                     ? 'bg-blue-50 text-blue-700' 
                     : 'text-gray-700 hover:bg-gray-100'
                   }`
                }
                end={item.path === "/"}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setNotificationsVisible(!notificationsVisible)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </Button>
            
            {notificationsVisible && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Notifiche</h3>
                    <Button variant="ghost" size="sm">Segna tutto come letto</Button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {[
                    { id: 1, title: "Nuovo commento", desc: "Mario ha commentato il tuo post", time: "2 minuti fa", unread: true },
                    { id: 2, title: "Sentiment negativo", desc: "Rilevato commento con sentiment negativo", time: "10 minuti fa", unread: true },
                    { id: 3, title: "Aggiornamento automazione", desc: "L'automazione 'Risposte automatiche' è stata attivata", time: "1 ora fa", unread: false },
                    { id: 4, title: "Nuovo follower", desc: "Luigi ha iniziato a seguire la tua pagina", time: "3 ore fa", unread: false }
                  ].map(notif => (
                    <div key={notif.id} className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${notif.unread ? 'border-l-4 border-blue-500' : ''}`}>
                      <div className="font-medium text-sm">{notif.title}</div>
                      <div className="text-xs text-gray-600">{notif.desc}</div>
                      <div className="text-xs text-gray-500 mt-1">{notif.time}</div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t bg-gray-50">
                  <Button variant="ghost" size="sm" className="w-full text-sm">
                    Visualizza tutte le notifiche
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button
            onClick={() => navigate('/select-page')}
            variant="outline"
            size="sm"
            className="text-sm"
          >
            Cambia Pagina
          </Button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=60"
                alt="User Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-medium">Mario Rossi</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
