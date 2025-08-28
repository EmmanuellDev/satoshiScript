import { useState } from 'react';
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

  const quickQuestions = [
    "What is Clarity?",
    "How do I define a function?",
    "Explain data types in Clarity",
    "What are maps and vars?",
  ];

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

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: getBotResponse(inputValue),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('clarity')) {
      return "Clarity is a decidable smart contract language that optimizes for predictability and security. Unlike other smart contract languages, Clarity is interpreted (not compiled) and the complete call graph of any function is statically knowable. This eliminates whole classes of bugs and makes Clarity contracts more secure.";
    } else if (input.includes('function')) {
      return "In Clarity, you can define functions using `define-public`, `define-private`, or `define-read-only`. Here's an example:\n\n```clarity\n(define-public (my-function (param uint))\n  (ok param)\n)\n```\n\n- `define-public`: Creates a public function that can be called by other contracts\n- `define-private`: Creates a private function only callable within the contract\n- `define-read-only`: Creates a read-only function that doesn't modify state";
    } else if (input.includes('data type')) {
      return "Clarity has several built-in data types:\n\n• `uint` - Unsigned integers\n• `int` - Signed integers\n• `bool` - Boolean values (true/false)\n• `principal` - Stacks addresses\n• `buff` - Byte buffers\n• `string-ascii` / `string-utf8` - String types\n• `(list)` - Lists of elements\n• `(tuple)` - Key-value pairs\n• `(optional)` - Values that may or may not exist\n• `(response)` - Success/error responses";
    } else if (input.includes('map') || input.includes('var')) {
      return "Data storage in Clarity:\n\n**Maps** - Key-value storage:\n```clarity\n(define-map user-balances principal uint)\n(map-set user-balances tx-sender u100)\n```\n\n**Data Variables** - Simple storage:\n```clarity\n(define-data-var counter uint u0)\n(var-set counter u10)\n(var-get counter)\n```\n\nMaps are for associative data, while data vars store single values.";
    } else {
      return "That's a great question! I can help you with:\n\n• Clarity syntax and language features\n• Smart contract patterns and best practices\n• Stacks blockchain concepts\n• Debugging and optimization tips\n\nTry asking about specific Clarity concepts, or use one of the quick questions below for common topics!";
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden h-96">
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
                  ? 'bg-purple-600' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className={`max-w-md p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-purple-600 text-white ml-auto'
                  : 'bg-white/10 text-gray-100'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 text-sm rounded-full transition-all duration-300"
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
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
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