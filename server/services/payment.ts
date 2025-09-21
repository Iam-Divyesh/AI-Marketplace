import Stripe from 'stripe';
import { Order, OrderItem, Product } from '../../shared/schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key', {
  apiVersion: '2024-12-18.acacia',
});

export class PaymentService {
  // Create payment intent for an order
  async createPaymentIntent(orderData: {
    amount: number;
    currency: string;
    orderId: string;
    customerEmail: string;
    metadata?: Record<string, string>;
  }): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(orderData.amount * 100), // Convert to cents
        currency: orderData.currency || 'inr',
        metadata: {
          orderId: orderData.orderId,
          customerEmail: orderData.customerEmail,
          ...orderData.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Confirm payment intent
  async confirmPaymentIntent(paymentIntentId: string): Promise<{
    status: string;
    paymentIntentId: string;
  }> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Stripe payment confirmation error:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  // Create customer
  async createCustomer(customerData: {
    email: string;
    name: string;
    phone?: string;
  }): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
      });

      return customer.id;
    } catch (error) {
      console.error('Stripe customer creation error:', error);
      throw new Error('Failed to create customer');
    }
  }

  // Create payment method
  async createPaymentMethod(paymentMethodData: {
    type: 'card';
    card: {
      number: string;
      exp_month: number;
      exp_year: number;
      cvc: string;
    };
    billing_details: {
      name: string;
      email: string;
      address?: {
        line1: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
      };
    };
  }): Promise<string> {
    try {
      const paymentMethod = await stripe.paymentMethods.create({
        type: paymentMethodData.type,
        card: paymentMethodData.card,
        billing_details: paymentMethodData.billing_details,
      });

      return paymentMethod.id;
    } catch (error) {
      console.error('Stripe payment method creation error:', error);
      throw new Error('Failed to create payment method');
    }
  }

  // Process refund
  async processRefund(paymentIntentId: string, amount?: number): Promise<{
    refundId: string;
    status: string;
  }> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
      });

      return {
        refundId: refund.id,
        status: refund.status,
      };
    } catch (error) {
      console.error('Stripe refund error:', error);
      throw new Error('Failed to process refund');
    }
  }

  // Get payment methods for customer
  async getCustomerPaymentMethods(customerId: string): Promise<any[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Stripe get payment methods error:', error);
      throw new Error('Failed to get payment methods');
    }
  }

  // Create setup intent for saving payment method
  async createSetupIntent(customerId: string): Promise<{ clientSecret: string }> {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });

      return {
        clientSecret: setupIntent.client_secret!,
      };
    } catch (error) {
      console.error('Stripe setup intent creation error:', error);
      throw new Error('Failed to create setup intent');
    }
  }

  // Calculate order total with taxes and shipping
  calculateOrderTotal(items: Array<{ product: Product; quantity: number }>, shippingAddress: any): {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
    
    // Calculate tax (simplified - in real app, use proper tax calculation service)
    const taxRate = 0.18; // 18% GST
    const tax = subtotal * taxRate;
    
    // Calculate shipping (simplified - in real app, use shipping calculation service)
    const shipping = subtotal > 5000 ? 0 : 200; // Free shipping over ₹5000
    
    const total = subtotal + tax + shipping;
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  // Validate payment data
  validatePaymentData(paymentData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Invalid amount');
    }
    
    if (!paymentData.currency) {
      errors.push('Currency is required');
    }
    
    if (!paymentData.customerEmail) {
      errors.push('Customer email is required');
    }
    
    if (!paymentData.orderId) {
      errors.push('Order ID is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}



