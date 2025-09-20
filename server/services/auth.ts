import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { supabase } from '../config/supabase';
import { 
  users, 
  type User, 
  type RegisterData, 
  type LoginData,
  type ForgotPasswordData,
  type ResetPasswordData 
} from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

// Database connection
const connectionString = `postgresql://postgres.wlqqpvmlgecdhrmadipv:Openskills@123@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require`;
const client = postgres(connectionString);
const db = drizzle(client);

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

export class AuthService {
  // Generate JWT token
  private generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verify JWT token
  static verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return null;
    }
  }

  // Hash password
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Compare password
  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate verification token
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send verification email
  private async sendVerificationEmail(email: string, token: string, firstName: string): Promise<void> {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Verify Your Email - Artisan Marketplace',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Artisan Marketplace!</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for registering with us. Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>The Artisan Marketplace Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  // Send password reset email
  private async sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<void> {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Reset Your Password - Artisan Marketplace',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${firstName},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Artisan Marketplace Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  // Register new user
  async register(data: RegisterData): Promise<{ user: Omit<User, 'password'>; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
      if (existingUser.length > 0) {
        throw new Error('User with this email already exists');
      }

      const existingUsername = await db.select().from(users).where(eq(users.username, data.username)).limit(1);
      if (existingUsername.length > 0) {
        throw new Error('Username already taken');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(data.password);
      
      // Generate verification token
      const verificationToken = this.generateVerificationToken();

      // Create user
      const newUser = await db.insert(users).values({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: data.userType,
        artisanName: data.artisanName,
        businessName: data.businessName,
        location: data.location,
        phone: data.phone,
        emailVerificationToken: verificationToken,
        isEmailVerified: true, // Users are verified immediately upon registration
      }).returning();

      const user = newUser[0];

      // Email verification disabled - no verification email sent

      // Generate JWT token
      const token = this.generateToken(user.id);

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(data: LoginData): Promise<{ user: Omit<User, 'password'>; token: string }> {
    try {
      // Find user by email
      const userResult = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
      if (userResult.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = userResult[0];

      // Email verification removed - users can login immediately after registration

      // Compare password
      const isPasswordValid = await this.comparePassword(data.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = this.generateToken(user.id);

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const userResult = await db.select().from(users).where(
        and(
          eq(users.emailVerificationToken, token),
          eq(users.isEmailVerified, false)
        )
      ).limit(1);

      if (userResult.length === 0) {
        return { success: false, message: 'Invalid or expired verification token' };
      }

      const user = userResult[0];

      // Update user as verified
      await db.update(users)
        .set({ 
          isEmailVerified: true, 
          emailVerificationToken: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      return { success: false, message: 'Error verifying email' };
    }
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordData): Promise<{ success: boolean; message: string }> {
    try {
      const userResult = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
      if (userResult.length === 0) {
        return { success: true, message: 'If an account with this email exists, a password reset link has been sent' };
      }

      const user = userResult[0];
      
      // Generate reset token
      const resetToken = this.generateVerificationToken();
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Update user with reset token
      await db.update(users)
        .set({ 
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      // Send reset email
      await this.sendPasswordResetEmail(user.email, resetToken, user.firstName || 'User');

      return { success: true, message: 'If an account with this email exists, a password reset link has been sent' };
    } catch (error) {
      return { success: false, message: 'Error processing password reset request' };
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
    try {
      const userResult = await db.select().from(users).where(
        and(
          eq(users.passwordResetToken, data.token),
          eq(users.passwordResetExpires, new Date()) // Check if token is not expired
        )
      ).limit(1);

      if (userResult.length === 0) {
        return { success: false, message: 'Invalid or expired reset token' };
      }

      const user = userResult[0];

      // Check if token is expired
      if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
        return { success: false, message: 'Reset token has expired' };
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(data.password);

      // Update user password
      await db.update(users)
        .set({ 
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      return { success: false, message: 'Error resetting password' };
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    try {
      const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (userResult.length === 0) {
        return null;
      }

      const user = userResult[0];
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId: string, updateData: Partial<Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt'>>): Promise<Omit<User, 'password'> | null> {
    try {
      const updatedUser = await db.update(users)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();

      if (updatedUser.length === 0) {
        return null;
      }

      const user = updatedUser[0];
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  }

  // Manual email verification for development/testing
  async verifyEmailManually(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (userResult.length === 0) {
        return { success: false, message: 'User not found' };
      }

      const user = userResult[0];

      if (user.isEmailVerified) {
        return { success: true, message: 'Email is already verified' };
      }

      // Update user as verified
      await db.update(users)
        .set({ 
          isEmailVerified: true, 
          emailVerificationToken: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      return { success: false, message: 'Error verifying email' };
    }
  }
}
