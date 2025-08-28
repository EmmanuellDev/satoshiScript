import { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import LearningResources from '../components/LearningResources';
import { BookOpen, MessageCircle } from 'lucide-react';
import Particles from '../components/Particles';

const TutorPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'resources'>('chat');

  return (
    <div className="min-h-screen pt-8 relative">
      {/* Particles Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={1200}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Clarity Tutor
          </h1>
          <p className="text-xl text-gray-400">
            Learn Clarity development with personalized AI assistance
          </p>
        </div>

        <div className="flex justify-center mb-8 relative z-10">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'chat'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>AI Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'resources'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Resources</span>
            </button>
          </div>
        </div>

        <div className="relative z-10">
          {activeTab === 'chat' ? <ChatInterface /> : <LearningResources />}
        </div>
      </div>
    </div>
  );
};

export default TutorPage;