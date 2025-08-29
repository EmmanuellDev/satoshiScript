import React, { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Eye, FileCode, GitBranch, Hash, X, Loader2, AlertCircle } from 'lucide-react';

interface RepoInfo {
  name: string;
  version: string;
  ipfsHash: string;
}

interface ContractCode {
  abi: any[];
  bytecode: string;
}

const DeployedReposPage: React.FC = () => {
  const { address, isConnected } = useWallet();
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCode, setModalCode] = useState<ContractCode | null>(null);
  const [loadingCode, setLoadingCode] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) return;

    const fetchRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://dot-clar-ipfs.onrender.com/api/deployments/${address}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to fetch repos');
        }

        const repoEntries = Object.entries(json.data)
          .filter(([key]) => key !== 'walletAddress')
          .map(([name, value]: [string, any]) => ({
            name,
            version: value.version,
            ipfsHash: value.ipfsHash,
          }));

        setRepos(repoEntries);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [address, isConnected]);

  // Fetch contract code for a repo and open modal
  const handleViewCode = async (ipfsHash: string) => {
    setLoadingCode(true);
    try {
      const res = await fetch(`https://dot-clar-ipfs.onrender.com/api/contract/${ipfsHash}`);
      const json = await res.json();

      if (json.success && json.data?.contractCode) {
        setModalCode(json.data.contractCode);
        setModalOpen(true);
      } else {
        alert('Failed to fetch contract code');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching code');
    } finally {
      setLoadingCode(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-20 right-16 w-16 h-16 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-cyan-300/10 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute bottom-60 right-1/3 w-14 h-14 bg-blue-300/10 rounded-full blur-xl animate-pulse delay-700"></div>

      <div className="relative z-10 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
            Deployed Contracts
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Manage and explore your deployed smart contracts on the Stacks blockchain
          </p>
        </div>

        {/* Status Messages with enhanced styling */}
        {!isConnected && (
          <div className="text-center py-12">
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-orange-400/20">
                <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <p className="text-xl text-orange-300 font-semibold">Connect your wallet to see deployed contracts</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-cyan-400/20">
                <div className="relative mb-6">
                  <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto" />
                  <div className="absolute inset-0 h-12 w-12 bg-cyan-400/20 rounded-full blur-xl mx-auto animate-pulse"></div>
                </div>
                <p className="text-xl text-cyan-300 font-semibold">Loading deployed repositories...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-red-400/20">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-xl text-red-300 font-semibold">{error}</p>
              </div>
            </div>
          </div>
        )}

        {repos.length === 0 && !loading && isConnected && (
          <div className="text-center py-12">
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-gray-400/20">
                <FileCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-300 font-semibold">No deployed repositories found</p>
                <p className="text-gray-400 mt-2">Deploy your first contract to see it here</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map((repo, index) => (
            <div
              key={repo.name}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              
              {/* Main card */}
              <div className="relative bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-400/20">
                
                {/* Floating elements on card */}
                <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400/30 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue-400/30 rounded-full blur-sm animate-pulse delay-500"></div>
                
                {/* Card content */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                    <GitBranch className="h-6 w-6 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 truncate">
                  {repo.name}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-400">Version:</span>
                    <span className="text-cyan-300 font-medium">{repo.version}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">IPFS:</span>
                    <code className="text-purple-300 font-mono text-sm bg-black/20 px-2 py-1 rounded">
                      {repo.ipfsHash.slice(0,6) + '...' + repo.ipfsHash.slice(-6)}
                    </code>
                  </div>
                </div>

                {/* Enhanced button */}
                <button
                  onClick={() => handleViewCode(repo.ipfsHash)}
                  disabled={loadingCode}
                  className={`group/btn w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${
                    loadingCode
                      ? 'bg-gradient-to-r from-cyan-600/50 to-blue-600/50 text-cyan-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
                  }`}
                >
                  {loadingCode ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                      <span>View Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Modal */}
        {modalOpen && modalCode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-black/80 via-cyan-950/50 to-black/80 backdrop-blur-sm p-4">
            <div className="relative group max-w-6xl w-full max-h-[90vh]">
              {/* Modal background glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-cyan-500/30 rounded-3xl blur-xl opacity-75"></div>
              
              {/* Modal content */}
              <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl border border-cyan-400/20 overflow-hidden">
                {/* Modal header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-black/40 via-cyan-950/20 to-black/40 border-b border-cyan-400/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <FileCode className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                      Contract Code
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => setModalOpen(false)}
                    className="group/close p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-red-400/20 hover:border-red-400/60 text-red-400 hover:text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-400/20 transform hover:-translate-y-0.5"
                  >
                    <X className="h-6 w-6 group-hover/close:scale-110 group-hover/close:rotate-90 transition-all duration-300" />
                  </button>
                </div>
                
                {/* Modal body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-6">
                    <div className="relative group/code">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-50"></div>
                      <div className="relative bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-purple-400/20">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg shadow-purple-500/30"></div>
                          <h4 className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                            Contract ABI & Bytecode
                          </h4>
                        </div>
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-gray-600/20 overflow-hidden">
                          <pre className="p-4 overflow-x-auto text-sm text-gray-200 font-mono leading-relaxed">
                            {JSON.stringify(modalCode, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeployedReposPage;