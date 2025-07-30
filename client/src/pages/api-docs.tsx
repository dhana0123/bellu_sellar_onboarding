import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Book, Code, Lock, Plug, Shield, Phone, Mail, MessageCircle } from 'lucide-react';
import CodeBlock from '@/components/code-block';

export default function ApiDocsPage() {
  const [, setLocation] = useLocation();

  const handleBackToDashboard = () => {
    setLocation('/success');
  };

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-bellu-primary to-bellu-gold bg-clip-text text-transparent">API Documentation</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">Integrate bellu.ai's 10-minute delivery infrastructure</p>
          <div className="flex justify-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-bellu-primary/20 text-bellu-primary">
              <div className="w-2 h-2 bg-bellu-primary rounded-full mr-2"></div>
              v1.0 API
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-bellu-gold/20 text-bellu-gold">
              <Shield className="w-3 h-3 mr-2" />
              Production Ready
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="gradient-border sticky top-24">
              <Card className="gradient-border-content bg-black border-none">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Documentation</h3>
                  <nav className="space-y-2 text-sm">
                    <a href="#getting-started" className="block text-bellu-primary hover:text-bellu-gold transition-colors">Getting Started</a>
                    <a href="#authentication" className="block text-gray-400 hover:text-white transition-colors">Authentication</a>
                    <a href="#webhooks" className="block text-gray-400 hover:text-white transition-colors">Webhooks</a>
                    <a href="#order-api" className="block text-gray-400 hover:text-white transition-colors">Order API</a>
                    <a href="#examples" className="block text-gray-400 hover:text-white transition-colors">Code Examples</a>
                    <a href="#testing" className="block text-gray-400 hover:text-white transition-colors">Testing</a>
                    <a href="#support" className="block text-gray-400 hover:text-white transition-colors">Support</a>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            <section id="getting-started" className="gradient-border">
              <Card className="gradient-border-content bg-black border-none">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Book className="text-bellu-primary mr-3" />
                    Getting Started
                  </h2>
                  <p className="text-gray-300 mb-6">Welcome to Bellu Kart's delivery infrastructure API. Integrate 10-minute delivery into your existing e-commerce platform in minutes.</p>
                  
                  <div className="bg-bellu-darker rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3">Quick Integration Steps:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                      <li>Set up webhook endpoint to receive orders</li>
                      <li>Configure authentication with your API key</li>
                      <li>Test the integration with sample orders</li>
                      <li>Go live with 10-minute delivery</li>
                    </ol>
                  </div>

                  <div className="bg-bellu-primary/10 border border-bellu-primary/20 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-bellu-primary rounded-full mr-3 mt-2"></div>
                      <div className="text-sm">
                        <p className="font-medium text-bellu-primary mb-1">Pro Tip</p>
                        <p className="text-gray-300">Use our Postman collection for quick testing and integration validation.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Authentication */}
            <section id="authentication" className="gradient-border">
              <Card className="gradient-border-content bg-black border-none">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Lock className="text-bellu-gold mr-3" />
                    Authentication
                  </h2>
                  <p className="text-gray-300 mb-6">All API requests require authentication using your unique API key.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">API Key</h4>
                      <CodeBlock
                        code="Authorization: Bearer bk_seller_8f9d2a1c4e6b7h3j"
                        language="text"
                        title="Header Format"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Example Request</h4>
                      <CodeBlock
                        code={`curl -X POST https://api.bellu.ai/v1/orders \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"order_id": "ORD123", "items": [...], ...}'`}
                        language="curl"
                        title="cURL Request"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Webhooks */}
            <section id="webhooks" className="gradient-border">
              <Card className="gradient-border-content bg-black border-none">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Plug className="text-bellu-primary mr-3" />
                    Webhook Integration
                  </h2>
                  <p className="text-gray-300 mb-6">bellu.ai sends real-time notifications to your webhook endpoint for all order lifecycle events - from creation to delivery completion.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Webhook URL</h4>
                      <CodeBlock
                        code="https://bellu.ai/webhook/orders"
                        language="text"
                        title="Endpoint URL"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Webhook Events</h4>
                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-bellu-darker border border-bellu-gray rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                              <code className="text-blue-400">order.created</code>
                            </div>
                            <p className="text-gray-400 text-sm">New order placed by customer</p>
                          </div>
                          <div className="bg-bellu-darker border border-bellu-gray rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                              <code className="text-yellow-400">order.confirmed</code>
                            </div>
                            <p className="text-gray-400 text-sm">Order confirmed and accepted by seller</p>
                          </div>
                          <div className="bg-bellu-darker border border-bellu-gray rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                              <code className="text-orange-400">order.prepared</code>
                            </div>
                            <p className="text-gray-400 text-sm">Order items prepared and ready for pickup</p>
                          </div>
                          <div className="bg-bellu-darker border border-bellu-gray rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                              <code className="text-purple-400">order.dispatched</code>
                            </div>
                            <p className="text-gray-400 text-sm">Order picked up by delivery partner</p>
                          </div>
                          <div className="bg-bellu-darker border border-bellu-gray rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                              <code className="text-green-400">order.delivered</code>
                            </div>
                            <p className="text-gray-400 text-sm">Order successfully delivered to customer</p>
                          </div>
                          <div className="bg-bellu-darker border border-bellu-gray rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                              <code className="text-red-400">order.cancelled</code>
                            </div>
                            <p className="text-gray-400 text-sm">Order cancelled by customer or system</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Sample Payloads</h4>
                      <div className="space-y-4">
                        <CodeBlock
                          code={`{
  "event": "order.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "order_id": "BK_ORDER_xyz123",
    "external_order_id": "YOUR_ORDER_123",
    "customer": {
      "name": "John Doe",
      "phone": "+91 98765 43210",
      "email": "john@example.com"
    },
    "items": [
      {
        "name": "Premium Toothpaste",
        "quantity": 2,
        "price": 240,
        "sku": "TOOTH_001"
      }
    ],
    "total_amount": 480,
    "delivery_address": {
      "street": "123 MG Road",
      "area": "Indiranagar", 
      "city": "Bengaluru",
      "pincode": "560038"
    },
    "pickup_point": {
      "name": "Bellandur Dark Store",
      "address": "Bellandur, Bengaluru"
    }
  }
}`}
                          language="json"
                          title="Order Created Payload"
                        />
                        
                        <CodeBlock
                          code={`{
  "event": "order.dispatched",
  "timestamp": "2024-01-15T10:45:00Z",
  "data": {
    "order_id": "BK_ORDER_xyz123",
    "external_order_id": "YOUR_ORDER_123",
    "delivery_partner": {
      "name": "Ravi Kumar",
      "phone": "+91 98765 12345",
      "vehicle_number": "KA01AB1234"
    },
    "estimated_delivery_time": "2024-01-15T11:00:00Z",
    "tracking_url": "https://track.bellu.ai/BK_ORDER_xyz123"
  }
}`}
                          language="json"
                          title="Order Dispatched Payload"
                        />

                        <CodeBlock
                          code={`{
  "event": "order.delivered",
  "timestamp": "2024-01-15T10:58:00Z", 
  "data": {
    "order_id": "BK_ORDER_xyz123",
    "external_order_id": "YOUR_ORDER_123",
    "delivered_at": "2024-01-15T10:58:00Z",
    "delivery_time_minutes": 28,
    "customer_rating": 5,
    "delivery_proof": {
      "type": "photo",
      "url": "https://proof.bellu.ai/xyz123.jpg"
    }
  }
}`}
                          language="json"
                          title="Order Delivered Payload"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Response Format</h4>
                      <p className="text-gray-400 text-sm mb-3">Your webhook endpoint should respond with HTTP 200 and appropriate JSON based on the event:</p>
                      <div className="space-y-3">
                        <CodeBlock
                          code={`// For order.created
{
  "status": "received",
  "order_id": "YOUR_ORDER_123",
  "estimated_prep_time": 300
}

// For order.confirmed  
{
  "status": "confirmed",
  "order_id": "YOUR_ORDER_123",
  "prep_start_time": "2024-01-15T10:32:00Z"
}

// For order.prepared
{
  "status": "ready_for_pickup", 
  "order_id": "YOUR_ORDER_123",
  "pickup_instructions": "Counter 2, ask for John's order"
}

// For other events
{
  "status": "acknowledged",
  "order_id": "YOUR_ORDER_123"
}`}
                          language="json"
                          title="Response JSON Examples"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Code Examples */}
            <section id="examples" className="gradient-border">
              <Card className="gradient-border-content bg-black border-none">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Code className="text-bellu-primary mr-3" />
                    Code Examples
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Node.js Example */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <span className="w-4 h-4 bg-yellow-400 rounded mr-2"></span>
                        Node.js Express Webhook
                      </h4>
                      <CodeBlock
                        code={`const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook/bellu-orders', (req, res) => {
  const { event, data } = req.body;
  
  switch (event) {
    case 'order.created':
      console.log(\`New order: \${data.order_id}\`);
      res.json({
        status: 'received',
        order_id: data.external_order_id,
        estimated_prep_time: 300
      });
      break;
      
    case 'order.confirmed':
      console.log(\`Order confirmed: \${data.order_id}\`);
      res.json({
        status: 'confirmed',
        order_id: data.external_order_id,
        prep_start_time: new Date().toISOString()
      });
      break;
      
    case 'order.dispatched':
      console.log(\`Order dispatched: \${data.order_id}\`);
      console.log(\`Delivery partner: \${data.delivery_partner.name}\`);
      res.json({
        status: 'acknowledged',
        order_id: data.external_order_id
      });
      break;
      
    case 'order.delivered':
      console.log(\`Order delivered: \${data.order_id}\`);
      console.log(\`Delivery time: \${data.delivery_time_minutes} minutes\`);
      res.json({
        status: 'acknowledged',
        order_id: data.external_order_id
      });
      break;
      
    default:
      res.json({ status: 'acknowledged' });
  }
});

app.listen(3000);`}
                        language="javascript"
                        title="Node.js Express Server"
                      />
                    </div>

                    {/* Python Example */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <span className="w-4 h-4 bg-blue-400 rounded mr-2"></span>
                        Python Flask Webhook
                      </h4>
                      <CodeBlock
                        code={`from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook/bellu-orders', methods=['POST'])
def handle_order():
    data = request.get_json()
    event = data['event']
    order_data = data['data']
    
    if event == 'order.created':
        print(f"New order: {order_data['order_id']}")
        return jsonify({
            'status': 'received',
            'order_id': order_data['external_order_id'],
            'estimated_prep_time': 300
        })
        
    elif event == 'order.confirmed':
        print(f"Order confirmed: {order_data['order_id']}")
        return jsonify({
            'status': 'confirmed',
            'order_id': order_data['external_order_id'],
            'prep_start_time': datetime.now().isoformat()
        })
        
    elif event == 'order.dispatched':
        print(f"Order dispatched: {order_data['order_id']}")
        print(f"Delivery partner: {order_data['delivery_partner']['name']}")
        return jsonify({
            'status': 'acknowledged',
            'order_id': order_data['external_order_id']
        })
        
    elif event == 'order.delivered':
        print(f"Order delivered: {order_data['order_id']}")
        print(f"Delivery time: {order_data['delivery_time_minutes']} minutes")
        return jsonify({
            'status': 'acknowledged',
            'order_id': order_data['external_order_id']
        })
        
    return jsonify({'status': 'acknowledged'})

app.run(port=3000)`}
                        language="python"
                        title="Python Flask Server"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Support */}
            <section id="support" className="gradient-border">
              <Card className="gradient-border-content bg-black border-none">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Phone className="text-bellu-primary mr-3" />
                    Support & Help
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Get Help</h4>
                      <div className="space-y-3">
                        <a href="#" className="flex items-center p-3 bg-bellu-darker rounded-lg hover:bg-bellu-gray transition-colors">
                          <Mail className="text-bellu-primary mr-3" />
                          <div>
                            <div className="font-medium">Email Support</div>
                            <div className="text-sm text-gray-400">tech@bellu.ai</div>
                          </div>
                        </a>
                        <a href="#" className="flex items-center p-3 bg-bellu-darker rounded-lg hover:bg-bellu-gray transition-colors">
                          <Phone className="text-bellu-gold mr-3" />
                          <div>
                            <div className="font-medium">Phone Support</div>
                            <div className="text-sm text-gray-400">+91 80 4567 8900</div>
                          </div>
                        </a>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Resources</h4>
                      <div className="space-y-3">
                        <a href="#" className="flex items-center p-3 bg-bellu-darker rounded-lg hover:bg-bellu-gray transition-colors">
                          <Book className="text-bellu-primary mr-3" />
                          <div>
                            <div className="font-medium">Integration Guide</div>
                            <div className="text-sm text-gray-400">Step-by-step tutorials</div>
                          </div>
                        </a>
                        
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <Button
            onClick={handleBackToDashboard}
            className="bg-gradient-to-r from-bellu-primary to-bellu-gold text-black font-semibold py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-bellu-primary/25 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
