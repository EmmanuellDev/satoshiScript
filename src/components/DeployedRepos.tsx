// DeployedReposPage.tsx
import React, { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';

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
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-white text-2xl font-semibold">Deployed Contracts</h2>

      {!isConnected && <p className="text-white">Connect your wallet to see deployed repos.</p>}
      {loading && <p className="text-white">Loading deployed repositories...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {repos.length === 0 && !loading && <p className="text-white">No deployed repositories found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <div
            key={repo.name}
            className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-300"
          >
            <h3 className="text-white font-medium text-lg">{repo.name}</h3>
            <p className="text-gray-400">Version: {repo.version}</p>
            <p className="text-gray-400">IPFS Hash: {repo.ipfsHash.slice(0,3) + '....' + repo.ipfsHash.slice(-4)}</p>
            <button
              onClick={() => handleViewCode(repo.ipfsHash)}
              className="mt-3 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-300"
            >
              View Code
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && modalCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-slate-900 rounded-xl p-6 w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-400 font-bold text-xl"
            >
              ×
            </button>
            <h3 className="text-white text-xl font-semibold mb-4">Contract Code</h3>
            <div className="mb-4">
              <h4 className="text-gray-300 font-medium mb-1">ABI:</h4>
              <pre className="bg-white/5 p-3 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(modalCode, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeployedReposPage;