import { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import LearningResources from '../components/LearningResources';
import { BookOpen, MessageCircle } from 'lucide-react';
import Particles from '../components/Particles';

const TutorPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'resources'>('chat');

  return (
    <div className="min-h-screen pt-8 relative">
      {/* Particles Background - Updated with Electric Blue colors */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Particles
          particleColors={['#00D4FF', '#0099FF', '#ffffff']}
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            AI Clarity Tutor
          </h1>
          <p className="text-xl text-gray-400">
            Learn Clarity development with personalized AI assistance
          </p>
        </div>

        <div className="flex justify-center mb-8 relative z-10">
          <div className="flex bg-black/20 backdrop-blur-sm rounded-xl p-1 border border-cyan-400/20">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-400/10'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>AI Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'resources'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-400/10'
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