import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, Plus, MessageSquare, Edit3, Trash2, ChevronLeft, ChevronRight, LogOut, Camera, Search, Sparkles } from 'lucide-react';

import SmartInput from '../components/SmartInput';
import UsageWidget from '../components/UsageWidget';
import ContextCard from '../components/ContextCard';
import ChatInterface from '../components/ChatInterface';
import DiseaseDetection from '../components/DiseaseDetection';
import SmartSuggestions from '../components/SmartSuggestions';
import DailyTip from '../components/DailyTip';
import UserInsights from '../components/UserInsights';
import UpgradeModal from '../components/UpgradeModal';
import ProfileModal from '../components/ProfileModal';
import ModelMetrics from '../components/ModelMetrics';
import WeatherWidget from '../components/WeatherWidget';

export default function Dashboard({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [tier, setTier] = useState(user?.tier || 'Free');
  const [queries, setQueries] = useState(100);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/usage/stats`);
        const data = await res.json();
        if (res.ok) {
          setTier(data.tier);
          setQueries(data.queries_remaining);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  const [history, setHistory] = useState([
    { id: '1', title: 'Wheat Growth Optimization', messages: [] },
  ]);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newChat = { id: newId, title: 'New Conversation', messages: [] };
    setHistory([newChat, ...history]);
    setCurrentChatId(newId);
    setMessages([]);
    setSidebarOpen(false);
  };

  const deleteChat = (id, e) => {
    e.stopPropagation();
    const newHistory = history.filter(c => c.id !== id);
    setHistory(newHistory);
    if (currentChatId === id) {
      if (newHistory.length > 0) {
        selectChat(newHistory[0]);
      } else {
        createNewChat();
      }
    }
  };

  const selectChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages || []);
    setSidebarOpen(false);
  };

  const startEditing = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const saveTitle = (id) => {
    setHistory(history.map(c => c.id === id ? { ...c, title: editTitle } : c));
    setEditingChatId(null);
  };

  const handleSendMessage = async (text) => {
    if (queries <= 0 && tier === 'Free') {
      setShowUpgradeModal(true);
      return;
    }

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    let updatedHistory = history.map(c => {
      if (c.id === currentChatId) {
        const newTitle = c.title === 'New Conversation' ? (text.slice(0, 25) + (text.length > 25 ? '...' : '')) : c.title;
        return { ...c, title: newTitle, messages: newMessages };
      }
      return c;
    });
    setHistory(updatedHistory);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let aiContent = "";
      let finalMessages = [...newMessages, { role: 'ai', content: '' }];
      setMessages(finalMessages);
      setIsTyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiContent += decoder.decode(value, { stream: true });
        finalMessages = [...newMessages, { role: 'ai', content: aiContent }];
        setMessages(finalMessages);
      }

      setHistory(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: finalMessages } : c));
      setQueries(prev => Math.max(0, prev - 1));
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', content: "Connection error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fdf8f6]">
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 88 : 320,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        }}
        className={`fixed lg:static inset-y-0 left-0 z-50 glass-sidebar transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}
      >
        <div className={`p-8 flex items-center h-20 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0
              }}
              className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 shrink-0"
            >
              <span className="text-xl">🌱</span>
            </motion.div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-black text-earth-800 text-xl tracking-tight leading-none">KRISHI AI</span>
                <span className="text-[10px] font-bold text-primary-600 tracking-widest uppercase mt-1">Agricultural Intelligence</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button onClick={() => setIsCollapsed(true)} className="p-2 text-earth-300 hover:text-earth-600 hover:bg-earth-50 rounded-xl transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="flex flex-col items-center gap-6 mb-4">
            <button onClick={() => setIsCollapsed(false)} className="p-2 text-earth-300 hover:text-earth-600 hover:bg-earth-50 rounded-xl transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={createNewChat} className="w-12 h-12 bg-earth-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-earth-200">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )}

        {!isCollapsed && (
          <div className="px-6 mb-8">
            <button onClick={createNewChat} className="w-full flex items-center justify-center gap-2 bg-earth-800 hover:bg-earth-900 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-earth-100 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              New Conversation
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar space-y-8 pb-10">
          <div className="space-y-2">
            {!isCollapsed && (
              <h4 className="text-[10px] font-black text-earth-300 uppercase tracking-[0.2em] px-4 mb-4">Recent History</h4>
            )}
            {history.map(chat => (
              <div
                key={chat.id}
                onClick={() => selectChat(chat)}
                className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${currentChatId === chat.id ? 'bg-white shadow-md neural-border scale-[1.02]' : 'hover:bg-white/50 text-earth-500'} ${isCollapsed ? 'justify-center' : ''}`}
              >
                <MessageSquare className={`w-5 h-5 shrink-0 ${currentChatId === chat.id ? 'text-primary-600' : 'text-earth-200'}`} />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    {editingChatId === chat.id ? (
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => saveTitle(chat.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveTitle(chat.id)}
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold text-earth-800 p-0 w-full"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm font-bold truncate pr-2">{chat.title}</span>
                    )}
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => startEditing(chat, e)} className="p-1 hover:text-primary-600 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => deleteChat(chat.id, e)} className="p-1 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isCollapsed && (
            <div className="space-y-6 pt-6 border-t border-earth-100/50">
              <WeatherWidget />
              <UsageWidget queriesRemaining={queries} tier={tier} />
              <DiseaseDetection tier={tier} onUpgrade={() => setShowUpgradeModal(true)} />
              <ModelMetrics />
            </div>
          )}
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-6 lg:px-12 bg-white/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button className="lg:hidden p-3 bg-white rounded-2xl shadow-sm text-earth-600" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/60 rounded-2xl border border-white/40 shadow-sm">
              <Search className="w-4 h-4 text-earth-300" />
              <input type="text" placeholder="Search insights..." className="bg-transparent border-none text-sm focus:outline-none text-earth-800 placeholder:text-earth-300 w-48" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-white rounded-2xl shadow-sm text-earth-400 hover:text-earth-800 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-px bg-earth-100 mx-2" />
            <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-3 p-1.5 pr-4 bg-white rounded-2xl shadow-sm border border-white hover:border-primary-200 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-earth-800 text-white flex items-center justify-center font-bold text-sm group-hover:bg-primary-600 transition-colors">
                {user?.name ? user.name[0].toUpperCase() : 'F'}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-bold text-earth-800 leading-none">{user?.name || 'Farmer'}</span>
                <span className="text-[10px] font-bold text-earth-400 mt-1 uppercase tracking-tighter">{tier} Member</span>
              </div>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col p-4 lg:p-10 max-w-6xl mx-auto w-full">
          <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar px-2 sm:px-6">
            <ChatInterface messages={messages} isTyping={isTyping} />
          </div>

          <div className="shrink-0 relative z-10">
            {messages.length === 0 && (
              <div className="mb-8 overflow-x-auto no-scrollbar py-2">
                <SmartSuggestions onSelect={handleSendMessage} />
              </div>
            )}
            <SmartInput onSend={handleSendMessage} disabled={queries <= 0 && tier === 'Free'} />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-100/20 rounded-full blur-[120px] -z-10" />
      </main>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} user={user} onUpdate={setUser} />
    </div>
  );
}