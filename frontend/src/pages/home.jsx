import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

marked.setOptions({ breaks: true, gfm: true });

const INITIAL_MESSAGE = { role: 'assistant', content: 'Hello! Ask me any technical question regarding Indian Standards, material testing criteria, or structural guidelines.' };

export default function Home() {
  const BACKEND_URL = "/api";
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputQuery, setInputQuery] = useState('');
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) setActiveFile(file);
  };

  const removeFile = () => {
    setActiveFile(null);
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
  };

  const saveCurrentChatToHistory = () => {
    const hasRealContent = messages.some(m => m.role === 'user');
    if (!hasRealContent) return;

    const firstUserMsg = messages.find(m => m.role === 'user');
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '')
      : 'New Chat';

    if (activeChatId) {
      setChatHistory(prev => prev.map(chat =>
        chat.id === activeChatId ? { ...chat, messages, title } : chat
      ));
    } else {
      const newChat = { id: Date.now().toString(), title, messages };
      setChatHistory(prev => [newChat, ...prev]);
    }
  };

  const clearChat = () => {
    saveCurrentChatToHistory();
    setActiveChatId(null);
    setMessages([{ role: 'assistant', content: 'New session started. Ask me any technical query.' }]);
  };

  const loadChat = (chatId) => {
    saveCurrentChatToHistory();
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setActiveChatId(chat.id);
      setMessages(chat.messages);
    }
  };

  const setQueryAndSubmit = (text) => {
    setInputQuery(text);
  };

  const submitQuery = async () => {
    const queryText = inputQuery.trim();
    if (!queryText && !activeFile) return;

    const displayText = queryText || `Uploaded Document: ${activeFile.name}`;
    setInputQuery('');

    setMessages(prev => [...prev, { role: 'user', content: displayText }]);
    setLoading(true);

    const currentFile = activeFile;
    setActiveFile(null);

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      let response;
      if (currentFile) {
        const formData = new FormData();
        formData.append('file', currentFile);
        response = await fetch(`${BACKEND_URL}/analyze-file`, { method: 'POST', body: formData });
      } else {
        response = await fetch(`${BACKEND_URL}/analyze-query?query=${encodeURIComponent(queryText)}`, { method: 'POST' });
      }

      if (!response.ok) throw new Error(`Server status ${response.status}`);

      const data = await response.json();
      const resultText = data.recommendation || data.analysis || 'No response received.';

      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].content = resultText;
        return newMsgs;
      });
    } catch (error) {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].content = `⚠️ Error connecting to backend: ${error.message}`;
        return newMsgs;
      });
    } finally {
      setLoading(false);
    }
  };

  const standardBadges = ['IS 456', 'IS 800', 'IS 383', 'IS 516', 'IS 2386', 'IS 1786', 'IS 9013'];

  return (
    <>
      <header className="h-16 glass-panel border-t-0 border-l-0 border-r-0 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#ddd6fe] text-xs font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffffff] animate-pulse"></span>
            Government of India · BIS
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearChat} className="bg-white/10 hover:bg-white/15 text-white/90 text-xs px-3.5 py-2 rounded-xl border border-white/20 transition-all flex items-center gap-2">
            <svg className="w-4 h-4 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            New Recommendation
          </button>
          <label className="cursor-pointer bg-white/10 hover:bg-white/15 border border-white/20 text-white/90 text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-2">
            <svg className="w-4 h-4 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span>{activeFile ? "File Attached" : "Upload Document"}</span>
            <input type="file" id="fileInput" className="hidden" onChange={handleFileSelect} />
          </label>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {chatHistory.length > 0 && (
          <div className="w-56 glass-panel border-t-0 border-l-0 border-b-0 hidden lg:flex flex-col p-3 overflow-y-auto shrink-0">
            <div className="text-[10px] font-semibold text-white/50 px-2 uppercase tracking-wider mb-2">Recent Chats</div>
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors truncate ${
                    activeChatId === chat.id
                      ? 'bg-[#ffffff]/15 text-[#c4b5fd] border border-[#ffffff]/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 1 && (
            <div className="px-6 pt-10 pb-4 max-w-4xl mx-auto w-full text-center">
              <h1 className="font-serif-title text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-white to-[#a3a3a3] mb-3 drop-shadow-md">
                CONTROL PUBLIC PROCUREMENT PORTAL
              </h1>
              <p className="text-white/75 text-sm md:text-base max-w-xl mx-auto mb-7">
                Match procurement specifications to applicable BIS standards — faster, accurate, auditable.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {standardBadges.map((badge, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQueryAndSubmit(`Tell me about ${badge}`)}
                    className="px-3.5 py-1.5 rounded-full glass-panel hover:border-[#ffffff]/60 text-xs text-white/80 hover:text-[#c4b5fd] transition-all"
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-3xl w-full mx-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl glass-panel flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#ffffff] to-[#7e22ce] text-white rounded-tr-none shadow-orange-900/30'
                    : 'glass-panel text-[#eef2ff] rounded-tl-none message-body'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content || '') }} />
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ffffff] to-[#7e22ce] flex items-center justify-center shrink-0 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {loading && messages[messages.length - 1].content === '' && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl glass-panel flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div className="glass-panel rounded-2xl p-4 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ffffff] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-[#a3a3a3] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <footer className="p-4 glass-panel border-b-0 border-l-0 border-r-0 shrink-0">
            <div className="max-w-3xl mx-auto">
              {activeFile && (
                <div className="mb-2 flex items-center gap-2 glass-panel text-[#c4b5fd] px-3 py-1.5 rounded-xl text-xs w-fit">
                  <span>{activeFile.name}</span>
                  <button onClick={removeFile} className="ml-2 hover:text-red-400 font-bold">×</button>
                </div>
              )}

              <div className="relative flex items-center glass-panel focus-within:border-[#ffffff]/70 rounded-2xl p-2 transition-all">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitQuery()}
                  placeholder="Ask about BIS codes, mix designs, or upload a document..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-[#eef2ff] placeholder-white/40 focus:outline-none"
                />
                <button onClick={submitQuery} className="bg-gradient-to-r from-[#ffffff] to-[#7e22ce] hover:from-[#ffa64d] hover:to-[#e97a3f] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md flex items-center gap-1.5">
                  <span>Send</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}