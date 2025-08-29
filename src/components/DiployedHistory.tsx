import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext'; // Adjust the import path as needed
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Grid,
  Container
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import HistoryIcon from '@mui/icons-material/History';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Define types for our deployment data
interface ContractABI {
  type: string;
  name: string;
  inputs: Array<{
    name: string;
    type: string;
  }>;
  outputs: Array<{
    name?: string;
    type: string;
  }>;
}

interface ContractCode {
  abi: ContractABI[];
  bytecode: string;
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

      if (data.success) {
        setDeployments(data.data.deployments);
        setSuccess(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDeploymentHistory();
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <HistoryIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Deployment History
          </Typography>
        </Box>

        {!isConnected ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please connect your wallet to view deployment history.
          </Alert>
        ) : (
          <>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountBalanceWalletIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                Connected wallet: <strong>{address}</strong>
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Repository Name"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="Enter your contract repository name"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    sx={{ height: '56px' }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Fetch History'}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
          </>
        )}
      </Paper>

      {deployments.length > 0 && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Deployment Results for "{repoName}"
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Found {deployments.length} deployment{deployments.length !== 1 ? 's' : ''}
          </Typography>

          {deployments.map((deployment, index) => (
            <Card key={deployment.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" component="h3">
                      Version: {deployment.version}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deployed at: {formatDate(deployment.deployedAt)}
                    </Typography>
                  </Box>
                  <Chip
                    label={deployment.codeChanged ? 'Code Changed' : 'No Changes'}
                    color={deployment.codeChanged ? 'primary' : 'default'}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    <strong>Contract Hash:</strong> {deployment.contractCodeHash}
                  </Typography>
                </Box>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center">
                      <CodeIcon sx={{ mr: 1 }} />
                      <Typography>View Contract Details</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle2" gutterBottom>
                      ABI:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', overflow: 'auto' }}>
                      <pre>
                        {JSON.stringify(deployment.contractCode.abi, null, 2)}
                      </pre>
                    </Paper>

                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Bytecode (truncated):
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', overflow: 'auto' }}>
                      <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                        {deployment.contractCode.bytecode.substring(0, 100)}...
                      </Typography>
                    </Paper>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {isConnected && deployments.length === 0 && !loading && repoName && (
        <Alert severity="info">
          No deployment history found for repository "{repoName}" with your connected wallet.
        </Alert>
      )}
    </Container>
  );
};

export default DeployedHistory;