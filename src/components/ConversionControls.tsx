import React from 'react';
import { ArrowRight, Loader2, Zap } from 'lucide-react';

interface ConversionControlsProps {
  onConvert: () => void;
  isConverting: boolean;
  hasInput: boolean;
}

const ConversionControls: React.FC<ConversionControlsProps> = ({
  onConvert,
  isConverting,
  hasInput,
}) => {
  return (
    <div className="relative flex justify-center mb-8">
      {/* Background glow effect - inspired by HomePage */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-80 h-20 bg-gradient-to-r from-cyan-500/10 via-blue-500/20 to-cyan-500/10 backdrop-blur-3xl rounded-3xl blur-xl opacity-60"></div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-2 left-1/2 transform -translate-x-20 w-3 h-3 bg-cyan-400/30 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute top-4 left-1/2 transform translate-x-16 w-2 h-2 bg-blue-400/30 rounded-full blur-sm animate-pulse delay-500"></div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-12 w-2.5 h-2.5 bg-cyan-300/30 rounded-full blur-sm animate-pulse delay-1000"></div>
      
      <div className="relative group">
        {/* Button glow effect */}
        <div className={`absolute -inset-2 rounded-2xl blur-lg transition-all duration-300 ${
          !hasInput || isConverting
            ? 'bg-gradient-to-r from-gray-600/20 to-gray-600/20'
            : 'bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-cyan-500/30 group-hover:from-cyan-400/40 group-hover:via-blue-400/40 group-hover:to-cyan-400/40'
        }`}></div>
        
        <button
          onClick={onConvert}
          disabled={!hasInput || isConverting}
          className={`relative flex items-center space-x-4 px-10 py-5 rounded-2xl font-bold text-xl border backdrop-blur-sm transition-all duration-300 transform ${
            !hasInput || isConverting
              ? 'bg-black/20 border-gray-500/20 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 border-cyan-400/30 text-black shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:-translate-y-2 hover:scale-105'
          }`}
        >
          {isConverting ? (
            <>
              <div className="relative">
                <Loader2 className="h-6 w-6 animate-spin" />
                <div className="absolute inset-0 h-6 w-6 bg-cyan-400/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Converting...
              </span>
            </>
          ) : (
            <>
              <div className="relative">
                <Zap className="h-6 w-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                <div className="absolute inset-0 h-6 w-6 bg-yellow-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <span className="group-hover:scale-105 transition-transform duration-300">
                Convert to Clarity
              </span>
              
              <div className="relative">
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                <div className="absolute inset-0 h-6 w-6 bg-cyan-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </>
          )}
        </button>
        
        {/* Additional visual elements when active */}
        {hasInput && !isConverting && (
          <>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400/40 rounded-full blur animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400/40 rounded-full blur animate-pulse delay-700"></div>
          </>
        )}
        
        {/* Loading state visual enhancement */}
        {isConverting && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/20 to-cyan-500/10 animate-pulse"></div>
        )}
      </div>
      
      {/* Status indicator text */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <p className={`text-sm font-medium transition-all duration-300 ${
          !hasInput 
            ? 'text-gray-500'
            : isConverting
            ? 'text-cyan-300 animate-pulse'
            : 'text-cyan-400'
        }`}>
          {!hasInput 
            ? 'Enter Solidity code to begin'
            : isConverting
            ? 'AI processing your contract...'
            : 'Ready to convert'
          }
        </p>
      </div>
    </div>
  );
};

export default ConversionControls;