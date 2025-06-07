import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Download, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Initialize Supabase client
const supabaseUrl = "https://emzcdxpagwnxesvnsfje.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtemNkeHBhZ3dueGVzdm5zZmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDI1MzMsImV4cCI6MjA2NDcxODUzM30._bio527GlUa910ZGaUjiCLmkli8dgE67p9A7TxO0ui0";



const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Marketplace = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'Business', 'Science', 'Finance', 'Technology', 'Healthcare'];

  useEffect(() => {
    async function fetchDatasets() {
      setLoading(true);
      setError(null);

      // Fetch all datasets from Supabase table 'datasets'
      const { data, error } = await supabase
        .from('datasets')
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        setDatasets(data);
      }
      setLoading(false);
    }
    fetchDatasets();
  }, []);

  // Filter and sort datasets
  const filteredAndSortedDatasets = datasets
    .filter(dataset => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        dataset.name.toLowerCase().includes(term) ||
        dataset.description.toLowerCase().includes(term) ||
        (dataset.tags && dataset.tags.some(tag => tag.toLowerCase().includes(term)));
      const matchesCategory = filterCategory === 'all' || dataset.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'popular':
          return b.downloads - a.downloads;
        case 'newest':
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });

  if (loading) return <p className="text-white text-center mt-8">Loading datasets...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">Error: {error}</p>;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Dataset Marketplace</h1>
          <p className="text-gray-300 text-lg">Discover and purchase high-quality datasets from the community</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-purple-500/20 text-white placeholder-gray-400"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[200px] bg-black/40 border-purple-500/20 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px] bg-black/40 border-purple-500/20 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {filteredAndSortedDatasets.length} of {datasets.length} datasets
          </p>
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDatasets.length > 0 ? (
            filteredAndSortedDatasets.map((dataset) => (
              <Card key={dataset.id} className="bg-black/40 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={dataset.image}
                    alt={dataset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg line-clamp-2">{dataset.name}</CardTitle>
                  <p className="text-gray-400 text-sm line-clamp-3">{dataset.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {dataset.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta Information */}
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center justify-between">
                     <span className="flex items-center">
  <User className="w-4 h-4 mr-1" />
  {dataset.uploader_address}
</span>
                      <span>{dataset.format}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {dataset.downloads} downloads
                      </span>
                      <span>{dataset.size}</span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(dataset.uploadDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                    <div className="text-xl font-bold text-purple-400">
                      {dataset.price} {dataset.currency}
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/dataset/${dataset.id}`}>
                        <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No datasets found matching your criteria</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
