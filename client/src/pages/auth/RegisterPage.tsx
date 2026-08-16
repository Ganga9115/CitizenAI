import React, {
  useState
} from 'react';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import {
  BrainCircuit,
  Eye,
  EyeOff,
  Check,
  CreditCard,
  LogIn,
  Building2
} from 'lucide-react';

import {
  useAuth
} from '../../contexts/AuthContext';

import {
  useNotification
} from '../../contexts/NotificationContext';

import {
  apiClient
} from '../../services/api';

import {
  UserRole
} from '../../types';

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

export const RegisterPage: React.FC =
  () => {

    const [
      fullName,
      setFullName
    ] = useState('');

    const [
      email,
      setEmail
    ] = useState('');

    const [
      phone,
      setPhone
    ] = useState('');

    const [
      password,
      setPassword
    ] = useState('');

    const [
      department,
      setDepartment
    ] = useState('');

    const [
      showPassword,
      setShowPassword
    ] = useState(false);

    const [
      role,
      setRole
    ] =
      useState<UserRole>(
        'CITIZEN'
      );

    const [
      loading,
      setLoading
    ] = useState(false);

    const {
      login
    } = useAuth();

    const {
      showToast
    } = useNotification();

    const navigate =
      useNavigate();

    // =====================================================
    // REGISTER
    // =====================================================

    const handleSubmit =
      async (
        e: React.FormEvent
      ) => {

        e.preventDefault();

        if (
          !fullName.trim() ||
          !email.trim() ||
          !password
        ) {

          showToast(
            'Validation Error',
            'Please fill all required fields.',
            'error'
          );

          return;
        }

        if (
          role === 'OFFICER' &&
          !department
        ) {

          showToast(
            'Validation Error',
            'Please select your department.',
            'error'
          );

          return;
        }

        setLoading(true);

        try {

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
                : null
          };

          console.log(
            '[Register] Request:',
            requestBody
          );

          const res =
            await apiClient.post(
              '/auth/register',
              requestBody
            );

          if (
            !res.data?.success ||
            !res.data?.token ||
            !res.data?.user
          ) {

            throw new Error(
              res.data?.message ||
              'Registration failed.'
            );
          }

          const registeredUser =
            res.data.user;

          console.log(
            '[Register] Created user:',
            registeredUser
          );

          // IMPORTANT:
          // Immediately make newly registered
          // user the current authenticated user.
          login(
            res.data.token,
            registeredUser
          );

          showToast(
            'Registration Successful',
            `Welcome ${registeredUser.fullName}!`,
            'success'
          );

          if (
            registeredUser.role ===
            'CITIZEN'
          ) {

            navigate(
              '/citizen/dashboard'
            );

          } else if (
            registeredUser.role ===
            'OFFICER'
          ) {

            navigate(
              '/officer/dashboard'
            );

          } else {

            navigate(
              '/admin/dashboard'
            );
          }

        } catch (
          err: any
        ) {

          console.error(
            '[Register] Registration failed:',
            err
          );

          showToast(
            'Registration Error',
            err.response?.data?.message ||
              err.message ||
              'Failed to create account',
            'error'
          );

        } finally {

          setLoading(false);
        }
      };

    // =====================================================
    // UI
    // =====================================================

    return (

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-[#1F2937]">

        <div className="lg:col-span-5 bg-[#5E4075] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between">

          <div>

            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >

              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">

                <BrainCircuit className="w-5 h-5" />

              </div>

              <span className="font-extrabold text-xl">
                CivicAI
              </span>

            </Link>

            <div className="mt-24 max-w-lg">

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">

                Modern Intelligence for Civil Infrastructure

              </h1>

              <p className="mt-6 text-[#E1D2FF] text-sm leading-relaxed">

                Connecting citizens and government departments through AI-powered complaint intelligence.

              </p>

            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-white/10">

            <p className="text-[10px] uppercase font-bold text-[#E1D2FF]/80 mb-3">

              CivicAI Platform

            </p>

            <div className="flex flex-wrap gap-4 text-xs">

              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Secure
              </span>

              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Verified
              </span>

              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Audited
              </span>

            </div>

          </div>

        </div>

        <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">

          <div className="max-w-md w-full">

            <div className="flex justify-center mb-8">

              <div className="bg-[#F3F4F6] p-1 rounded-xl flex w-full max-w-xs text-xs font-semibold">

                <Link
                  to="/login"
                  className="flex-1 py-2 rounded-lg text-[#6B7280] text-center"
                >
                  Login
                </Link>

                <button
                  type="button"
                  className="flex-1 py-2 rounded-lg bg-white shadow-sm"
                >
                  Register
                </button>

              </div>

            </div>

            <div className="mb-6">

              <h2 className="text-2xl sm:text-3xl font-extrabold">

                Create New Account

              </h2>

              <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5">

                Create your CivicAI account.

              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>

                <label className="block text-xs font-bold mb-1.5">
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
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] text-sm"
                />

              </div>

              <div>

                <label className="block text-xs font-bold mb-1.5">
                  Email
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
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] text-sm"
                />

              </div>

              <div>

                <label className="block text-xs font-bold mb-1.5">
                  Phone
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] text-sm"
                />

              </div>

              <div>

                <label className="block text-xs font-bold mb-1.5">
                  Account Role
                </label>

                <div className="grid grid-cols-3 gap-2">

                  {[
                    'CITIZEN',
                    'OFFICER',
                    'ADMIN'
                  ].map(
                    (
                      roleOption
                    ) => (

                      <button
                        key={
                          roleOption
                        }
                        type="button"
                        onClick={() => {

                          setRole(
                            roleOption as UserRole
                          );

                          if (
                            roleOption !==
                            'OFFICER'
                          ) {

                            setDepartment(
                              ''
                            );
                          }

                        }}
                        className={`py-2 rounded-lg text-xs font-semibold border ${
                          role ===
                          roleOption
                            ? 'bg-[#5E4075] text-white border-[#5E4075]'
                            : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                        }`}
                      >

                        {roleOption}

                      </button>
                    )
                  )}

                </div>

              </div>

              {role === 'OFFICER' && (

                <div>

                  <label className="block text-xs font-bold mb-1.5 flex items-center gap-1">

                    <Building2 className="w-3.5 h-3.5 text-[#5E4075]" />

                    Select Department

                  </label>

                  <select
                    required
                    value={
                      department
                    }
                    onChange={(e) =>
                      setDepartment(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] text-sm"
                  >

                    <option
                      value=""
                      disabled
                    >
                      -- Choose Department --
                    </option>

                    {DEPARTMENTS.map(
                      (
                        dept
                      ) => (

                        <option
                          key={
                            dept.id
                          }
                          value={
                            dept.id
                          }
                        >
                          {dept.name}
                        </option>

                      )
                    )}

                  </select>

                </div>

              )}

              <div>

                <label className="block text-xs font-bold mb-1.5">
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
                    value={
                      password
                    }
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    className="w-full pl-4 pr-11 py-3 rounded-lg border border-[#E5E7EB] text-sm"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3.5 top-3.5"
                  >

                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}

                  </button>

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-[#5E4075] hover:bg-[#4a325d] text-white font-semibold"
              >

                {loading
                  ? 'Creating Account...'
                  : 'Create Account'}

              </button>

            </form>

            <div className="grid grid-cols-2 gap-3 mt-6">

              <button
                type="button"
                className="py-2.5 px-3 rounded-lg border text-xs flex items-center justify-center gap-2"
              >

                <CreditCard className="w-4 h-4 text-[#5E4075]" />

                CAC/PIV Smartcard

              </button>

              <button
                type="button"
                className="py-2.5 px-3 rounded-lg border text-xs flex items-center justify-center gap-2"
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