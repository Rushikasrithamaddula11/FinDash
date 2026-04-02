import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your FinDash assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setInput('');

    // Mock bot logic
    setTimeout(() => {
      let response = "I'm a simple assistant. I can help with general FinDash navigation!";
      const lower = userText.toLowerCase();
      if (lower.includes('password') || lower.includes('otp') || lower.includes('login')) {
        response = "To manage your password, go to the User Portal or click 'Forgot Password'. Admins can login directly via their specific admin portal link.";
      } else if (lower.includes('record') || lower.includes('expense') || lower.includes('income')) {
        response = "You can view all transaction entries in the 'Records' tab on your left sidebar!";
      } else if (lower.includes('hello') || lower.includes('hi')) {
        response = "Hello! Let me know if you need help finding anything specific in FinDash.";
      } else if (lower.includes('admin')) {
        response = "System administrators can login through the admin portal using their raw credentials.";
      }
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    }, 600);
  };

  return (
    <div className="z-50 shrink-0">
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-transform transform ${isOpen ? 'scale-0' : 'scale-100'} z-50 focus:outline-none focus:ring-4 focus:ring-blue-200`}
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      <div className={`fixed bottom-6 right-6 w-[calc(100vw-3rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'} z-50 h-[30rem] max-h-[85vh]`}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-t-2xl flex justify-between items-center text-white">
          <div>
            <h3 className="font-bold flex items-center"><MessageCircle className="w-4 h-4 mr-2" /> FinDash Assistant</h3>
            <p className="text-xs text-blue-100 ml-6">Online</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.isBot ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm' : 'bg-blue-600 text-white rounded-tr-none shadow-md'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 rounded-b-2xl flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-grow px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!input.trim()}>
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
