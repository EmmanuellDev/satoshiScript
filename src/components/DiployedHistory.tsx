import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  ArrowRight,
  HistoryIcon,
  CodeIcon,
  Loader2
} from 'lucide-react';
import Particles from '../components/Particles';
import { MdAccountBalanceWallet } from "react-icons/md";
import { IoExpand } from "react-icons/io5";

// Define types for our deployment data
interface ContractCode {
  contract: {
    code: string;
  };
}

interface Deployment {
  id: string;
  walletAddress: string;
  contractRepoName: string;
  contractCodeHash: string;
  version: string;
  deployedAt: string;
  codeChanged: boolean;
  contractCode: ContractCode;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    deployments: Deployment[];
  };
}

const DeployedHistory: React.FC = () => {
  const { isConnected, address, isLoading: walletLoading } = useWallet();
  const [repoName, setRepoName] = useState<string>('');
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [expandedDeployment, setExpandedDeployment] = useState<string | null>(null);

  const fetchDeploymentHistory = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!repoName.trim()) {
      setError('Please enter a repository name');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        `https://dot-clar-ipfs.onrender.com/api/deployments/${address}/${repoName.trim()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch deployment history: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success && data.data && data.data.deployments) {
        setDeployments(data.data.deployments);
        setSuccess(data.message);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching deployment history:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDeploymentHistory();
  };

  const toggleDeployment = (id: string) => {
    setExpandedDeployment(expandedDeployment === id ? null : id);
  };

  useEffect(() => {
    // Clear states when wallet connection changes
    if (!isConnected) {
      setDeployments([]);
      setError('');
      setSuccess('');
    }
  }, [isConnected]);

  if (walletLoading) {
    return (
      <div className="relative min-h-screen">
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
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
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
      
      {/* Enhanced Floating Elements with Electric Blue theme */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-cyan-300/20 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute bottom-1/3 right-1/4 w-14 h-14 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-700"></div>

      {/* Content Container - Positioned above particles */}
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-6 mb-8 transition-all duration-300 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-400/20">
          <div className="flex items-center mb-4">
            <HistoryIcon className="h-8 w-8 text-cyan-400 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Deployment History
            </h1>
          </div>

          {!isConnected ? (
            <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4 mb-4">
              <p className="text-cyan-300">Please connect your wallet to view deployment history.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <MdAccountBalanceWallet className="h-5 w-5 text-cyan-400 mr-2" />
                <p className="text-gray-300">
                  Connected wallet: <strong className="text-cyan-300">{address}</strong>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="Enter your contract repository name"
                    className="flex-grow bg-gray-800/50 border border-cyan-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      loading
                        ? 'bg-cyan-600/50 text-cyan-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60'
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>Fetch History</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 mb-4">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 mb-4">
                  <p className="text-green-300">{success}</p>
                </div>
              )}
            </>
          )}
        </div>

        {deployments.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-4">
              Deployment Results for "{repoName}"
            </h2>
            <p className="text-gray-400 mb-6">
              Found {deployments.length} deployment{deployments.length !== 1 ? 's' : ''}
            </p>

            <div className="space-y-4">
              {deployments.map((deployment, index) => (
                <div
                  key={deployment.id || index}
                  className="bg-black/20 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-6 transition-all duration-300 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-400/20"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Version: {deployment.version || 'N/A'}
                      </h3>
                      <p className="text-gray-400">
                        Deployed at: {formatDate(deployment.deployedAt)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        deployment.codeChanged
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                          : 'bg-gray-600/50 text-gray-300 border border-gray-500/30'
                      }`}
                    >
                      {deployment.codeChanged ? 'Code Changed' : 'No Changes'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 break-all">
                      <strong>Contract Hash:</strong> {deployment.contractCodeHash || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => toggleDeployment(deployment.id || `deployment-${index}`)}
                      className="flex items-center justify-between w-full p-3 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl border border-cyan-400/30 transition-all duration-300"
                    >
                      <div className="flex items-center">
                        <CodeIcon className="h-5 w-5 text-cyan-400 mr-2" />
                        <span className="text-cyan-300">View Contract Code</span>
                      </div>
                      <IoExpand
                        className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${
                          expandedDeployment === (deployment.id || `deployment-${index}`)
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </button>

                    {expandedDeployment === (deployment.id || `deployment-${index}`) && (
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-cyan-400/20">
                        <h4 className="text-sm font-semibold text-cyan-300 mb-2">Contract Code:</h4>
                        <pre className="bg-black/30 p-4 rounded-lg overflow-auto text-sm text-gray-200 border border-cyan-400/10">
                          {deployment.contractCode && deployment.contractCode.contract
                            ? deployment.contractCode.contract.code
                            : 'No contract code available'}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isConnected && deployments.length === 0 && !loading && repoName && (
          <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4">
            <p className="text-cyan-300">
              No deployment history found for repository "{repoName}" with your connected wallet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeployedHistory;