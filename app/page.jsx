'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { VerificationCommandCenter } from '@/components/command-center';
import { ForensicProcessFeed } from '@/components/process-feed';
import { IntelligentVerdict } from '@/components/verdict';
import { DigitalVault } from '@/components/vault';
import { containerVariants } from '@/lib/animations';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      >
        {/* Hero Section */}
        <motion.section
          className="space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-purple-600 to-emerald-500 text-balance">
              Land Succession Terminal
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              Advanced forensic analysis and blockchain-verified succession records for land ownership verification.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'AI Forensics',
                description: 'Machine learning-powered document authentication',
                gradient: 'from-purple-500/20 to-purple-600/20',
              },
              {
                title: 'Immutable Records',
                description: 'Blockchain-verified land succession chains',
                gradient: 'from-emerald-500/20 to-emerald-600/20',
              },
              {
                title: 'Real-time Processing',
                description: '48-hour forensic analysis and verification',
                gradient: 'from-cyan-500/20 to-cyan-600/20',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.1 }}
                className={`p-4 rounded border neon-border bg-gradient-to-br ${feature.gradient} to-background/50`}
              >
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Sections */}
        <div className="space-y-12">
          <VerificationCommandCenter />
          <ForensicProcessFeed />
          <IntelligentVerdict />
          <DigitalVault />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="border-t border-border/40 mt-12 pt-8 pb-4 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">About</h3>
              <p className="text-sm text-muted-foreground">
                Sthir Labs provides cutting-edge land succession verification using AI and blockchain technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Support</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <button className="hover:text-foreground transition-colors">Documentation</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors">API Reference</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors">Contact</button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Legal</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <button className="hover:text-foreground transition-colors">Privacy Policy</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors">Terms of Service</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors">Compliance</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>&copy; 2026 Sthir Labs. All rights reserved.</p>
            <p>
              Built with{' '}
              <span className="text-purple-500 font-medium">Vercel AI Gateway</span> &{' '}
              <span className="text-emerald-500 font-medium">Framer Motion</span>
            </p>
          </div>
        </motion.footer>
      </motion.main>
    </div>
  );
}
