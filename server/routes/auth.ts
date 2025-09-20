import { Router } from 'express';
import { AuthService } from '../services/auth';
import { authenticateToken } from '../middleware/auth';
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  type RegisterData,
  type LoginData,
  type ForgotPasswordData,
  type ResetPasswordData
} from '../../shared/schema';
import { ZodError } from 'zod';

const router = Router();
const authService = new AuthService();

// Register
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body) as RegisterData;
    const result = await authService.register(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully. You can now login.',
      data: result
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body) as LoginData;
    const result = await authService.login(validatedData);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Login failed'
    });
  }
});

// Verify Email
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }
    
    const result = await authService.verifyEmail(token);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying email'
    });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body) as ForgotPasswordData;
    const result = await authService.forgotPassword(validatedData);
    
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password request'
    });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body) as ResetPasswordData;
    const result = await authService.resetPassword(validatedData);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
});

// Get Current User
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
});

// Update Profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updateData = req.body;
    const userId = req.user!.id;
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.id;
    delete updateData.password;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.emailVerificationToken;
    delete updateData.passwordResetToken;
    delete updateData.passwordResetExpires;
    
    const updatedUser = await authService.updateProfile(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Manual email verification for development/testing
router.post('/verify-email-manual', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const result = await authService.verifyEmailManually(email);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying email'
    });
  }
});

export default router;
