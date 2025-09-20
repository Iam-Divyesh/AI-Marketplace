# AI-Powered Artisan Marketplace

A comprehensive MERN stack web application that connects artisans with customers through an intelligent, AI-powered marketplace platform. Built with modern technologies and featuring advanced capabilities like 3D product viewing, AI market analysis, and multilingual support.

## 🚀 Features

### 🔐 Authentication & User Management
- **Complete Auth System**: Register, login, forgot password, email verification
- **Dual User Types**: Separate dashboards for artisans and customers
- **Secure Authentication**: JWT-based authentication with Supabase integration
- **Profile Management**: Comprehensive user profiles with address and payment information

### 🏠 Professional Homepage
- **Modern Design**: Clean, responsive design with smooth animations
- **Feature Showcase**: Highlighting AI capabilities and platform benefits
- **Statistics Display**: Real-time platform metrics and achievements
- **Call-to-Action**: Clear navigation to key platform features

### 🤖 AI Integration
- **Gemini AI Integration**: Market analysis and data validation
- **Google Studio Integration**: Advanced analytics and insights
- **AI-Powered Search**: Intelligent product recommendations
- **Smart Chatbot**: LLM-powered customer and artisan support
- **Market Analysis**: Real-time pricing and competitive insights

### 🎨 3D Product Viewing
- **AR/3D Models**: Support for .glb and .gltf files
- **Interactive Viewer**: Rotate, zoom, and explore products in 3D
- **Mobile AR Support**: WebXR integration for augmented reality
- **Fallback Images**: Graceful degradation for unsupported devices

### 🛍️ Artisan Dashboard
- **Product Management**: Add, edit, delete products with 3D model support
- **Order Management**: Track orders, update status, communicate with customers
- **Analytics Dashboard**: Sales trends, revenue tracking, performance metrics
- **Market Analysis**: AI-powered insights and recommendations
- **Inventory Management**: Stock tracking and product status updates

### 🛒 Customer Dashboard
- **Product Discovery**: Advanced search and filtering capabilities
- **Shopping Cart**: Add to cart, wishlist, and purchase management
- **Order History**: Track orders and view past purchases
- **Profile Management**: Update personal information and payment methods
- **3D Product Viewing**: Interactive product exploration

### 💳 Payment Integration
- **Stripe Integration**: Secure payment processing
- **Multiple Payment Methods**: Card, UPI, and digital wallet support
- **Order Processing**: Complete checkout flow with tax calculation
- **Refund Management**: Automated refund processing
- **Payment Security**: PCI-compliant payment handling

### 🌍 Multilingual Support
- **Google Translate Integration**: Real-time page translation
- **12+ Languages**: Support for major global languages
- **RTL Support**: Right-to-left language support
- **Localized Content**: Translated UI elements and content

### 📱 Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Touch-Friendly**: Intuitive mobile interactions
- **Progressive Web App**: Offline capabilities and app-like experience
- **Cross-Browser**: Compatible with all modern browsers

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Three Fiber**: 3D graphics and AR support
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **TanStack Query**: Data fetching and caching

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **TypeScript**: Type-safe server development
- **Drizzle ORM**: Type-safe database queries
- **PostgreSQL**: Primary database (via Supabase)
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Nodemailer**: Email services

### AI & Analytics
- **Google Gemini AI**: Market analysis and insights
- **Google Studio**: Advanced analytics
- **OpenAI**: Chatbot and content generation
- **Stripe**: Payment processing

### Database Schema
- **Users**: Authentication and profile data
- **Products**: Product information with 3D models
- **Orders**: Order management and tracking
- **Analytics**: Performance metrics and insights
- **Market Analysis**: AI-generated market data
- **Chat Sessions**: Conversation history

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Supabase account)
- Stripe account for payments
- Google AI API key for Gemini integration

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MERNRecipeBook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/artisan_marketplace
   
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # JWT
   JWT_SECRET=your_jwt_secret
   
   # Email
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   
   # AI Services
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   
   # Client URL
   CLIENT_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   Open [http://localhost:5000](http://localhost:5000) in your browser

## 📁 Project Structure

```
MERNRecipeBook/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── artisan/    # Artisan-specific components
│   │   │   ├── payment/    # Payment-related components
│   │   │   ├── multilingual/ # Language support components
│   │   │   └── ui/         # Base UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── locales/        # Translation files
├── server/                 # Backend Express application
│   ├── config/            # Configuration files
│   ├── services/          # Business logic services
│   ├── middleware/        # Express middleware
│   └── routes/            # API routes
├── shared/                # Shared types and schemas
└── public/                # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (artisan only)
- `PUT /api/products/:id` - Update product (artisan only)
- `DELETE /api/products/:id` - Delete product (artisan only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/:id` - Get order details

### AI Services
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/recommendations` - Get product recommendations
- `POST /api/ai/market-analysis` - Get market analysis

### Payment
- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment
- `POST /api/payment/refund` - Process refund

## 🎨 Key Features in Detail

### 3D Product Viewer
The application supports interactive 3D product viewing using React Three Fiber:
- Support for .glb and .gltf file formats
- Interactive controls (rotate, zoom, pan)
- AR support for mobile devices
- Fallback to 2D images for unsupported devices

### AI Market Analysis
Powered by Google Gemini AI:
- Real-time market trend analysis
- Competitive pricing insights
- Product recommendation engine
- Automated content generation

### Multilingual Support
Comprehensive language support:
- 12+ supported languages
- Real-time translation using Google Translate
- RTL language support
- Localized content and UI elements

### Payment Processing
Secure payment integration:
- Stripe payment processing
- Multiple payment methods
- Automated tax calculation
- Refund management

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all production environment variables are set:
- Database connection strings
- API keys for external services
- JWT secrets
- Email configuration

### Database Migration
```bash
npm run db:push
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for market analysis capabilities
- **Stripe** for payment processing
- **Supabase** for database and authentication
- **React Three Fiber** for 3D graphics support
- **Tailwind CSS** for styling framework

## 📞 Support

For support, email support@artisanmarketplace.com or join our Slack channel.

---

Built with ❤️ by the Artisan Marketplace Team