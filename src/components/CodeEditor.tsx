import React, { useState } from 'react';
import { Copy, Check, GitCommit, Loader2 } from 'lucide-react';
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
  const [contractRepoName, setContractRepoName] = useState('');
  const [showContractNameInput, setShowContractNameInput] = useState(false);
  const { isConnected, address } = useWallet();

  const handleCopy = async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeployClick = () => {
    if (!isConnected || !value) return;
    setShowContractNameInput(true);
  };

  const handleDeployConfirm = async () => {
    if (!contractRepoName.trim()) {
      alert('Please enter a contract repository name');
      return;
    }

    if (!address) {
      alert('Wallet not connected. Please connect your wallet first.');
      return;
    }

    setIsDeploying(true);
    setShowContractNameInput(false);
    
    try {
      const contractData = {
        contract: {
          code: value,
        }
      };

      const response = await fetch('https://dot-clar-ipfs.onrender.com/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractCode: contractData,
          contractRepoName: contractRepoName.trim(),
          walletAddress: address,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setDeployedAddress(data.contractAddress || 'Contract deployed successfully!');
      } else {
        throw new Error(data.message || `Deployment failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Deployment error:', error);
      alert(`Deployment failed: ${error.message}`);
    } finally {
      setIsDeploying(false);
      setContractRepoName('');
    }
  };

  const handleDeployCancel = () => {
    setShowContractNameInput(false);
    setContractRepoName('');
  };

  return (
    <div className="relative group">
      {/* Background glow effect - inspired by HomePage */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
      
      {/* Main container with HomePage styling */}
      <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl border border-cyan-400/20 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/20 overflow-hidden">
        
        {/* Floating elements for visual appeal */}
        <div className="absolute top-4 right-20 w-2 h-2 bg-cyan-400/30 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-6 right-32 w-1 h-1 bg-blue-400/30 rounded-full blur-sm animate-pulse delay-500"></div>
        <div className="absolute bottom-4 left-20 w-1.5 h-1.5 bg-cyan-300/30 rounded-full blur-sm animate-pulse delay-1000"></div>
        
        {/* Header with enhanced styling */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-black/40 via-cyan-950/20 to-black/40 border-b border-cyan-400/20 backdrop-blur-sm">
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center">
            {language === 'solidity' ? (
              <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mr-3 shadow-lg shadow-orange-500/30"></div>
            ) : (
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mr-3 shadow-lg shadow-purple-500/30"></div>
            )}
            {title}
          </h3>
          
          <div className="flex items-center space-x-3">
            {value && (
              <button
                onClick={handleCopy}
                className="group/btn p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/60 text-gray-300 hover:text-cyan-300 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 transform hover:-translate-y-0.5"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : (
                  <Copy className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                )}
              </button>
            )}
            
            {showDeployButton && value && !isConverting && (
              <button
                onClick={handleDeployClick}
                disabled={!isConnected || isDeploying}
                className={`group/btn flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${
                  !isConnected
                    ? 'bg-gray-600/30 backdrop-blur-sm border border-gray-500/20 text-gray-400 cursor-not-allowed'
                    : isDeploying
                    ? 'bg-gradient-to-r from-cyan-600/50 to-blue-600/50 backdrop-blur-sm border border-cyan-400/30 text-cyan-300'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black border border-cyan-400/30 shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60'
                }`}
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Committing...</span>
                  </>
                ) : (
                  <>
                    <GitCommit className="h-5 w-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                    <span>Commit Changes</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Editor area with enhanced styling */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full h-96 p-6 bg-transparent text-gray-100 placeholder-gray-500 resize-none focus:outline-none font-mono text-sm leading-relaxed backdrop-blur-sm ${
              readOnly ? 'cursor-default' : 'focus:bg-black/10'
            } transition-all duration-300`}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Menlo", monospace',
            }}
          />
          
          {/* Conversion loading overlay with HomePage styling */}
          {isConverting && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-cyan-950/50 to-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-cyan-400/20">
                <div className="relative mb-6">
                  <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto" />
                  <div className="absolute inset-0 h-12 w-12 bg-cyan-400/20 rounded-full blur-xl mx-auto animate-pulse"></div>
                </div>
                <p className="text-xl font-semibold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2">
                  AI is converting your contract...
                </p>
                <p className="text-gray-400">This may take a few seconds</p>
              </div>
            </div>
          )}
          
          {/* Contract name input modal with HomePage styling */}
          {showContractNameInput && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-cyan-950/50 to-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative group/modal max-w-md w-full">
                {/* Modal background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-cyan-500/30 rounded-2xl blur opacity-75"></div>
                
                <div className="relative bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-cyan-400/20">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-4">
                    Enter Contract Repository Name
                  </h3>
                  <p className="text-gray-300 mb-6">Please provide a name for your contract repository:</p>
                  <input
                    type="text"
                    value={contractRepoName}
                    onChange={(e) => setContractRepoName(e.target.value)}
                    placeholder="e.g., my-contract"
                    className="w-full bg-black/20 backdrop-blur-sm border border-cyan-400/20 focus:border-cyan-400/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 mb-6 focus:shadow-lg focus:shadow-cyan-400/20"
                    autoFocus
                  />
                  <div className="flex space-x-4 justify-end">
                    <button
                      onClick={handleDeployCancel}
                      className="px-6 py-3 bg-black/20 backdrop-blur-sm border border-gray-500/20 hover:border-gray-400/60 text-gray-300 hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-400/20 transform hover:-translate-y-0.5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeployConfirm}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold rounded-xl transition-all duration-300 shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transform hover:-translate-y-0.5 border border-cyan-400/30"
                    >
                      Commit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Success notification with HomePage styling */}
          {deployedAddress && (
            <div className="absolute top-6 right-6">
              <div className="relative group/success">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-xl blur opacity-75"></div>
                <div className="relative bg-black/40 backdrop-blur-sm border border-green-400/20 text-white px-4 py-3 rounded-xl">
                  <p className="font-semibold text-green-300">Committed successfully!</p>
                  <p className="text-green-100 text-xs mt-1 font-mono">{deployedAddress}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;