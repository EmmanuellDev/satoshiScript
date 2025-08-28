import React, { useState } from 'react';
import { Copy, Check, Upload, Rocket, Loader2 } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface CodeEditorProps {
  title: string;
  language: 'solidity' | 'clarity';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  showDeployButton?: boolean;
  isConverting?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  title,
  language,
  value,
  onChange,
  placeholder,
  readOnly = false,
  showDeployButton = false,
  isConverting = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const { isConnected } = useWallet();

  const handleCopy = async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeploy = async () => {
    if (!isConnected || !value) return;
    
    setIsDeploying(true);
    // Simulate deployment delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock contract address
    const mockAddress = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.my-contract';
    setDeployedAddress(mockAddress);
    setIsDeploying(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white flex items-center">
          {language === 'solidity' ? (
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
          ) : (
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
          )}
          {title}
        </h3>
        
        <div className="flex items-center space-x-2">
          {value && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-300"
              title="Copy to clipboard"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
          )}
          
          {showDeployButton && value && !isConverting && (
            <button
              onClick={handleDeploy}
              disabled={!isConnected || isDeploying}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                !isConnected
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : isDeploying
                  ? 'bg-purple-600/50 text-purple-300'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30'
              }`}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  <span>Deploy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full h-96 p-4 bg-transparent text-gray-100 placeholder-gray-500 resize-none focus:outline-none font-mono text-sm leading-relaxed ${
            readOnly ? 'cursor-default' : ''
          }`}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Menlo", monospace',
          }}
        />
        
        {isConverting && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-3" />
              <p className="text-white font-medium">AI is converting your contract...</p>
              <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
            </div>
          </div>
        )}
        
        {deployedAddress && (
          <div className="absolute top-4 right-4 bg-green-600/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
            <p className="font-medium">Deployed successfully!</p>
            <p className="text-green-100 text-xs mt-1 font-mono">{deployedAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;