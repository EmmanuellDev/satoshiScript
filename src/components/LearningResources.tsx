import { ExternalLink, Book, Video, Code, FileText } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Learning Resources</h2>
        <p className="text-gray-400">
          Comprehensive resources to master Clarity and Stacks development
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {resource.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {resource.description}
                  </p>
                  
                  <a
                    href={resource.link}
                    className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    <span>Learn More</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Building?</h3>
        <p className="text-gray-300 mb-6">
          Join our community of developers building the future of smart contracts on Bitcoin
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-300"
          >
            Join Discord Community
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-medium rounded-lg transition-all duration-300"
          >
            View GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default LearningResources;