import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { OTPInput } from '@/components/ui/otp-input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Mail, Check, ArrowLeft, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  websiteUrl: z.string().url('Please enter a valid URL'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  category: z.string().min(1, 'Please select a category'),
  monthlyOrders: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ProgressStepProps {
  step: number;
  currentStep: number;
  label: string;
}

function ProgressStep({ step, currentStep, label }: ProgressStepProps) {
  const isCompleted = step < currentStep;
  const isCurrent = step === currentStep;
  
  return (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
        isCompleted 
          ? 'bg-white text-black' 
          : isCurrent 
            ? 'bg-white text-black'
            : 'bg-gray-600 text-gray-400'
      }`}>
        {isCompleted ? <Check className="w-4 h-4" /> : step}
      </div>
      <span className={`ml-2 text-sm font-medium ${
        isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  );
}

function ProgressIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: 'Details' },
    { number: 2, label: 'Email' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4 mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <ProgressStep
              step={step.number}
              currentStep={currentStep}
              label={step.label}
            />
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 rounded ml-4 ${
                step.number < currentStep ? 'bg-white' : 'bg-gray-600'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [sellerId, setSellerId] = useState<string>('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is already authenticated and redirect to success page
  const { data: sessionData } = useQuery({
    queryKey: ['/api/session'],
  });

  useEffect(() => {
    if ((sessionData as any)?.authenticated) {
      setLocation('/success');
    }
  }, [sessionData, setLocation]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: '',
      websiteUrl: '',
      email: '',
      phone: '',
      category: '',
      monthlyOrders: '',
    },
  });

  const createSellerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/sellers', data);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save your information');
      }
      
      return result;
    },
    onSuccess: (data) => {
      setSellerId(data.seller.id);
      setCurrentStep(2);
      // Start email verification
      startEmailVerification(data.seller.id);
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration Error',
        description: error.message || 'Failed to save your information. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const startEmailVerification = async (sellerIdParam?: string) => {
    const id = sellerIdParam || sellerId;
    if (!id) return;
    
    try {
      const response = await apiRequest('POST', `/api/sellers/${id}/send-verification`);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Email Sent',
          description: 'Please check your email for the verification code.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send verification email. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send verification email. Please try again.',
        variant: 'destructive',
      });
    }
  };



  const handleFormSubmit = async (data: FormData) => {
    setFormData(data);
    createSellerMutation.mutate(data);
  };

  const handleEmailVerification = async (otp: string) => {
    try {
      const response = await apiRequest('POST', `/api/sellers/${sellerId}/verify-email`, {
        otp: otp,
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Email Verified',
          description: 'Your email has been successfully verified.',
        });
        setLocation(`/success?sellerId=${sellerId}`);
      } else {
        toast({
          title: 'Invalid Code',
          description: data.error || 'Please check the verification code and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'Failed to verify email. Please try again.',
        variant: 'destructive',
      });
    }
  };



  if (currentStep === 1) {
    return (
      <div className="min-h-screen text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <ProgressIndicator currentStep={currentStep} />
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Activate <span className="text-white">10-Min Delivery</span>
            </h1>
            <p className="text-xl text-gray-300 mb-2">Join India's fastest delivery infrastructure</p>
            <p className="text-sm text-gray-400">No storefront needed • Keep your existing website • Instant integration</p>
          </div>

          <Card className="bg-gray-900 border border-gray-700">
            <CardContent className="p-8">
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="relative">
                  <Label htmlFor="brandName" className="text-gray-400">Brand Name *</Label>
                  <Input
                    id="brandName"
                    {...form.register('brandName')}
                    className="mt-2 bg-gray-800 border-gray-600 focus:border-white"
                    placeholder="Enter your brand name"
                  />
                  {form.formState.errors.brandName && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.brandName.message}</p>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="websiteUrl" className="text-gray-400">Website URL *</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    {...form.register('websiteUrl')}
                    className="mt-2 bg-gray-800 border-gray-600 focus:border-white"
                    placeholder="https://your-website.com"
                  />
                  {form.formState.errors.websiteUrl && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.websiteUrl.message}</p>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="email" className="text-gray-400">Business Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    className="mt-2 bg-gray-800 border-gray-600 focus:border-white"
                    placeholder="business@example.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="phone" className="text-gray-400">Phone Number *</Label>
                  <div className="flex mt-2">
                    <div className="bg-gray-800 border border-gray-600 rounded-l-lg px-3 py-2 flex items-center">
                      <span className="text-white">🇮🇳 +91</span>
                    </div>
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      className="rounded-l-none bg-gray-800 border-gray-600 focus:border-white"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  {form.formState.errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="category" className="text-gray-400">Business Category *</Label>
                  <Select onValueChange={(value) => form.setValue('category', value)}>
                    <SelectTrigger className="mt-2 bg-gray-800 border-gray-600 focus:border-white">
                      <SelectValue placeholder="Select Business Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="personal-care">Personal Care</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.category.message}</p>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="monthlyOrders" className="text-gray-400">Expected Monthly Orders (Optional)</Label>
                  <Select onValueChange={(value) => form.setValue('monthlyOrders', value)}>
                    <SelectTrigger className="mt-2 bg-gray-800 border-gray-600 focus:border-white">
                      <SelectValue placeholder="Expected Monthly Orders" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="0-100">0 - 100 orders</SelectItem>
                      <SelectItem value="100-500">100 - 500 orders</SelectItem>
                      <SelectItem value="500-1000">500 - 1,000 orders</SelectItem>
                      <SelectItem value="1000-5000">1,000 - 5,000 orders</SelectItem>
                      <SelectItem value="5000+">5,000+ orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={createSellerMutation.isPending}
                  className="w-full bg-white text-black font-semibold py-4 hover:bg-gray-200 transition-all duration-300"
                >
                  {createSellerMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <>
                      Continue to Email Verification
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-600">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-white font-bold text-2xl">10 min</div>
                    <div className="text-xs text-gray-400">Delivery Time</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-2xl">50+</div>
                    <div className="text-xs text-gray-400">Cities Covered</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-2xl">24/7</div>
                    <div className="text-xs text-gray-400">Support</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen text-white">
        <div className="max-w-md mx-auto px-4 py-12">
          <ProgressIndicator currentStep={currentStep} />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-black text-2xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
            <p className="text-gray-400 text-sm">We've sent a 6-digit code to {formData?.email}</p>
            <p className="text-white font-medium text-sm">Check your inbox and enter the code below</p>
          </div>

          <Card className="bg-gray-900 border border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium mb-3">Enter 6-digit code</Label>
                  <OTPInput onComplete={handleEmailVerification} />
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm mb-3">Didn't receive the code?</p>
                <Button
                  variant="ghost"
                  onClick={() => startEmailVerification()}
                  className="text-white hover:text-gray-300"
                >
                  Resend Code
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(1)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Button>
          </div>
        </div>
      </div>
    );
  }



  return null;
}
