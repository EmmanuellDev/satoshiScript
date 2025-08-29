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
    
    // Show contract name input dialog
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
      // Format the contract code as a JSON object
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
              onClick={handleDeployClick}
              disabled={!isConnected || isDeploying}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                !isConnected
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : isDeploying
                  ? 'bg-blue-600/50 text-blue-300'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
              }`}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Committing...</span>
                </>
              ) : (
                <>
                  <GitCommit className="h-4 w-4" />
                  <span>Commit Changes</span>
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
        
        {showContractNameInput && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full">
              <h3 className="text-white text-lg font-semibold mb-4">Enter Contract Repository Name</h3>
              <p className="text-gray-300 mb-4">Please provide a name for your contract repository:</p>
              <input
                type="text"
                value={contractRepoName}
                onChange={(e) => setContractRepoName(e.target.value)}
                placeholder="e.g., my-contract"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 mb-4"
                autoFocus
              />
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={handleDeployCancel}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeployConfirm}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
                >
                  Commit
                </button>
              </div>
            </div>
          </div>
        )}
        
        {deployedAddress && (
          <div className="absolute top-4 right-4 bg-green-600/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
            <p className="font-medium">Committed successfully!</p>
            <p className="text-green-100 text-xs mt-1 font-mono">{deployedAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;