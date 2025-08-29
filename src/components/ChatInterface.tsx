import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI Clarity tutor. I can help you understand Clarity syntax, explain smart contract concepts, and guide you through Stacks development. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "What is Clarity?",
    "How do I define a function?",
    "Explain data types in Clarity",
    "What are maps and vars?",
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Make API call to the provided endpoint
      const response = await fetch('https://satoshiscript-aiagent.onrender.com/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from API');
      }

      const data = await response.json();
      await new Promise(res => setTimeout(res, 2000)); // AI thinking delay
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        // Assuming the API returns a 'response' field with the answer
        content: data.response || 'Sorry, I could not process your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Oops! Something went wrong while fetching the response. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg bg-opacity-40 rounded-2xl border border-cyan-400/20 overflow-hidden h-100 shadow-xl max-w-3xl mx-auto">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className={`max-w-md p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white ml-auto'
                  : 'bg-cyan-400/10 text-gray-100 border border-cyan-400/20'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-cyan-400/10 p-3 rounded-lg border border-cyan-400/20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div className="p-4 border-t border-cyan-400/20">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="flex items-center space-x-1 px-3 py-1 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 text-sm rounded-full transition-all duration-300 border border-cyan-400/20 hover:border-cyan-400/40"
              >
                <Lightbulb className="h-3 w-3" />
                <span>{question}</span>
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about Clarity..."
              className="flex-1 bg-cyan-400/10 border border-cyan-400/30 rounded-lg px-4 py-2 text-white placeholder-cyan-300/60 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;