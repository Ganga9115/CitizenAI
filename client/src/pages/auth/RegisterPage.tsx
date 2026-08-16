import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  Eye,
  EyeOff,
  Check,
  CreditCard,
  LogIn,
  Building2
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { apiClient } from '../../services/api';
import { UserRole } from '../../types';

// =========================================================
// DEPARTMENTS
// IMPORTANT:
// The value sent to backend is department ID.
// The visible text is department name.
// =========================================================

const DEPARTMENTS = [
  {
    id: 'dept-water',
    name: 'Water Board'
  },
  {
    id: 'dept-elec',
    name: 'Electricity Board'
  },
  {
    id: 'dept-pwd',
    name: 'Public Works'
  },
  {
    id: 'dept-muni',
    name: 'Municipality'
  },
  {
    id: 'dept-drainage',
    name: 'Drainage Department'
  },
  {
    id: 'dept-police',
    name: 'Police'
  },
  {
    id: 'dept-fire',
    name: 'Fire Department'
  },
  {
    id: 'dept-health',
    name: 'Health Department'
  },
  {
    id: 'dept-trans',
    name: 'Transport Department'
  }
];

export const RegisterPage: React.FC = () => {

  const [fullName, setFullName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [password, setPassword] =
    useState('');

  // This stores the department ID.
  // Example:
  // dept-water
  // dept-elec
  const [department, setDepartment] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [role, setRole] =
    useState<UserRole>('CITIZEN');

  const [loading, setLoading] =
    useState(false);

  const { login } =
    useAuth();

  const { showToast } =
    useNotification();

  const navigate =
    useNavigate();

  // =======================================================
  // REGISTER
  // =======================================================

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      // -----------------------------------------------------
      // OFFICER DEPARTMENT VALIDATION
      // -----------------------------------------------------

      if (
        role === 'OFFICER' &&
        !department
      ) {

        showToast(
          'Validation Error',
          'Please select your department',
          'error'
        );

        return;
      }

      setLoading(true);

      try {

        // ---------------------------------------------------
        // REQUEST BODY
        // ---------------------------------------------------

        const requestBody = {
          fullName:
            fullName.trim(),

          email:
            email.trim(),

          phone:
            phone.trim(),

          password,

          role,

          departmentId:
            role === 'OFFICER'
              ? department
              : undefined
        };

        console.log(
          '[Register] Creating account:',
          {
            email:
              requestBody.email,

            role:
              requestBody.role,

            departmentId:
              requestBody.departmentId
          }
        );

        // ---------------------------------------------------
        // API
        // ---------------------------------------------------

        const res =
          await apiClient.post(
            '/auth/register',
            requestBody
          );

        if (
          res.data.success
        ) {

          console.log(
            '[Register] Registration successful:',
            res.data.user
          );

          // Store authenticated user/token
          login(
            res.data.token,
            res.data.user
          );

          showToast(
            'Registration Successful',
            `Account created as ${role}!`,
            'success'
          );

          // -------------------------------------------------
          // REDIRECT
          // -------------------------------------------------

          if (
            role === 'CITIZEN'
          ) {

            navigate(
              '/citizen/dashboard'
            );

          } else if (
            role === 'OFFICER'
          ) {

            navigate(
              '/officer/dashboard'
            );

          } else if (
            role === 'ADMIN'
          ) {

            navigate(
              '/admin/dashboard'
            );
          }
        }

      } catch (err: any) {

        console.error(
          '[Register] Registration failed:',
          err
        );

        showToast(
          'Registration Error',
          err.response?.data?.message ||
            'Failed to create account',
          'error'
        );

      } finally {

        setLoading(false);
      }
    };

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-[#1F2937]">

      {/* ===================================================
          LEFT SIDE
          =================================================== */}

      <div className="lg:col-span-5 bg-[#5E4075] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">

        <div>

          <Link
            to="/"
            className="inline-flex items-center gap-2.5"
          >

            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm">

              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />

            </div>

            <span className="font-extrabold text-xl tracking-tight text-white">
              CivicAI
            </span>

          </Link>

          <div className="mt-24 sm:mt-32 max-w-lg">

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">

              Modern Intelligence for Civil Infrastructure

            </h1>

            <p className="mt-6 text-[#E1D2FF] text-sm sm:text-base leading-relaxed">

              Connecting federal and municipal administration teams directly to real-time public logs via premium Natural Language Processing models. Secure, verified, and audited.

            </p>

          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10">

          <p className="text-[10px] uppercase font-bold tracking-wider text-[#E1D2FF]/80 mb-3">

            Certified Government Standard

          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/90">

            <span className="flex items-center gap-1">

              <Check className="w-3.5 h-3.5 text-[#E1D2FF]" />

              SOC2 Compliant

            </span>

            <span className="flex items-center gap-1">

              <Check className="w-3.5 h-3.5 text-[#E1D2FF]" />

              HIPAA Aligned

            </span>

            <span className="flex items-center gap-1">

              <Check className="w-3.5 h-3.5 text-[#E1D2FF]" />

              FedRAMP High Ready

            </span>

          </div>

        </div>

      </div>

      {/* ===================================================
          RIGHT SIDE
          =================================================== */}

      <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-12 bg-white">

        <div className="max-w-md w-full">

          {/* Tabs */}

          <div className="flex justify-center mb-8">

            <div className="bg-[#F3F4F6] p-1 rounded-xl flex items-center w-full max-w-xs text-xs font-semibold">

              <Link
                to="/login"
                className="flex-1 py-2 rounded-lg text-[#6B7280] hover:text-[#1F2937] transition-all text-center"
              >
                Login
              </Link>

              <button
                type="button"
                className="flex-1 py-2 rounded-lg bg-white text-[#1F2937] shadow-sm transition-all text-center"
              >
                Register
              </button>

            </div>

          </div>

          {/* Header */}

          <div className="mb-6 text-center sm:text-left">

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">

              Create New Account

            </h2>

            <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5">

              Request credentials for the CivicAI administration platform.

            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Full Name */}

            <div>

              <label className="block text-xs font-bold text-[#1F2937] mb-1.5">

                Full Name

              </label>

              <input
                type="text"
                required
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
                placeholder="Jane Doe"
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#5E4075] focus:ring-1 focus:ring-[#5E4075] transition-all"
              />

            </div>

            {/* Email */}

            <div>

              <label className="block text-xs font-bold text-[#1F2937] mb-1.5">

                Government Email

              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="jane.doe@municipal.gov"
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#5E4075] focus:ring-1 focus:ring-[#5E4075] transition-all"
              />

            </div>

            {/* Phone */}

            <div>

              <label className="block text-xs font-bold text-[#1F2937] mb-1.5">

                Phone Number (Optional)

              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#5E4075] focus:ring-1 focus:ring-[#5E4075] transition-all"
              />

            </div>

            {/* Role */}

            <div>

              <label className="block text-xs font-bold text-[#1F2937] mb-1.5">

                Account Role

              </label>

              <div className="grid grid-cols-3 gap-2">

                {(
                  [
                    'CITIZEN',
                    'OFFICER',
                    'ADMIN'
                  ] as UserRole[]
                ).map(
                  (r) => (

                    <button
                      key={r}
                      type="button"
                      onClick={() => {

                        setRole(r);

                        if (
                          r !== 'OFFICER'
                        ) {

                          setDepartment('');
                        }

                      }}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all border ${
                        role === r
                          ? 'bg-[#5E4075] text-white border-[#5E4075] shadow-sm'
                          : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:text-[#1F2937]'
                      }`}
                    >

                      {r}

                    </button>

                  )
                )}

              </div>

            </div>

            {/* =================================================
                OFFICER DEPARTMENT
                ================================================= */}

            {role === 'OFFICER' && (

              <div className="animate-fadeIn">

                <label className="block text-xs font-bold text-[#1F2937] mb-1.5 flex items-center gap-1">

                  <Building2 className="w-3.5 h-3.5 text-[#5E4075]" />

                  Select Assigned Department

                </label>

                <select
                  required
                  value={department}
                  onChange={(e) =>
                    setDepartment(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#5E4075] focus:ring-1 focus:ring-[#5E4075] transition-all cursor-pointer"
                >

                  <option
                    value=""
                    disabled
                  >
                    -- Choose Department --
                  </option>

                  {DEPARTMENTS.map(
                    (dept) => (

                      <option
                        key={dept.id}
                        value={dept.id}
                      >
                        {dept.name}
                      </option>

                    )
                  )}

                </select>

              </div>

            )}

            {/* Password */}

            <div>

              <label className="block text-xs font-bold text-[#1F2937] mb-1.5">

                Password

              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="••••••••••••••••"
                  className="w-full pl-4 pr-11 py-3 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#5E4075] focus:ring-1 focus:ring-[#5E4075] transition-all"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3.5 top-3.5 text-[#6B7280] hover:text-[#1F2937] transition-colors"
                >

                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}

                </button>

              </div>

            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-[#5E4075] hover:bg-[#4a325d] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-6"
            >

              {loading ? (

                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

              ) : (

                'Create Account'

              )}

            </button>

          </form>

          {/* Separator */}

          <div className="relative my-6 text-center">

            <div className="absolute inset-0 flex items-center">

              <div className="w-full border-t border-[#E5E7EB]" />

            </div>

            <span className="relative bg-white px-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">

              Or Sign Up With

            </span>

          </div>

          {/* SSO */}

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              className="py-2.5 px-3 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#1F2937] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >

              <CreditCard className="w-4 h-4 text-[#5E4075]" />

              CAC/PIV Smartcard

            </button>

            <button
              type="button"
              className="py-2.5 px-3 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#1F2937] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >

              <LogIn className="w-4 h-4 text-[#5E4075]" />

              SAML Single Sign-On

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};