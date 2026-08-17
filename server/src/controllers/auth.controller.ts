import { Request, Response } from 'express';
import { store } from '../services/complaint.service';
import {
  hashPassword,
  comparePassword
} from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {

  // =========================================================
  // REGISTER
  // =========================================================

  static async register(
    req: Request,
    res: Response
  ) {
    try {

      console.log(
        '[Auth] Registration request received'
      );

      const {
        email,
        password,
        fullName,
        phone,
        role,
        departmentId
      } = req.body;

      // -----------------------------------------------------
      // VALIDATION
      // -----------------------------------------------------

      if (
        !email ||
        !password ||
        !fullName
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Email, password, and full name are required'
        });
      }

      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      const normalizedFullName =
        String(fullName)
          .trim();

      // -----------------------------------------------------
      // CHECK EXISTING USER
      // -----------------------------------------------------

      const existing =
        store.users.find(
          (user) =>
            user.email.toLowerCase() ===
            normalizedEmail
        );

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            'User with this email already exists'
        });
      }

      // -----------------------------------------------------
      // ROLE
      // -----------------------------------------------------

      const userRole =
        role === 'OFFICER' ||
        role === 'ADMIN'
          ? role
          : 'CITIZEN';

      // -----------------------------------------------------
      // PASSWORD HASH
      // -----------------------------------------------------

      console.log(
        '[Auth] Hashing password...'
      );

      const passwordHash =
        await hashPassword(
          String(password)
        );

      console.log(
        '[Auth] Password hashed successfully'
      );

      // -----------------------------------------------------
      // CREATE USER
      // -----------------------------------------------------

      const newUser = {
        id:
          `usr-${Date.now()}`,

        email:
          normalizedEmail,

        password_hash:
          passwordHash,

        full_name:
          normalizedFullName,

        phone:
          phone
            ? String(phone).trim()
            : '',

        role:
          userRole,

        department_id:
          departmentId ||
          null,

        created_at:
          new Date().toISOString()
      };

      store.users.push(
        newUser
      );

      console.log(
        '[Auth] User created:',
        {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          departmentId:
            newUser.department_id
        }
      );

      // -----------------------------------------------------
      // JWT
      // -----------------------------------------------------

      console.log(
        '[Auth] Generating JWT...'
      );

      const token =
        generateToken({
          userId:
            newUser.id,

          email:
            newUser.email,

          role:
            newUser.role,

          fullName:
            newUser.full_name,

          departmentId:
            newUser.department_id
        });

      console.log(
        '[Auth] JWT generated successfully'
      );

      // -----------------------------------------------------
      // RESPONSE
      // -----------------------------------------------------

      return res.status(201).json({
        success: true,

        token,

        user: {
          id:
            newUser.id,

          email:
            newUser.email,

          fullName:
            newUser.full_name,

          role:
            newUser.role,

          departmentId:
            newUser.department_id
        }
      });

    } catch (err: any) {

      // THIS IS IMPORTANT FOR DEBUGGING
      console.error(
        '[Auth] Registration failed:',
        err
      );

      console.error(
        '[Auth] Registration error message:',
        err?.message
      );

      console.error(
        '[Auth] Registration error stack:',
        err?.stack
      );

      return res.status(500).json({
        success: false,
        message:
          err?.message ||
          'Failed to create account'
      });
    }
  }

  // =========================================================
  // LOGIN
  // =========================================================

  static async login(
    req: Request,
    res: Response
  ) {
    try {

      const {
        email,
        password
      } = req.body;

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Email and password are required'
        });
      }

      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      const user =
        store.users.find(
          (candidate) =>
            candidate.email.toLowerCase() ===
            normalizedEmail
        );

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            'Invalid credentials'
        });
      }

      const isMatch =
        await comparePassword(
          String(password),
          user.password_hash
        );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message:
            'Invalid credentials'
        });
      }

      const token =
        generateToken({
          userId:
            user.id,

          email:
            user.email,

          role:
            user.role,

          fullName:
            user.full_name,

          departmentId:
            user.department_id
        });

      return res.json({
        success: true,

        token,

        user: {
          id:
            user.id,

          email:
            user.email,

          fullName:
            user.full_name,

          role:
            user.role,

          departmentId:
            user.department_id
        }
      });

    } catch (err: any) {

      console.error(
        '[Auth] Login failed:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err?.message ||
          'Login failed'
      });
    }
  }

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  static async getMe(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message:
            'Not authenticated'
        });
      }

      const user =
        store.users.find(
          (candidate) =>
            candidate.id ===
            req.user?.userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            'User not found'
        });
      }

      return res.json({
        success: true,

        user: {
          id:
            user.id,

          email:
            user.email,

          fullName:
            user.full_name,

          role:
            user.role,

          phone:
            user.phone,

          departmentId:
            user.department_id
        }
      });

    } catch (err: any) {

      console.error(
        '[Auth] getMe failed:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err?.message ||
          'Failed to fetch current user'
      });
    }
  }
}