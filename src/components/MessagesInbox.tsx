
import React, { useState } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Simulation of messages data
const mockMessages = [
  {
    id: 1,
    sender: {
      name: 'Laura Bianchi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
      isOnline: true
    },
    messages: [
      {
        id: 'm1',
        content: 'Salve, ho una domanda sul vostro caffè biologico. È disponibile in formato famiglia?',
        timestamp: '2025-04-11T10:23:00Z',
        isRead: true,
        fromUser: true
      },
      {
        id: 'm2',
        content: 'Buongiorno Laura, grazie per il tuo messaggio. Sì, abbiamo confezioni da 500g ideali per famiglie. Possiamo anche creare box mensili personalizzati.',
        timestamp: '2025-04-11T10:45:00Z',
        isRead: true,
        fromUser: false
      },
      {
        id: 'm3',
        content: 'Fantastico! Quanto costa una box mensile?',
        timestamp: '2025-04-11T11:02:00Z',
        isRead: true,
        fromUser: true
      }
    ]
  },
  {
    id: 2,
    sender: {
      name: 'Marco Verdi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60',
      isOnline: false
    },
    messages: [
      {
        id: 'm4',
        content: 'Ho visitato il vostro caffè ieri, esperienza eccellente! Volevo sapere gli orari del weekend.',
        timestamp: '2025-04-10T16:30:00Z',
        isRead: true,
        fromUser: true
      },
      {
        id: 'm5',
        content: 'Grazie Marco! Nel weekend siamo aperti dalle 8:00 alle 22:00. Ti aspettiamo di nuovo!',
        timestamp: '2025-04-10T16:45:00Z',
        isRead: true,
        fromUser: false
      }
    ]
  },
  {
    id: 3,
    sender: {
      name: 'Giulia Rossi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
      isOnline: true
    },
    messages: [
      {
        id: 'm6',
        content: 'Vorrei prenotare un tavolo per 6 persone questo venerdì alle 19:00. È possibile?',
        timestamp: '2025-04-12T09:15:00Z',
        isRead: false,
        fromUser: true
      }
    ]
  },
];

const MessagesInbox = () => {
  const [conversations, setConversations] = useState(mockMessages);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredConversations = conversations.filter(conv => 
    conv.sender.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || selectedConversation === null) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: `m${Date.now()}`,
              content: newMessage,
              timestamp: new Date().toISOString(),
              isRead: true,
              fromUser: false
            }
          ]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setNewMessage('');
    toast({
      title: "Messaggio inviato",
      description: "Il tuo messaggio è stato inviato con successo."
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === selectedConversation);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm h-[600px] flex">
      {/* Conversation List */}
      <div className="w-1/3 border-r">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cerca conversazioni..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[555px]">
          {filteredConversations.map(conversation => (
            <div 
              key={conversation.id} 
              className={`p-3 border-b flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${selectedConversation === conversation.id ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="relative">
                <Avatar>
                  <img src={conversation.sender.avatar} alt={conversation.sender.name} />
                </Avatar>
                {conversation.sender.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">{conversation.sender.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(conversation.messages[conversation.messages.length - 1].timestamp)}
                  </span>
                </div>
                <p className={`text-sm truncate ${!conversation.messages[conversation.messages.length - 1].isRead && conversation.messages[conversation.messages.length - 1].fromUser ? 'font-semibold' : 'text-gray-500'}`}>
                  {conversation.messages[conversation.messages.length - 1].content}
                </p>
              </div>
              {!conversation.messages[conversation.messages.length - 1].isRead && conversation.messages[conversation.messages.length - 1].fromUser && (
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation !== null ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b flex items-center gap-3">
              <Avatar>
                <img 
                  src={getCurrentConversation()?.sender.avatar} 
                  alt={getCurrentConversation()?.sender.name} 
                />
              </Avatar>
              <div>
                <p className="font-medium">{getCurrentConversation()?.sender.name}</p>
                <p className="text-xs text-gray-500">
                  {getCurrentConversation()?.sender.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {getCurrentConversation()?.messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.fromUser ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.fromUser 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 text-right ${message.fromUser ? 'text-gray-500' : 'text-blue-100'}`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 border-t flex gap-2">
              <Input 
                placeholder="Scrivi un messaggio..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
            <Mail className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">I tuoi messaggi</h3>
            <p className="text-gray-500 max-w-md">
              Seleziona una conversazione per visualizzare i messaggi o inizia una nuova chat con i tuoi clienti.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesInbox;
