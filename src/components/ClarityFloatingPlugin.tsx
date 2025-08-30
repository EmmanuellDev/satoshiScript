import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, CheckCircle, Loader2, X, Bug, Zap } from "lucide-react";

interface ClarityError {
  line: number;
  column: number;
  message: string;
  severity: "error" | "warning" | "info";
  suggestion?: string;
  fix?: string;
  pattern?: RegExp;
  replacement?: string;
  originalText?: string;
}

interface ClarityFloatingPluginProps {
  clarityCode: string;
  onCodeRectified: (rectifiedCode: string) => void;
  onErrorLinesChange?: (errorLines: number[]) => void;
}

const ClarityFloatingPlugin: React.FC<ClarityFloatingPluginProps> = ({
  clarityCode,
  onCodeRectified,
  onErrorLinesChange,
}) => {
  const [errors, setErrors] = useState<ClarityError[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRectifying, setIsRectifying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Enhanced and more accurate error detection
  const analyzeCode = useCallback((code: string): ClarityError[] => {
    const lines = code.split("\n");
    const foundErrors: ClarityError[] = [];

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmedLine = line.trim();
      const originalLine = line;

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith(";;")) return;

      // 1. Solidity function declarations
      const functionMatch = trimmedLine.match(
        /^function\s+(\w+)\s*\(([^)]*)\)\s*(public|private|view|pure|payable)?\s*(returns\s*\([^)]*\))?\s*\{?/
      );
      if (functionMatch) {
        const [fullMatch, functionName, params, visibility] = functionMatch;
        const clarityVisibility =
          visibility === "view" || visibility === "pure"
            ? "read-only"
            : "public";

        foundErrors.push({
          line: lineNumber,
          column: line.indexOf("function"),
          message: `Solidity function declaration: ${functionName}`,
          severity: "error",
          suggestion: `Convert to Clarity: (define-${clarityVisibility} (${functionName} ${params})`,
          originalText: fullMatch,
          fix: `(define-${clarityVisibility} (${functionName} ${params})`,
        });
      }

      // 2. Solidity variable declarations with more precision
      const varMatch = trimmedLine.match(
        /^(uint256|uint|int256|int|bool|string|address)\s+(\w+)(\s*=\s*([^;]+))?\s*;?$/
      );
      if (varMatch) {
        const [, type, varName, , initialValue] = varMatch;
        let clarityType: string;
        let clarityInitial: string;

        switch (type) {
          case "uint256":
          case "uint":
            clarityType = "uint";
            clarityInitial = initialValue ? `u${initialValue}` : "u0";
            break;
          case "int256":
          case "int":
            clarityType = "int";
            clarityInitial = initialValue || "0";
            break;
          case "bool":
            clarityType = "bool";
            clarityInitial = initialValue || "false";
            break;
          case "string":
            clarityType = "(string-ascii 100)";
            clarityInitial = initialValue || '"empty"';
            break;
          case "address":
            clarityType = "principal";
            clarityInitial = initialValue || "tx-sender";
            break;
          default:
            clarityType = "uint";
            clarityInitial = "u0";
        }

        foundErrors.push({
          line: lineNumber,
          column: 0,
          message: `Solidity variable: ${type} ${varName}`,
          severity: "error",
          suggestion: `Convert to: (define-data-var ${varName} ${clarityType} ${clarityInitial})`,
          originalText: trimmedLine,
          fix: `(define-data-var ${varName} ${clarityType} ${clarityInitial})`,
        });
      }

      // 3. Contract declarations
      const contractMatch = trimmedLine.match(/^contract\s+(\w+)\s*\{?$/);
      if (contractMatch) {
        foundErrors.push({
          line: lineNumber,
          column: line.indexOf("contract"),
          message: "Solidity contract declaration",
          severity: "error",
          suggestion:
            "Remove - Clarity contracts don't need explicit declarations",
          originalText: trimmedLine,
          fix: ";; Clarity contract functions",
        });
      }

      // 4. Return statements
      const returnMatch = trimmedLine.match(/^return\s+([^;]+)\s*;?$/);
      if (returnMatch) {
        const returnValue = returnMatch[1];
        foundErrors.push({
          line: lineNumber,
          column: line.indexOf("return"),
          message: "Solidity return statement",
          severity: "error",
          suggestion: "Use Clarity response format",
          originalText: trimmedLine,
          fix: `(ok ${returnValue})`,
        });
      }

      // 5. Semicolons (but not in comments)
      if (trimmedLine.endsWith(";") && !trimmedLine.startsWith(";;")) {
        foundErrors.push({
          line: lineNumber,
          column: line.lastIndexOf(";"),
          message: "Unnecessary semicolon",
          severity: "warning",
          suggestion: "Remove semicolon - not needed in Clarity",
          originalText: trimmedLine,
          fix: trimmedLine.slice(0, -1),
        });
      }

      // 6. Unbalanced parentheses
      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;
      const parenDiff = openParens - closeParens;

      if (parenDiff > 0 && trimmedLine.length > 0) {
        foundErrors.push({
          line: lineNumber,
          column: line.length,
          message: `Missing ${parenDiff} closing parenthesis`,
          severity: "error",
          suggestion: "Add missing closing parentheses",
          originalText: line,
          fix: line + ")".repeat(parenDiff),
        });
      } else if (parenDiff < 0 && trimmedLine.length > 0) {
        foundErrors.push({
          line: lineNumber,
          column: 0,
          message: `Extra ${-parenDiff} closing parenthesis`,
          severity: "error",
          suggestion: "Remove extra closing parentheses",
          originalText: line,
          fix: "(".repeat(-parenDiff) + line,
        });
      }

      // 7. Function calls without proper Clarity syntax
      const functionCallMatch = trimmedLine.match(/^(\w+)\s*\(([^)]*)\)\s*;?$/);
      if (
        functionCallMatch &&
        !trimmedLine.startsWith("(") &&
        !trimmedLine.includes("define-")
      ) {
        const [, funcName, args] = functionCallMatch;
        foundErrors.push({
          line: lineNumber,
          column: 0,
          message: "Function call needs Clarity syntax",
          severity: "error",
          suggestion: "Wrap in parentheses for Clarity",
          originalText: trimmedLine,
          fix: `(${funcName} ${args})`,
        });
      }

      // 8. Storage variable access without proper definition
      if (
        trimmedLine.includes("storedData") &&
        !code.includes("define-data-var storedData")
      ) {
        foundErrors.push({
          line: lineNumber,
          column: line.indexOf("storedData"),
          message: "Undefined variable: storedData",
          severity: "error",
          suggestion: "Define variable first",
          originalText: "storedData",
          fix: "(define-data-var storedData uint u0)",
        });
      }

      // 9. Mapping declarations
      const mappingMatch = trimmedLine.match(
        /^mapping\s*\(([^)]+)\s*=>\s*([^)]+)\)\s+(\w+)\s*;?$/
      );
      if (mappingMatch) {
        const [, keyType, valueType, mapName] = mappingMatch;
        foundErrors.push({
          line: lineNumber,
          column: 0,
          message: `Solidity mapping: ${mapName}`,
          severity: "error",
          suggestion: "Convert to Clarity map",
          originalText: trimmedLine,
          fix: `(define-map ${mapName} ${keyType} ${valueType})`,
        });
      }

      // 10. Event declarations
      const eventMatch = trimmedLine.match(
        /^event\s+(\w+)\s*\(([^)]*)\)\s*;?$/
      );
      if (eventMatch) {
        const [, eventName] = eventMatch;
        foundErrors.push({
          line: lineNumber,
          column: 0,
          message: `Solidity event: ${eventName}`,
          severity: "warning",
          suggestion: "Events not directly supported in Clarity",
          originalText: trimmedLine,
          fix: `;; Event ${eventName} - implement with print or custom logic`,
        });
      }
    });

    return foundErrors;
  }, []);

  // More precise rectification
  const rectifyCode = useCallback(
    async (code: string): Promise<string> => {
      const lines = code.split("\n");
      const sortedErrors = [...errors].sort((a, b) => b.line - a.line);

      // Apply fixes line by line from bottom to top to preserve line numbers
      for (const error of sortedErrors) {
        const lineIndex = error.line - 1;
        if (lineIndex >= 0 && lineIndex < lines.length && error.fix) {
          lines[lineIndex] = error.fix;
        }
      }

      let rectified = lines.join("\n");

      // Additional comprehensive cleanup
      rectified = rectified
        // Remove contract wrapper
        .replace(/contract\s+\w+\s*\{/g, ";; Clarity contract functions")
        .replace(/^\s*\}\s*$/gm, "")

        // Fix function definitions
        .replace(
          /function\s+(\w+)\s*\(([^)]*)\)\s*(public|private|view|pure|payable)?\s*(returns\s*\([^)]*\))?\s*\{/g,
          (match, name, params, visibility) => {
            const clarityVisibility =
              visibility === "view" || visibility === "pure"
                ? "read-only"
                : "public";
            return `(define-${clarityVisibility} (${name} ${params})`;
          }
        )

        // Fix return statements
        .replace(/return\s+([^;]+)\s*;?/g, "(ok $1)")

        // Remove semicolons (but preserve comments)
        .replace(/;(?![;])/g, "")

        // Clean up extra whitespace
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .replace(/^\s+$/gm, "")
        .trim();

      return rectified;
    },
    [errors]
  );

  // Memoized error lines change callback
  const notifyErrorLinesChange = useCallback(
    (errorLines: number[]) => {
      if (onErrorLinesChange) {
        onErrorLinesChange(errorLines);
      }
    },
    [onErrorLinesChange]
  );

  // Analysis effect
  useEffect(() => {
    if (clarityCode.trim()) {
      setIsAnalyzing(true);
      setAnalysisComplete(false);

      const timer = setTimeout(() => {
        const foundErrors = analyzeCode(clarityCode);
        setErrors(foundErrors);
        setIsAnalyzing(false);
        setAnalysisComplete(true);

        const errorLines = foundErrors.map((error) => error.line);
        notifyErrorLinesChange(errorLines);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setErrors([]);
      setAnalysisComplete(false);
      notifyErrorLinesChange([]);
    }
  }, [clarityCode, analyzeCode, notifyErrorLinesChange]);

  const handleRectify = async () => {
    setIsRectifying(true);
    try {
      const rectifiedCode = await rectifyCode(clarityCode);
      onCodeRectified(rectifiedCode);

      // Re-analyze after rectification
      setTimeout(() => {
        const newErrors = analyzeCode(rectifiedCode);
        setErrors(newErrors);
        setIsRectifying(false);

        const errorLines = newErrors.map((error) => error.line);
        notifyErrorLinesChange(errorLines);
      }, 500);
    } catch (error) {
      console.error("Rectification error:", error);
      setIsRectifying(false);
    }
  };

  if (!clarityCode.trim()) {
    return null;
  }

  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warningCount = errors.filter((e) => e.severity === "warning").length;
  const hasIssues = errorCount > 0 || warningCount > 0;

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      {/* Main floating button */}
      <div className="relative group">
        {/* Glow effect */}
        <div
          className={`absolute -inset-2 rounded-full blur-lg transition-all duration-300 ${
            isAnalyzing
              ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 animate-pulse"
              : hasIssues
              ? "bg-gradient-to-r from-red-500/30 to-orange-500/30"
              : "bg-gradient-to-r from-green-500/30 to-emerald-500/30"
          }`}
        ></div>

        {/* Main button */}
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          title={
            isAnalyzing
              ? "Analyzing code..."
              : hasIssues
              ? `${errorCount + warningCount} issues found`
              : "No issues found"
          }
          className={`relative w-16 h-16 rounded-full backdrop-blur-sm border-2 transition-all duration-300 transform hover:scale-110 ${
            isAnalyzing
              ? "bg-blue-500/20 border-blue-400/40 text-blue-300"
              : hasIssues
              ? "bg-red-500/20 border-red-400/40 text-red-300 hover:bg-red-500/30"
              : "bg-green-500/20 border-green-400/40 text-green-300 hover:bg-green-500/30"
          }`}
        >
          {isAnalyzing ? (
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          ) : hasIssues ? (
            <div className="relative">
              <Bug className="h-6 w-6 mx-auto" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {errorCount + warningCount}
              </div>
            </div>
          ) : (
            <CheckCircle className="h-6 w-6 mx-auto" />
          )}
        </button>

        {/* Rectify button (only show when there are issues) */}
        {hasIssues && analysisComplete && (
          <button
            type="button"
            onClick={handleRectify}
            disabled={isRectifying}
            title={
              isRectifying ? "Fixing issues..." : "Click to fix all issues"
            }
            className={`absolute -left-20 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
              isRectifying
                ? "bg-orange-500/20 border-orange-400/40 text-orange-300"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 border-orange-400/40 text-white shadow-lg shadow-orange-500/40"
            }`}
          >
            {isRectifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Fixing...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Fix Issues</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Details panel */}
      {showDetails && (
        <div className="absolute right-20 top-0 w-80 max-h-96 overflow-hidden">
          <div className="relative group">
            {/* Panel glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-xl blur opacity-75"></div>

            <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-gray-400/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-400/20">
                <div className="flex items-center space-x-2">
                  <Bug className="h-5 w-5 text-orange-400" />
                  <h3 className="font-semibold text-white">Code Analysis</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  title="Close details"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status */}
              <div className="p-4 border-b border-gray-400/20">
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2 text-blue-300">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analyzing code...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4">
                      {errorCount > 0 && (
                        <span className="text-red-400">
                          {errorCount} error{errorCount !== 1 ? "s" : ""}
                        </span>
                      )}
                      {warningCount > 0 && (
                        <span className="text-yellow-400">
                          {warningCount} warning{warningCount !== 1 ? "s" : ""}
                        </span>
                      )}
                      {errorCount === 0 && warningCount === 0 && (
                        <span className="text-green-400">No issues found</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Error list */}
              {errors.length > 0 && (
                <div className="max-h-64 overflow-y-auto">
                  {errors.slice(0, 8).map((error, index) => (
                    <div
                      key={index}
                      className={`p-3 border-b border-gray-400/10 last:border-b-0 ${
                        error.severity === "error"
                          ? "bg-red-500/5"
                          : "bg-yellow-500/5"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {error.severity === "error" ? (
                            <X className="h-3 w-3 text-red-400" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs text-gray-400">
                              Line {error.line}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 text-xs rounded ${
                                error.severity === "error"
                                  ? "bg-red-500/20 text-red-300"
                                  : "bg-yellow-500/20 text-yellow-300"
                              }`}
                            >
                              {error.severity}
                            </span>
                          </div>
                          <p className="text-xs text-gray-200 mb-1">
                            {error.message}
                          </p>
                          {error.suggestion && (
                            <p className="text-xs text-gray-400 italic">
                              {error.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {errors.length > 8 && (
                    <div className="p-2 text-center text-xs text-gray-400">
                      +{errors.length - 8} more issues
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClarityFloatingPlugin;
