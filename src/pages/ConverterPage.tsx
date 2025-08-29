import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import ConversionControls from '../components/ConversionControls';
import Particles from '../components/Particles';
import DeployedReposPage from '../components/DeployedRepos';

const ConverterPage = () => {
  const [solidityCode, setSolidityCode] = useState('');
  const [clarityCode, setClarityCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [versions, setVersions] = useState<Array<{ id: string; timestamp: Date; solidityCode: string; clarityCode: string }>>([]);

  const handleConvert = async () => {
    setIsConverting(true);
    
    // Simulate AI conversion delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI conversion result
    const mockClarityCode = `;; Converted Smart Contract
;; Original Solidity converted to Clarity

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))

(define-data-var counter uint u0)

(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) u1))
    (ok (var-get counter))
  )
)

(define-read-only (get-counter)
  (var-get counter)
)

(define-public (set-counter (value uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set counter value)
    (ok value)
  )
)`;
    
    setClarityCode(mockClarityCode);
    
    // Save version
    const newVersion = {
      id: `v${versions.length + 1}`,
      timestamp: new Date(),
      solidityCode,
      clarityCode: mockClarityCode,
    };
    setVersions([...versions, newVersion]);
    
    setIsConverting(false);
  };

  return (
    <div className="min-h-screen pt-8 relative">
      {/* Particles Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={1200}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            Smart Contract Converter
          </h1>
          <p className="text-xl text-gray-400">
            Transform your Solidity contracts into Clarity with AI precision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 relative z-10">
          <CodeEditor
            title="Solidity Input"
            language="solidity"
            value={solidityCode}
            onChange={setSolidityCode}
            placeholder="// Paste your Solidity contract here
pragma solidity ^0.8.0;

contract SimpleCounter {
    uint256 private counter;
    address private owner;
    
    constructor() {
        owner = msg.sender;
        counter = 0;
    }
    
    function increment() public {
        counter += 1;
    }
    
    function getCounter() public view returns (uint256) {
        return counter;
    }
}"
          />
          
          <CodeEditor
            title="Clarity Output"
            language="clarity"
            value={clarityCode}
            onChange={() => {}} // Read-only
            readOnly
            placeholder=";; Your converted Clarity contract will appear here
;; Click 'Convert to Clarity' to start the AI-powered conversion"
            showDeployButton
            isConverting={isConverting}
          />
        </div>

        <div className="relative z-10">
          <ConversionControls
          onConvert={handleConvert}
          isConverting={isConverting}
          hasInput={!!solidityCode.trim()}
          />
        </div>
        <DeployedReposPage />
      </div>
    </div>
  );
};

export default ConverterPage;