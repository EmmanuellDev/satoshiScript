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
    <div className="flex justify-center mb-8">
      <button
        onClick={onConvert}
        disabled={!hasInput || isConverting}
        className={`group flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
          !hasInput || isConverting
            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-600/40 hover:shadow-purple-600/60 transform hover:-translate-y-1'
        }`}
      >
        {isConverting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Converting...</span>
          </>
        ) : (
          <>
            <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Convert to Clarity</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
};

export default ConversionControls;