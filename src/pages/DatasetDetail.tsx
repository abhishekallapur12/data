import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download, User, Wallet } from 'lucide-react';

const supabaseUrl = "https://emzcdxpagwnxesvnsfje.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtemNkeHBhZ3dueGVzdm5zZmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDI1MzMsImV4cCI6MjA2NDcxODUzM30._bio527GlUa910ZGaUjiCLmkli8dgE67p9A7TxO0ui0";

// Replace with your actual Razorpay key
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_WmJqYIBGxRoq4W";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });

const DatasetDetail = () => {
  const { id } = useParams();

  // State variables
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Check MetaMask connection on mount
  useEffect(() => {
    checkWalletConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log('Wallet connected:', accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      setHasPurchased(false);
    } else {
      setWalletAddress(null);
      setHasPurchased(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setWalletAddress(accounts[0]);
        alert('Wallet connected successfully!');
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet: ' + error.message);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
    }
  };

  // Fetch dataset details
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    setDataset(null);

    async function fetchDataset() {
      try {
        const { data, error } = await supabase
          .from('datasets')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setDataset(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDataset();
  }, [id]);

  // Check if wallet already purchased this dataset
  useEffect(() => {
    if (!walletAddress || !dataset) return;

    async function checkPurchase() {
      try {
        const { data, error } = await supabase
          .from('purchases')
          .select('id')
          .eq('dataset_id', dataset.id)
          .eq('buyer_address', walletAddress.toLowerCase())
          .maybeSingle();

        if (error) {
          console.error('Purchase check error:', error);
          return;
        }

        setHasPurchased(!!data);
        console.log('Purchase status:', !!data);
      } catch (err) {
        console.error('Purchase check failed:', err);
      }
    }
    checkPurchase();
  }, [walletAddress, dataset]);

  // Handle crypto payment via MetaMask
  async function processCryptoPayment(amount) {
    if (!window.ethereum || !walletAddress) {
      throw new Error('MetaMask not connected');
    }

    try {
      // Convert amount to Wei (assuming price is in ETH)
      const amountInWei = (BigInt(Math.floor(amount * 1e18))).toString(16);

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: '0x742d35Cc6635C0532925a3b8D9C3A46e8D2b40c1', // Replace with your wallet address
          value: '0x' + amountInWei,
          gas: '0x5208',
        }]
      });

      return {
        success: true,
        transactionId: txHash
      };
    } catch (error) {
      console.error('Payment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create Razorpay order (Mock implementation since we don't have backend)
  async function createRazorpayOrder(amount, datasetId) {
    // Since you don't have the backend function working, we'll create a mock order
    // In production, this should call your backend API
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: orderId,
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR"
    };
  }

  // Fixed Razorpay payment function
  async function processRazorpayPayment(amount, datasetId) {
    try {
      console.log('Starting Razorpay payment process...');
      
      // Load Razorpay script first
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script. Please check your internet connection.");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay not available after script load");
      }

      // Create order (using mock for now)
      let order;
      try {
        // Try to use your backend first
        const response = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100),
            currency: "INR",
            dataset_id: datasetId,
          }),
        });

        if (response.ok) {
          order = await response.json();
        } else {
          throw new Error('Backend order creation failed');
        }
      } catch (backendError) {
        console.warn('Backend order creation failed, using mock order:', backendError);
        // Fallback to mock order
        order = await createRazorpayOrder(amount, datasetId);
      }

      console.log('Order created:', order);

      // Return promise for Razorpay payment
      return new Promise((resolve, reject) => {
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency || "INR",
          name: "Dataverse Market",
          description: `Purchase: ${dataset?.name || 'Dataset'}`,
          order_id: order.id,
          handler: function (response) {
            console.log("Razorpay payment success:", response);
            resolve({
              success: true,
              transactionId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });
          },
          prefill: {
            name: 'Dataset Buyer',
            email: 'buyer@example.com',
            contact: '9999999999'
          },
          theme: {
            color: "#6366f1"
          },
          modal: {
            ondismiss: function() {
              console.log('Razorpay modal dismissed by user');
              reject({ success: false, error: 'Payment cancelled by user' });
            }
          }
        };

        console.log('Opening Razorpay with options:', options);

        try {
          const rzp = new window.Razorpay(options);
          
          rzp.on('payment.failed', function (response) {
            console.error("Razorpay payment failed:", response);
            reject({ 
              success: false, 
              error: response.error?.description || 'Payment failed' 
            });
          });

          rzp.open();
        } catch (rzpError) {
          console.error('Error opening Razorpay:', rzpError);
          reject({
            success: false,
            error: 'Failed to open payment gateway: ' + rzpError.message
          });
        }
      });

    } catch (error) {
      console.error("Razorpay processing error:", error);
      return { 
        success: false, 
        error: error.message || 'Payment processing failed' 
      };
    }
  }

  // Handle Buy button click
  async function handleBuy(paymentMethod = 'crypto') {
    if (!dataset) return;

    // For crypto payments, require wallet connection
    if (paymentMethod === 'crypto' && !walletAddress) {
      alert("Please connect your MetaMask wallet to purchase with cryptocurrency.");
      return;
    }

    setBuying(true);

    try {
      let paymentResult;
      
      if (paymentMethod === 'crypto') {
        paymentResult = await processCryptoPayment(dataset.price);
      } else if (paymentMethod === 'razorpay') {
        console.log('Initiating Razorpay payment for amount:', dataset.price);
        paymentResult = await processRazorpayPayment(dataset.price, dataset.id);
      }

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      console.log('Payment successful:', paymentResult);

      // For Razorpay payments, use a placeholder address if wallet not connected
      const buyerAddress = walletAddress || `razorpay_${Date.now()}`;

      // Insert purchase record
      const { error: purchaseError } = await supabase.from('purchases').insert([{
        dataset_id: dataset.id,
        buyer_address: buyerAddress.toLowerCase(),
        tx_hash: paymentResult.transactionId,
        confirmed: true,
        payment_method: paymentMethod
      }]);

      if (purchaseError) {
        console.error('Purchase record error:', purchaseError);
        throw purchaseError;
      }

      // Call RPC to increment downloads count
      const { error: updateError } = await supabase.rpc('increment_downloads', { 
        dataset_id: dataset.id 
      });
      
      if (updateError) {
        console.warn('Failed to update download count:', updateError);
      }

      alert('Purchase successful! You can now download the dataset.');
      setHasPurchased(true);

      // Refresh dataset details
      const { data } = await supabase
        .from('datasets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setDataset(data);
      
    } catch (err) {
      console.error('Purchase failed:', err);
      alert('Purchase failed: ' + err.message);
    } finally {
      setBuying(false);
    }
  }

  // Handle download from IPFS
  async function handleDownload() {
    if (!dataset?.ipfs_hash) {
      alert('No IPFS hash available for this dataset');
      return;
    }

    setDownloading(true);
    
    try {
      // Use public IPFS gateway
      const ipfsUrl = `https://ipfs.io/ipfs/${dataset.ipfs_hash}`;
      
      // Create download link
      const link = document.createElement('a');
      link.href = ipfsUrl;
      const ext = dataset.file_extension || 'zip';
      link.download = `${dataset.name}.${ext}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed: ' + err.message);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) return <p className="text-white text-center mt-8">Loading dataset...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  if (!dataset) return <p className="text-gray-400 text-center mt-8">Dataset not found</p>;

  const schema = dataset.schema_json || [];
  const preview = dataset.preview_json || [];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 text-white">
      {/* Wallet connection status */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {walletAddress ? (
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-green-500" />
              <span>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-red-500" />
              <span>Wallet not connected</span>
            </div>
          )}
        </div>
        
        {!walletAddress && (
          <Button 
            onClick={connectWallet}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Connect MetaMask
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Image + Info */}
        <div>
          <img
            src={dataset.image}
            alt={dataset.name}
            className="w-full rounded-xl mb-6 object-cover max-h-[400px]"
          />

          <div className="flex flex-wrap gap-2 mb-4">
            {dataset.tags?.map(tag => (
              <Badge key={tag} className="bg-purple-500/20 text-purple-300 text-xs">{tag}</Badge>
            ))}
          </div>

          <h1 className="text-3xl font-bold mb-2">{dataset.name}</h1>
          <p>{dataset.description}</p>
          <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
            <User className="inline w-4 h-4" />
            Uploaded by: <span className="font-mono">{dataset.uploader_address}</span>
          </p>

          <div className="text-sm text-gray-400 space-y-2 mb-6">
            <p className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Seller: {dataset.seller}
            </p>
            <p className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              {dataset.downloads} downloads • {dataset.size}
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(dataset.uploadDate).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-2xl font-bold text-purple-400">
              ₹{dataset.price}
            </div>
            
            {hasPurchased ? (
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? 'Downloading...' : 'Download'}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600"
                  onClick={() => handleBuy('crypto')}
                  disabled={buying || !walletAddress}
                >
                  {buying ? 'Processing...' : 'Buy with ETH'}
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                  onClick={() => handleBuy('razorpay')}
                  disabled={buying}
                >
                  {buying ? 'Processing...' : 'Buy with Razorpay'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Schema & Preview */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Data Schema</h2>
          <div className="overflow-auto max-h-64 rounded border border-purple-500/20 mb-8">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="bg-purple-500/10 text-purple-300">
                <tr>
                  <th className="px-4 py-2">Field</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {schema.map(({ field, type, description }) => (
                  <tr key={field} className="border-t border-purple-500/10">
                    <td className="px-4 py-2">{field}</td>
                    <td className="px-4 py-2">{type}</td>
                    <td className="px-4 py-2">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mb-2">Preview (first 5 rows)</h2>
          <div className="overflow-auto rounded border border-purple-500/20">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="bg-purple-500/10 text-purple-300">
                <tr>
                  {schema.map(({ field }) => (
                    <th key={field} className="px-4 py-2">{field}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
                  <tr key={idx} className="border-t border-purple-500/10">
                    {schema.map(({ field }) => (
                      <td key={field} className="px-4 py-2">{row[field]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;