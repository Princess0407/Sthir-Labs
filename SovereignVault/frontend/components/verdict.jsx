'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { containerVariants, itemVariants } from '@/lib/animations';

export function IntelligentVerdict() {
  const [fraudScore, setFraudScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(48 * 3600); // 48 hours in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setFraudScore(Math.min(fraudScore + Math.random() * 2, 23));
    }, 1000);
    return () => clearInterval(interval);
  }, [fraudScore]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const gaugePercentage = fraudScore / 100;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Intelligent Verdict</h2>
        <p className="text-sm text-muted-foreground">AI-powered fraud probability assessment</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Fraud Probability Gauge */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded border neon-border bg-gradient-to-br from-background to-muted/20 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Fraud Probability</h3>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>

          {/* Circular Gauge */}
          <div className="flex items-center justify-center relative w-40 h-40 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted"
              />

              {/* Progress circle */}
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - gaugePercentage)}`}
                strokeLinecap="round"
                className="transition-all"
              />

              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(139, 92, 246)" />
                  <stop offset="100%" stopColor="rgb(16, 185, 129)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div>
                <motion.div
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500"
                >
                  {fraudScore.toFixed(1)}%
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Probability</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${gaugePercentage * 100}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                className="h-full bg-gradient-to-r from-emerald-500 via-purple-500 to-red-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Verdict Card */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded border neon-border bg-gradient-to-br from-background to-muted/20 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Verification Status</h3>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Clock className="w-4 h-4 text-primary" />
            </motion.div>
          </div>

          <div className="space-y-3">
            {/* Status Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-sm font-medium text-yellow-700 dark:text-yellow-200"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Under Review
            </motion.div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Documents Analyzed:</span>
                <span className="font-medium text-foreground">3 / 3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Anomalies Detected:</span>
                <span className="font-medium text-orange-500">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chain Verified:</span>
                <span className="font-medium text-emerald-500">Pending</span>
              </div>
            </div>

            {/* Countdown */}
            <div className="pt-2 border-t border-border/50 space-y-2">
              <p className="text-xs text-muted-foreground">Decision in:</p>
              <motion.div
                className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500"
                key={timeLeft}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
                {String(seconds).padStart(2, '0')}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Analysis */}
      <motion.div
        variants={itemVariants}
        className="p-4 rounded border neon-border bg-muted/30 space-y-3"
      >
        <h3 className="font-semibold text-foreground text-sm">Analysis Summary</h3>
        <div className="space-y-2 text-xs text-muted-foreground font-mono">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {'> '} Watermark authenticity: VALID
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {'> '} Signature analysis: SUSPICIOUS
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {'> '} Document aging: ANOMALY DETECTED
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {'> '} Chain of custody: INCOMPLETE
          </motion.p>
        </div>
      </motion.div>
    </motion.section>
  );
}
