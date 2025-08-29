import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Zap, Shield, Users } from 'lucide-react';
import Particles from '../components/Particles';

const features = [
  {
    icon: Code2,
    title: 'Smart Conversion',
    description: 'AI-powered translation from Solidity to Clarity with high accuracy and optimization.',
  },
  {
    icon: Zap,
    title: 'Instant Deployment',
    description: 'Deploy your converted contracts directly to Stacks blockchain with one click.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Built-in security checks and version control to ensure contract integrity.',
  },
  {
    icon: Users,
    title: 'AI Tutor',
    description: 'Learn Clarity development with our interactive AI assistant and resources.',
  },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen mt-8">
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
      
      {/* Content Container - Positioned above particles */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              Bridge the Gap to Stacks
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Convert your Solidity smart contracts to Clarity with AI-powered precision. 
              Deploy seamlessly on the Stacks blockchain and unlock Bitcoin's security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/converter"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-black bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transform hover:-translate-y-1 border border-cyan-400/30"
              >
                  Start Converting
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/tutor"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-cyan-300 border-2 border-cyan-400/40 hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 backdrop-blur-sm"
              >
                Learn with AI Tutor
              </Link>
            </div>
          </div>
          
          {/* Enhanced Floating Elements with Electric Blue theme */}
          <div className="absolute top-1/4 left-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-10 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-cyan-300/20 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 right-1/4 w-14 h-14 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-700"></div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Why Choose Satoshi Script?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Experience the future of smart contract development with our cutting-edge tools
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group p-6 rounded-2xl bg-black/20 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-400/20"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-cyan-500/5 backdrop-blur-3xl rounded-3xl mx-4"></div>
          
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Ready to Deploy on Stacks?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers who have successfully migrated their contracts to the Stacks ecosystem.
            </p>
            <Link
              to="/converter"
              className="group inline-flex items-center justify-center px-10 py-5 text-xl font-medium rounded-xl text-black bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-2xl shadow-cyan-600/40 hover:shadow-cyan-600/60 transform hover:-translate-y-1 border border-cyan-400/30"
            >
              Get Started Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </section>

        {/* Additional Stats/Trust Section */}
        <section className="py-16 border-t border-cyan-400/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  10,000+
                </div>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  Contracts Converted
                </p>
              </div>
              <div className="group">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  99.9%
                </div>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  Success Rate
                </p>
              </div>
              <div className="group">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  5,000+
                </div>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  Happy Developers
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;