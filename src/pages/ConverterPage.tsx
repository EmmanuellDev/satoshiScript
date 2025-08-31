// ConverterPage.tsx
import React, { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import ConversionControls from "../components/ConversionControls";
import DeployedReposPage from "../components/DeployedRepos";
import ClarityFloatingPlugin from "../components/ClarityFloatingPlugin";

const ConverterPage: React.FC = () => {
  // Format Clarity code for prettier output
  function formatClarityCode(code: string): string[] {
    const formatted = code.trim().replace(/\r\n|\r/g, "\n");
    let indent = 0;
    return formatted.split("\n").map((line) => {
      const open = (line.match(/\(/g) || []).length;
      const close = (line.match(/\)/g) || []).length;
      const result = "  ".repeat(indent) + line.trim();
      indent += open - close;
      if (indent < 0) indent = 0;
      return result;
    });
  }

  // For animated line-by-line generation
  // Removed unused 'animatedClarityLines' state
  const [solidityCode, setSolidityCode] = useState("");
  const [clarityCode, setClarityCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  // Removed unused errorLines state

  const handleConvert = async () => {
    if (!solidityCode.trim()) {
      setError("Please enter Solidity code to convert");
      return;
    }

    setIsConverting(true);
    setError(null);
    setClarityCode("");
    setExplanation("");

    try {
      const response = await fetch(
        "https://satoshiscript-ai-2.onrender.com/convert-explain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            solidity_code: solidityCode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.clarity_code) {
        const lines = formatClarityCode(data.clarity_code);
  // Removed setAnimatedClarityLines([]) since state is deleted
        setClarityCode("");
        // Animate line-by-line generation
        lines.forEach((line, i) => {
          setTimeout(() => {
            // Removed setAnimatedClarityLines update since state is deleted
            setClarityCode((prev) => prev + (prev ? "\n" : "") + line);
          }, i * 200); // 60ms per line
        });
      }
      if (data.explanation) {
        setExplanation(data.explanation);
        setShowExplanation(false); // Reset explanation view on new conversion
      }

      // Handle any error from the API response
      if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.error("Conversion error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to convert contract. Please try again."
      );
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects - inspired by HomePage */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-cyan-400/20 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400/20 rounded-full blur-sm animate-pulse delay-500"></div>
      <div className="absolute bottom-40 left-20 w-5 h-5 bg-cyan-300/20 rounded-full blur-sm animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-300/20 rounded-full blur-sm animate-pulse delay-1500"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Solidity to Clarity Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your Ethereum smart contracts into Bitcoin-native Clarity
            contracts with AI-powered conversion
          </p>
        </div>
        <div className="flex justify-center gap-8 mt-6 mb-6">
          {explanation && !showExplanation && (
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
              Deploy
            </button>
          )}

          {explanation && !showExplanation && (
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
              onClick={() => setShowExplanation(true)}
            >
              Explain Me
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-xl blur opacity-75"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-red-400/20 text-white p-4 rounded-xl">
                <p className="font-semibold text-red-300">Conversion Error</p>
                <p className="text-red-100 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Code Editors */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CodeEditor
            title="Solidity Contract"
            language="solidity"
            value={solidityCode}
            onChange={setSolidityCode}
            placeholder={`// Enter your Solidity contract here
// Example:
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    
    function set(uint256 x) public {
        storedData = x;
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}`}
          />

          <CodeEditor
            title="Clarity Contract"
            language="clarity"
            value={clarityCode}
            onChange={setClarityCode}
            placeholder="// Converted Clarity contract will appear here..."
            readOnly={true}
            showDeployButton={true}
            isConverting={isConverting}
            // ...existing code...
          />
        </div>

        {/* Conversion Controls */}
        <ConversionControls
          onConvert={handleConvert}
          isConverting={isConverting}
          hasInput={solidityCode.trim().length > 0}
        />

        {explanation && showExplanation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-black/90 rounded-2xl border border-purple-400/30 shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto relative">
              {/* Close (X) button */}
              <button
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 font-bold text-2xl z-10"
                onClick={() => setShowExplanation(false)}
                aria-label="Close explanation"
              >
                ×
              </button>
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-black/40 via-purple-950/20 to-black/40 border-b border-purple-400/20 backdrop-blur-sm">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mr-3 shadow-lg shadow-purple-500/30"></div>
                  Conversion Explanation
                </h3>
              </div>
              {/* Content */}
              <div className="p-6">
                <div className="prose prose-invert prose-cyan max-w-none">
                  <div className="text-gray-200 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                    {explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clarity Code Analysis Floating Plugin */}
        {clarityCode && (
          <ClarityFloatingPlugin
            clarityCode={clarityCode}
            onCodeRectified={(rectifiedCode) => {
              setClarityCode(rectifiedCode);
              // Removed animated lines update for visual consistency
            }}
            // Removed onErrorLinesChange prop since errorLines state is deleted
          />
        )}

        <DeployedReposPage />

      </div>
    </div>
  );
};

export default ConverterPage;
