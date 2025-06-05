
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWeb3 } from '@/contexts/Web3Context';
import { ArrowLeft, Download, User, Calendar, Eye, File, Wallet } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock dataset data - in real app, this would come from Supabase
const mockDataset = {
  id: '1',
  name: 'E-commerce Customer Behavior',
  description: 'Comprehensive dataset containing customer purchase patterns, demographics, and behavior analytics from a major e-commerce platform. This dataset includes over 100,000 customer records with detailed transaction histories, demographic information, and behavioral patterns. Perfect for machine learning models, customer segmentation, and predictive analytics.',
  fullDescription: `This dataset contains detailed e-commerce customer behavior data collected over a 2-year period from 2022-2024. The data includes:

• Customer Demographics: Age, gender, location, income bracket
• Purchase History: Product categories, purchase amounts, frequency
• Behavioral Patterns: Website navigation, time spent, cart abandonment
• Seasonal Trends: Holiday shopping patterns, seasonal preferences
• Customer Lifecycle: Acquisition channel, lifetime value, churn indicators

The data has been anonymized and cleaned to ensure privacy compliance while maintaining analytical value. All monetary values are in USD and timestamps are in UTC format.`,
  price: '0.5',
  currency: 'ETH',
  seller: '0x1234567890abcdef1234567890abcdef12345678',
  uploadDate: '2024-01-15',
  downloads: 245,
  size: '2.4 MB',
  format: 'CSV',
  records: '100,000+',
  tags: ['e-commerce', 'analytics', 'customer-data', 'behavior', 'demographics'],
  category: 'Business',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  sampleData: [
    { customer_id: 'C001', age: 28, gender: 'F', total_spent: 1250.50, purchases: 12, last_purchase: '2024-01-10' },
    { customer_id: 'C002', age: 35, gender: 'M', total_spent: 890.75, purchases: 8, last_purchase: '2024-01-08' },
    { customer_id: 'C003', age: 42, gender: 'F', total_spent: 2100.25, purchases: 18, last_purchase: '2024-01-12' },
    { customer_id: 'C004', age: 29, gender: 'M', total_spent: 675.00, purchases: 5, last_purchase: '2024-01-05' },
    { customer_id: 'C005', age: 38, gender: 'F', total_spent: 1450.80, purchases: 14, last_purchase: '2024-01-11' },
  ],
  schema: [
    { field: 'customer_id', type: 'string', description: 'Unique customer identifier' },
    { field: 'age', type: 'integer', description: 'Customer age in years' },
    { field: 'gender', type: 'string', description: 'Customer gender (M/F)' },
    { field: 'total_spent', type: 'float', description: 'Total amount spent in USD' },
    { field: 'purchases', type: 'integer', description: 'Number of purchases made' },
    { field: 'last_purchase', type: 'date', description: 'Date of last purchase (YYYY-MM-DD)' },
  ]
};

const Dataset = () => {
  const { id } = useParams();
  const { isConnected, account } = useWeb3();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // In a real app, you'd fetch the dataset by ID from Supabase
  const dataset = mockDataset;

  const handlePurchase = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to purchase datasets.",
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);

    try {
      // Here you would call the smart contract to purchase the dataset
      console.log('Initiating purchase transaction...');
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: "Purchase Successful!",
        description: "You can now download the dataset.",
      });

      setShowPurchaseModal(false);
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/marketplace" 
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dataset Header */}
            <Card className="bg-black/40 border-purple-500/20">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={dataset.image}
                  alt={dataset.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dataset.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-2xl text-white">{dataset.name}</CardTitle>
                <p className="text-gray-300 leading-relaxed">{dataset.description}</p>
              </CardHeader>
            </Card>

            {/* Full Description */}
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Dataset Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {dataset.fullDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Schema */}
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Data Schema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-500/20">
                        <th className="text-left py-2 text-purple-400">Field</th>
                        <th className="text-left py-2 text-purple-400">Type</th>
                        <th className="text-left py-2 text-purple-400">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.schema.map((field, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="py-2 text-white font-mono">{field.field}</td>
                          <td className="py-2 text-gray-300">{field.type}</td>
                          <td className="py-2 text-gray-400">{field.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Sample Data Preview */}
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Data Preview (First 5 rows)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-purple-500/20">
                        {Object.keys(dataset.sampleData[0]).map((key) => (
                          <th key={key} className="text-left py-2 text-purple-400 font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.sampleData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          {Object.values(row).map((value, valueIndex) => (
                            <td key={valueIndex} className="py-2 text-gray-300 font-mono">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="bg-black/40 border-purple-500/20 sticky top-8">
              <CardHeader>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {dataset.price} {dataset.currency}
                  </div>
                  <p className="text-gray-400">One-time purchase</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3"
                      disabled={!isConnected}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      {isConnected ? 'Purchase Dataset' : 'Connect Wallet to Purchase'}
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="bg-black/90 border-purple-500/20">
                    <DialogHeader>
                      <DialogTitle className="text-white">Confirm Purchase</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-500/10 rounded-lg">
                        <h3 className="text-white font-medium mb-2">{dataset.name}</h3>
                        <div className="text-gray-400 text-sm">
                          Price: {dataset.price} {dataset.currency}
                        </div>
                      </div>
                      
                      <div className="text-gray-300 text-sm">
                        <p>By purchasing this dataset, you agree to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Use the data for legitimate purposes only</li>
                          <li>Not redistribute the data without permission</li>
                          <li>Respect the original data licensing terms</li>
                        </ul>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowPurchaseModal(false)}
                          className="flex-1 border-gray-600 text-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePurchase}
                          disabled={isPurchasing}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                        >
                          {isPurchasing ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </div>
                          ) : (
                            'Confirm Purchase'
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample
                </Button>
              </CardContent>
            </Card>

            {/* Dataset Info */}
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Dataset Information</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Format:</span>
                  <span className="text-white">{dataset.format}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">{dataset.size}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Records:</span>
                  <span className="text-white">{dataset.records}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white">{dataset.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Downloads:</span>
                  <span className="text-white">{dataset.downloads}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Upload Date:</span>
                  <span className="text-white">
                    {new Date(dataset.uploadDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <span className="text-gray-400">Address:</span>
                  <div className="text-blue-400 font-mono text-sm break-all">
                    {dataset.seller}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Datasets Sold:</span>
                  <span className="text-white">12</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-yellow-400">★★★★☆ (4.2)</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                >
                  View Seller Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dataset;
