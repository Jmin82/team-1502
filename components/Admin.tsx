
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabaseClient';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'chatlogs'>('inquiries');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Mock Authentication for Demo
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1502admin') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Access Denied');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Inquiries
      const { data: inquiryData, error: inquiryError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!inquiryError && inquiryData) {
        setInquiries(inquiryData);
      }

      // Fetch Chat Logs
      const { data: chatData, error: chatError } = await supabase
        .from('chat_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!chatError && chatData) {
        setChatLogs(chatData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-display text-white mb-6 text-center">TEAM 1502 ADMIN</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Key"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs">A</div>
           <span className="font-display font-bold tracking-wider">ADMIN CONSOLE</span>
        </div>
        <button onClick={() => window.location.href = '/'} className="text-xs text-neutral-400 hover:text-white transition-colors">Exit</button>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 p-4 hidden md:block">
           <nav className="space-y-2">
             <button 
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'inquiries' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-neutral-400 hover:bg-white/5'}`}
             >
                <Icon icon="solar:letter-linear" width={18} />
                Inquiries
             </button>
             <button 
                onClick={() => setActiveTab('chatlogs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'chatlogs' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-neutral-400 hover:bg-white/5'}`}
             >
                <Icon icon="solar:chat-line-linear" width={18} />
                Chat Summaries
             </button>
           </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
           
           <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">{activeTab === 'inquiries' ? 'Project Inquiries' : 'AI Chat Logs'}</h1>
              <button onClick={fetchData} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <Icon icon="solar:refresh-linear" width={20} className={loading ? "animate-spin" : ""} />
              </button>
           </div>

           {/* Content Grid */}
           <div className="grid gap-4">
              {activeTab === 'inquiries' ? (
                 inquiries.length === 0 ? (
                    <div className="text-neutral-500 text-center py-20">No inquiries found.</div>
                 ) : (
                    inquiries.map((item) => (
                       <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={item.id} 
                          className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                       >
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                <p className="text-blue-400 text-sm">{item.email}</p>
                             </div>
                             <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase tracking-wider">{item.project_type}</span>
                          </div>
                          <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap bg-black/20 p-4 rounded-lg">{item.message}</p>
                          <div className="mt-4 text-xs text-neutral-500 text-right">{new Date(item.created_at).toLocaleString()}</div>
                       </motion.div>
                    ))
                 )
              ) : (
                 chatLogs.length === 0 ? (
                    <div className="text-neutral-500 text-center py-20">No chat logs found.</div>
                 ) : (
                    chatLogs.map((log) => (
                       <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={log.id} 
                          className="bg-gradient-to-br from-purple-900/10 to-blue-900/10 border border-white/10 rounded-xl p-6"
                       >
                          <div className="flex items-center gap-2 mb-4">
                             <span className="w-2 h-2 rounded-full bg-green-500"></span>
                             <span className="text-xs text-neutral-400 font-mono">SESSION ID: {log.id}</span>
                             <span className="ml-auto text-xs text-neutral-500">{new Date(log.created_at).toLocaleString()}</span>
                          </div>
                          <div className="space-y-4">
                             <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">AI Summary</h4>
                                <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">{log.summary}</p>
                             </div>
                          </div>
                       </motion.div>
                    ))
                 )
              )}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
