import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy, Book, Download, Calendar, Building, Key, Rocket, ArrowLeft, Phone } from 'lucide-react';

export default function SuccessPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [sellerId] = useState(() => {
    // In a real app, you'd get this from route params or state
    return new URLSearchParams(window.location.search).get('sellerId') || '';
  });

  const { data: sellerData, isLoading } = useQuery({
    queryKey: ['/api/sellers', sellerId],
    enabled: !!sellerId,
  });

  const seller = (sellerData as any)?.seller;

  const handleCopyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleViewApiDocs = () => {
    setLocation('/api-docs');
  };

  const handleDownloadPostman = () => {
    // Create and download Postman collection
    const collection = {
      info: {
        name: 'Bellu API',
        description: 'API collection for Bellu seller integration',
        version: '1.0.0',
      },
      item: [
        {
          name: 'Webhook Example',
          request: {
            method: 'POST',
            header: [
              {
                key: 'Authorization',
                value: `Bearer ${seller?.apiKey}`,
              },
              {
                key: 'Content-Type',
                value: 'application/json',
              },
            ],
            url: {
              raw: 'https://api.bellu.ai/v1/orders',
              protocol: 'https',
              host: ['api', 'bellu', 'ai'],
              path: ['v1', 'orders'],
            },
            body: {
              mode: 'raw',
              raw: JSON.stringify({
                order_id: 'BK_ORDER_xyz123',
                items: [
                  {
                    name: 'Premium Toothpaste',
                    quantity: 2,
                    price: 240,
                    sku: 'TOOTH_001',
                  },
                ],
                total_amount: 480,
                customer: {
                  name: 'John Doe',
                  phone: '+91 98765 43210',
                  email: 'john@example.com',
                },
              }),
            },
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(collection, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bellu-kart-api-collection.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded!',
      description: 'Postman collection downloaded successfully',
    });
  };

  const handleScheduleCall = () => {
    // Open calendar booking (would integrate with Calendly or similar)
    window.open('https://calendly.com/bellu-kart/integration-call', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-bellu-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Seller Not Found</h1>
          <Button onClick={() => setLocation('/')}>Go to Onboarding</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Animation */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-bellu-primary to-bellu-gold rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Check className="text-black text-4xl" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            🎉 <span className="bg-gradient-to-r from-bellu-primary to-bellu-gold bg-clip-text text-transparent">Bellu Infra Activated!</span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">Your 10-minute delivery infrastructure is now live</p>
          <p className="text-sm text-gray-400">Integration takes just 5 minutes • Our team will contact you within 24 hours</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* API Credentials */}
          <div className="gradient-border">
            <Card className="gradient-border-content bg-bellu-dark border-none">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Key className="text-bellu-primary mr-3" />
                  <h3 className="text-xl font-semibold">Your API Credentials</h3>
                </div>
                
                <div className="space-y-4">
                  {/* API Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
                    <div className="flex items-center bg-bellu-darker border border-bellu-gray rounded-lg p-3">
                      <code className="flex-1 text-bellu-primary font-mono text-sm">{seller.apiKey}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyToClipboard(seller.apiKey, 'API Key')}
                        className="ml-3 p-2 text-gray-400 hover:text-bellu-primary"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Webhook URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Webhook URL</label>
                    <div className="flex items-center bg-bellu-darker border border-bellu-gray rounded-lg p-3">
                      <code className="flex-1 text-bellu-primary font-mono text-sm">https://bellu.ai/webhook/orders</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyToClipboard('https://bellu.ai/webhook/orders', 'Webhook URL')}
                        className="ml-3 p-2 text-gray-400 hover:text-bellu-primary"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Environment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Environment</label>
                    <div className="bg-bellu-darker border border-bellu-gray rounded-lg p-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-bellu-primary/20 text-bellu-primary">
                        <div className="w-2 h-2 bg-bellu-primary rounded-full mr-2"></div>
                        Production Ready
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-bellu-darker/50 rounded-lg border border-bellu-gray">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-bellu-primary rounded-full mr-3 mt-2"></div>
                    <div className="text-sm text-gray-300">
                      <p className="font-medium mb-1">Keep your API key secure</p>
                      <p>Never expose it in client-side code. Use it only in your backend services.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="gradient-border">
              <Card className="gradient-border-content bg-bellu-dark border-none">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Rocket className="text-bellu-gold mr-3" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={handleViewApiDocs}
                      variant="ghost"
                      className="w-full bg-bellu-gray hover:bg-bellu-light-gray text-left p-4 rounded-lg transition-colors flex items-center justify-between h-auto"
                    >
                      <div className="flex items-center">
                        <Book className="text-bellu-primary mr-3" />
                        <div>
                          <div className="font-medium">View API Documentation</div>
                          <div className="text-sm text-gray-400">Integration guides and examples</div>
                        </div>
                      </div>
                      <ArrowLeft className="text-gray-400 rotate-180" />
                    </Button>

                    <Button
                      onClick={handleDownloadPostman}
                      variant="ghost"
                      className="w-full bg-bellu-gray hover:bg-bellu-light-gray text-left p-4 rounded-lg transition-colors flex items-center justify-between h-auto"
                    >
                      <div className="flex items-center">
                        <Download className="text-bellu-gold mr-3" />
                        <div>
                          <div className="font-medium">Download Postman Collection</div>
                          <div className="text-sm text-gray-400">Ready-to-use API examples</div>
                        </div>
                      </div>
                      <ArrowLeft className="text-gray-400 rotate-180" />
                    </Button>

                    <Button
                      onClick={handleScheduleCall}
                      variant="ghost"
                      className="w-full bg-bellu-gray hover:bg-bellu-light-gray text-left p-4 rounded-lg transition-colors flex items-center justify-between h-auto"
                    >
                      <div className="flex items-center">
                        <Calendar className="text-bellu-primary mr-3" />
                        <div>
                          <div className="font-medium">Schedule Integration Call</div>
                          <div className="text-sm text-gray-400">Free 30-min tech support</div>
                        </div>
                      </div>
                      <ArrowLeft className="text-gray-400 rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Business Details */}
            <div className="gradient-border">
              <Card className="gradient-border-content bg-bellu-dark border-none">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Building className="text-bellu-primary mr-3" />
                    Your Business Profile
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Brand Name:</span>
                      <span>{seller.brandName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Website:</span>
                      <span className="text-bellu-primary">{seller.websiteUrl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span>{seller.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected Orders:</span>
                      <span>{seller.monthlyOrders || 'Not specified'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="mt-12 gradient-border">
          <Card className="gradient-border-content bg-bellu-dark border-none">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">What Happens Next?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-bellu-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-6 h-6 bg-bellu-primary rounded-full"></div>
                  </div>
                  <h4 className="font-semibold mb-2">Email Integration Guide</h4>
                  <p className="text-sm text-gray-400">Detailed setup instructions sent to your email within 5 minutes</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-bellu-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="text-bellu-gold" />
                  </div>
                  <h4 className="font-semibold mb-2">Technical Support Call</h4>
                  <p className="text-sm text-gray-400">Our integration team will call you within 24 hours</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-bellu-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="text-bellu-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Go Live</h4>
                  <p className="text-sm text-gray-400">Start receiving 10-minute delivery orders instantly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
