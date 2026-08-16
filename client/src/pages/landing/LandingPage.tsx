import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Mic, Layers, ShieldAlert, Gauge, GitFork, LineChart } from 'lucide-react';
import { Header } from '../../components/common/Header';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-[#1F2937] font-sans selection:bg-[#E1D2FF]">
      <Header />

      <main className="flex-1 w-full">
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#E1D2FF]/40 via-[#F3F4F6] to-[#F3F4F6] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#5E4075] border border-[#E5E7EB] shadow-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#5E4075]" />
              Next-Gen Government Tech
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1F2937] leading-tight max-w-3xl"
            >
              AI-Powered Citizen Call Intelligence
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-[#6B7280] text-base sm:text-lg max-w-2xl leading-relaxed"
            >
              Transform voice recordings and citizen complaints into real-time structured data. Identify priorities, automatically categorize departments, and resolve issues 40% faster.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/citizen/raise"
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#5E4075] hover:bg-[#4a325d] text-white font-medium shadow-sm transition-all text-center"
              >
                Get Started Free
              </Link>

              <Link
                to="/demo"
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white hover:bg-gray-50 text-[#1F2937] font-medium border border-[#E5E7EB] shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current text-[#5E4075]" />
                Watch Live Demo
              </Link>
            </motion.div>
          </div>
        </section>

        {/* METRICS / STATS BAR */}
        <section className="bg-white border-y border-[#E5E7EB] py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">50K+</div>
              <div className="text-xs sm:text-sm text-[#6B7280] mt-1 font-medium">Calls Analyzed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">98%</div>
              <div className="text-xs sm:text-sm text-[#6B7280] mt-1 font-medium">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">40%</div>
              <div className="text-xs sm:text-sm text-[#6B7280] mt-1 font-medium">Faster Resolution</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">200+</div>
              <div className="text-xs sm:text-sm text-[#6B7280] mt-1 font-medium">Departments Integrated</div>
            </div>
          </div>
        </section>

        {/* CORE CAPABILITIES SECTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5E4075]">Core Capabilities</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#1F2937] mt-2">Built for Public Administration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Capability 1 */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E1D2FF]/50 flex items-center justify-center text-[#5E4075] mb-4">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">Voice Analysis</h3>
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                  Transcribe multilingual call files instantly with government-grade precision.
                </p>
              </div>
            </div>

            {/* Capability 2 */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E1D2FF]/50 flex items-center justify-center text-[#5E4075] mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">Smart Categorization</h3>
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                  Automatically tag municipal concerns from traffic repairs to zoning violations.
                </p>
              </div>
            </div>

            {/* Capability 3 */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E1D2FF]/50 flex items-center justify-center text-[#5E4075] mb-4">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">Priority Detection</h3>
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                  Real-time critical indicator classification to surface emergency incidents first.
                </p>
              </div>
            </div>

            {/* Capability 4 - Sentiment Analysis */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E1D2FF]/50 flex items-center justify-center text-[#5E4075] mb-4">
                  <Gauge className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">Sentiment Analysis</h3>
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                  Understand emotional intensity to better manage escalating citizen issues.
                </p>
              </div>
            </div>

            {/* Capability 5 - Department Routing */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E1D2FF]/50 flex items-center justify-center text-[#5E4075] mb-4">
                  <GitFork className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">Department Routing</h3>
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                  Automatically assign workflows directly to matching infrastructure groups.
                </p>
              </div>
            </div>

            {/* Capability 6 - Real-time Analytics */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E1D2FF]/50 flex items-center justify-center text-[#5E4075] mb-4">
                  <LineChart className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">Real-time Analytics</h3>
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                  Live visualization dashboard showing incoming case density and hot spots.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OPERATIONS PIPELINE SECTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5E4075]">Operations Pipeline</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#1F2937] mt-2">How CivicAI Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 01 */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
              <div className="text-3xl font-extrabold text-[#5E4075]/40 mb-3">01</div>
              <h3 className="text-base font-bold text-[#1F2937]">Record</h3>
              <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                Citizen uploads call recording, voicemail, or files live voice complaint.
              </p>
            </div>

            {/* Step 02 */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
              <div className="text-3xl font-extrabold text-[#5E4075]/40 mb-3">02</div>
              <h3 className="text-base font-bold text-[#1F2937]">Transcribe</h3>
              <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                AI engine translates audio to high-fidelity clean textual logs.
              </p>
            </div>

            {/* Step 03 */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
              <div className="text-3xl font-extrabold text-[#5E4075]/40 mb-3">03</div>
              <h3 className="text-base font-bold text-[#1F2937]">Analyze</h3>
              <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                Models process sentiment, identify severity, and fetch location tags.
              </p>
            </div>

            {/* Step 04 */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
              <div className="text-3xl font-extrabold text-[#5E4075]/40 mb-3">04</div>
              <h3 className="text-base font-bold text-[#1F2937]">Route</h3>
              <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                The complaint routes instantly to the matching department pipeline.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <section className="bg-[#5E4075] text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Modernize Public Service?
            </h2>
            <p className="mt-4 text-[#E1D2FF] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Get a tailored system integration audit. See how CivicAI integrates directly with standard public management pipelines.
            </p>
            <div className="mt-8">
              <Link
                to="/audit"
                className="inline-block px-6 py-3.5 rounded-lg bg-white hover:bg-gray-100 text-[#5E4075] font-semibold text-sm shadow-md transition-all"
              >
                Schedule Government Audit
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};