import React from 'react';
import { Clock, Download, Trash2 } from 'lucide-react';

interface Version {
  id: string;
  timestamp: Date;
  solidityCode: string;
  clarityCode: string;
}

interface VersionControlProps {
  versions: Version[];
  onLoadVersion: (version: Version) => void;
}

const VersionControl: React.FC<VersionControlProps> = ({ versions, onLoadVersion }) => {
  if (versions.length === 0) return null;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Version History</h3>
      </div>
      
      <div className="space-y-3">
        {versions.map((version) => (
          <div
            key={version.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-purple-400/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div>
                <p className="text-white font-medium">{version.id}</p>
                <p className="text-gray-400 text-sm">
                  {version.timestamp.toLocaleDateString()} at {version.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onLoadVersion(version)}
                className="flex items-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-300"
              >
                <Download className="h-3 w-3" />
                <span>Load</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionControl;