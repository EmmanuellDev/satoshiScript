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
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={['#6366f1', '#8b5cf6', '#a855f7']}
          particleCount={120}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={60}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Bridge the Gap to Stacks
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Convert your Solidity smart contracts to Clarity with AI-powered precision. 
            Deploy seamlessly on the Stacks blockchain and unlock Bitcoin's security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/converter"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl shadow-purple-600/30 hover:shadow-purple-600/50 transform hover:-translate-y-1"
            >
                Start Converting
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/tutor"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-purple-300 border-2 border-purple-400/30 hover:border-purple-400 hover:bg-purple-400/10 transition-all duration-300"
            >
              Learn with AI Tutor
            </Link>
          </div>
        </div>
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-bounce delay-700"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-blue-500/20 rounded-full blur-xl animate-bounce delay-500"></div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Sol2Clarity?
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
                  className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Deploy on Stacks?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who have successfully migrated their contracts to the Stacks ecosystem.
          </p>
          <Link
            to="/converter"
            className="inline-flex items-center justify-center px-10 py-5 text-xl font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl shadow-purple-600/40 hover:shadow-purple-600/60 transform hover:-translate-y-1"
          >
            Get Started Now
            <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;