import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  orderTotal: number;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export function PaymentForm({ orderTotal, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const { toast } = useToast();

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return; // Max 16 digits + 3 spaces
    } else if (field === 'expiry') {
      // Format expiry date MM/YY
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
      if (formattedValue.length > 5) return;
    } else if (field === 'cvv') {
      // Only allow 3-4 digits
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const validateCardData = () => {
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
      return 'Please enter a valid card number';
    }
    if (!cardData.expiry || cardData.expiry.length < 5) {
      return 'Please enter a valid expiry date';
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      return 'Please enter a valid CVV';
    }
    if (!cardData.name.trim()) {
      return 'Please enter the cardholder name';
    }
    return null;
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      const validationError = validateCardData();
      if (validationError) {
        onPaymentError(validationError);
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, integrate with Stripe or other payment gateway
      const paymentData = {
        method: paymentMethod,
        amount: orderTotal,
        transactionId: `txn_${Date.now()}`,
        status: 'success',
        timestamp: new Date().toISOString(),
      };
      
      onPaymentSuccess(paymentData);
      
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
      });
    } catch (error) {
      onPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{(orderTotal * 0.85).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{(orderTotal * 0.15).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Selection */}
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className="h-20 flex-col"
            >
              <CreditCard className="w-6 h-6 mb-2" />
              Card
            </Button>
            <Button
              variant={paymentMethod === 'upi' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('upi')}
              className="h-20 flex-col"
            >
              <div className="w-6 h-6 mb-2 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">UPI</span>
              </div>
              UPI
            </Button>
            <Button
              variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('wallet')}
              className="h-20 flex-col"
            >
              <div className="w-6 h-6 mb-2 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">₹</span>
              </div>
              Wallet
            </Button>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => handleCardInputChange('number', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => handleCardInputChange('name', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* UPI Payment */}
          {paymentMethod === 'upi' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">UPI</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                You will be redirected to your UPI app to complete the payment
              </p>
              <Button variant="outline" className="w-full">
                Pay with UPI
              </Button>
            </div>
          )}

          {/* Wallet Payment */}
          {paymentMethod === 'wallet' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">₹</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Pay using your digital wallet
              </p>
              <Button variant="outline" className="w-full">
                Pay with Wallet
              </Button>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div className="text-sm">
              <p className="font-medium text-green-800">Secure Payment</p>
              <p className="text-green-600">Your payment information is encrypted and secure</p>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-12 text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Pay ₹{orderTotal.toFixed(2)}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


