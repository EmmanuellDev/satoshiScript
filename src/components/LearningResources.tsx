import { ExternalLink, Book, Video, Code, FileText, ArrowRight, Zap } from 'lucide-react';
import Particles from '../components/Particles';

const LearningResources = () => {
  const resources = [
    {
      type: 'documentation',
      icon: Book,
      title: 'Clarity Language Reference',
      description: 'Complete documentation for the Clarity smart contract language',
      link: '#',
      difficulty: 'Beginner',
    },
    {
      type: 'tutorial',
      icon: Video,
      title: 'Building Your First Clarity Contract',
      description: 'Step-by-step video tutorial for creating smart contracts',
      link: '#',
      difficulty: 'Beginner',
    },
    {
      type: 'example',
      icon: Code,
      title: 'Smart Contract Examples',
      description: 'Collection of real-world Clarity contract examples',
      link: '#',
      difficulty: 'Intermediate',
    },
    {
      type: 'guide',
      icon: FileText,
      title: 'Stacks Blockchain Guide',
      description: 'Understanding the Stacks blockchain and Bitcoin integration',
      link: '#',
      difficulty: 'Intermediate',
    },
    {
      type: 'tutorial',
      icon: Video,
      title: 'Advanced Clarity Patterns',
      description: 'Learn advanced patterns and best practices',
      link: '#',
      difficulty: 'Advanced',
    },
    {
      type: 'documentation',
      icon: Book,
      title: 'Testing Clarity Contracts',
      description: 'Guide to testing and debugging Clarity smart contracts',
      link: '#',
      difficulty: 'Intermediate',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-600/20 text-green-400 border-green-400/30';
      case 'Intermediate':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-400/30';
      case 'Advanced':
        return 'bg-red-600/20 text-red-400 border-red-400/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-400/30';
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Full Background Particles - Updated with Electric Blue colors */}
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
      
      {/* Enhanced Floating Elements with Electric Blue theme */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-cyan-300/20 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute bottom-1/3 right-1/4 w-14 h-14 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-700"></div>

      {/* Content Container - Positioned above particles */}
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Learning Resources
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive resources to master Clarity and Stacks development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div
                key={index}
                className="group bg-black/20 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-400/20"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {resource.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 mb-4 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {resource.description}
                    </p>
                    
                    <a
                      href={resource.link}
                      className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors group/link"
                    >
                      <span>Learn More</span>
                      <ExternalLink className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-cyan-400/30">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-4">
            Ready to Start Building?
          </h3>
          <p className="text-gray-300 mb-6 text-lg">
            Join our community of developers building the future of smart contracts on Bitcoin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-medium rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60"
            >
              <Zap className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Join Discord Community
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 backdrop-blur-sm"
            >
              View GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningResources;