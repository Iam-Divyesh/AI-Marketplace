# ArtisanAI - AI-Powered Artisan Marketplace

ArtisanAI is a modern marketplace platform that connects local artisans with art lovers worldwide. Built with React, Express.js, and powered by AI-driven product recommendations using OpenAI's GPT-5 model.

## 🚀 Features

- **Dark-themed UI** with neon accents (purple + teal)
- **3D Animations** using Three.js and React-Three-Fiber
- **AI-powered product recommendations** via OpenAI GPT-5
- **Smart product search and filtering** by category, price, and location
- **Responsive design** optimized for all devices
- **Real-time chat assistant** for personalized shopping help
- **Artisan dashboard** for product management
- **Modern glassmorphism UI** with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Three.js & React-Three-Fiber** for 3D graphics
- **TanStack Query** for data fetching
- **Wouter** for routing
- **Shadcn/ui** component library

### Backend  
- **Node.js & Express.js**
- **OpenAI GPT-5** for AI recommendations
- **In-memory storage** with sample data
- **TypeScript** for type safety

### Development
- **Vite** for fast development
- **ESBuild** for production builds
- **Hot Module Replacement** in development

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd artisanai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```bash
   PORT=5000
   NODE_ENV=development
   OPENAI_API_KEY=your_openai_api_key_here
   SESSION_SECRET=your_secure_session_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5000`

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set build command: `npm run build`  
3. Set output directory: `dist/public`
4. Deploy automatically on push to main branch

### Backend (Render/Heroku)
1. Create a new service on Render or Heroku
2. Connect your repository
3. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=5000` (or as provided by platform)
   - `OPENAI_API_KEY=your_key`
   - `SESSION_SECRET=your_secret`
4. Deploy with build command: `npm run build && npm start`

### Database (MongoDB Atlas)
For production, replace the in-memory storage:
1. Create MongoDB Atlas cluster
2. Update `MONGO_URI` in environment variables
3. Modify `server/storage.ts` to use MongoDB connection

## 🎯 API Endpoints

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product  
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### AI Services
- `POST /api/ai/recommendations` - Get AI product recommendations
- `POST /api/ai/chat` - Chat with AI assistant

### Health Check
- `GET /api/health` - Service health status

## 🎨 Design System

### Colors
- **Background**: `hsl(240, 10%, 4%)` - Deep dark
- **Primary**: `hsl(262, 83%, 58%)` - Electric purple  
- **Accent**: `hsl(177, 70%, 41%)` - Vibrant teal
- **Secondary**: `hsl(150, 61%, 40%)` - Fresh green

### Typography
- **Headings**: Orbitron (futuristic mono font)
- **Body**: Inter (clean sans-serif)

### Effects
- **Glassmorphism**: Backdrop blur with semi-transparent backgrounds
- **Neon borders**: Gradient borders with glow effects
- **3D transforms**: Hover animations with perspective

## 🤖 AI Features

### Smart Recommendations
The AI assistant analyzes user queries and provides personalized product recommendations based on:
- Price preferences
- Category interests  
- Style preferences
- Location proximity

### Natural Language Processing
Users can ask questions like:
- "Show me handmade jewelry under ₹500"
- "Find pottery from Indian artisans"
- "What woodwork pieces do you have?"

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-optimized** interactions
- **Progressive enhancement** for advanced features

## 🔒 Security Features

- **Environment variable protection** for API keys
- **Input validation** with Zod schemas
- **Error boundary handling**
- **CORS configuration** for cross-origin requests

## 🧪 Testing

The application includes comprehensive test IDs for E2E testing:
- `data-testid` attributes on all interactive elements
- Consistent naming convention: `{action}-{target}` or `{type}-{content}`
- Dynamic identifiers for generated content: `{type}-{description}-{id}`

## 📈 Performance Optimizations

- **Code splitting** with dynamic imports
- **Image optimization** with lazy loading  
- **Query caching** with TanStack Query
- **Debounced search** to reduce API calls
- **Efficient re-rendering** with React patterns

## 🎭 Animation System

### Page Transitions
- Smooth fade-in animations for page loads
- Staggered animations for content sections

### Component Animations  
- **Product cards**: 3D hover effects with rotation
- **Hero section**: Floating elements with parallax
- **Chat widget**: Slide-in/out transitions
- **Form interactions**: Micro-animations for feedback

## 🌟 Sample Data

The application comes pre-loaded with sample products from various categories:
- **Pottery**: Ceramic vases, bowls, decorative items
- **Jewelry**: Handcrafted necklaces, earrings, rings  
- **Textiles**: Scarves, wall hangings, woven goods
- **Woodwork**: Sculptures, furniture, decorative pieces
- **Glass Art**: Artistic spheres, functional pieces
- **Leather**: Wallets, bags, accessories

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-5 AI capabilities
- **Three.js community** for 3D graphics inspiration  
- **Shadcn** for the beautiful component library
- **Tailwind CSS** for the utility-first styling approach
- **React community** for ecosystem and best practices

---

**Made with ❤️ for artisans worldwide**

For support or questions, please open an issue on GitHub.
