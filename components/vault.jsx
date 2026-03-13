'use client';

import { motion } from 'framer-motion';
import { Lock, Hash, Copy, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { containerVariants, itemVariants } from '@/lib/animations';

const vaultData = {
  hash: '0x7f2a8c9e4d6b1f3a5c2e8b7d9f4a6c1e3b5d7f9a2c4e6f8a0b1c3d5e7f9a1b',
  timestamp: new Date().toISOString(),
  status: 'SEALED',
  integrity: '100%',
};

export function DigitalVault() {
  const [copied, setCopied] = useState(false);
  const [displayHash, setDisplayHash] = useState('');
  const [displayTimestamp, setDisplayTimestamp] = useState('');

  useEffect(() => {
    let hashIndex = 0;
    const hashInterval = setInterval(() => {
      if (hashIndex <= vaultData.hash.length) {
        setDisplayHash(vaultData.hash.slice(0, hashIndex));
        hashIndex++;
      } else {
        clearInterval(hashInterval);
      }
    }, 30);

    return () => clearInterval(hashInterval);
  }, []);

  useEffect(() => {
    if (displayHash.length === vaultData.hash.length) {
      let tsIndex = 0;
      const tsInterval = setInterval(() => {
        if (tsIndex <= vaultData.timestamp.length) {
          setDisplayTimestamp(vaultData.timestamp.slice(0, tsIndex));
          tsIndex++;
        } else {
          clearInterval(tsInterval);
        }
      }, 20);

      return () => clearInterval(tsInterval);
    }
  }, [displayHash.length]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(vaultData.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Digital Vault</h2>
        <p className="text-sm text-muted-foreground">Blockchain-verified land succession record</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="p-6 rounded border neon-border bg-gradient-to-br from-background to-muted/20 space-y-6"
      >
        {/* Vault Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-3 rounded-lg bg-primary/10"
            >
              <Lock className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-foreground">Immutable Record</h3>
              <p className="text-xs text-muted-foreground">Ethereum Mainnet</p>
            </div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {vaultData.status}
            </span>
          </motion.div>
        </div>

        {/* Hash Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Transaction Hash
            </label>
            <motion.button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </motion.button>
          </div>

          <motion.div
            className="p-4 rounded bg-muted/50 border border-border/50 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <p className="text-xs font-mono text-primary/80 break-all">
              {displayHash}
              {displayHash.length < vaultData.hash.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="bg-primary/40 rounded px-1"
                >
                  ▮
                </motion.span>
              )}
            </p>
          </motion.div>
        </div>

        {/* Timestamp */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Sealed At
          </label>
          <motion.div
            className="p-4 rounded bg-muted/50 border border-border/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <p className="text-xs font-mono text-secondary/80">
              {displayTimestamp}
              {displayTimestamp.length < vaultData.timestamp.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="bg-secondary/40 rounded px-1"
                >
                  ▮
                </motion.span>
              )}
            </p>
          </motion.div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <motion.div
            variants={itemVariants}
            className="space-y-1.5"
          >
            <p className="text-xs text-muted-foreground">Network</p>
            <p className="font-semibold text-foreground">Ethereum L1</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-1.5"
          >
            <p className="text-xs text-muted-foreground">Integrity Check</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                {vaultData.integrity}
              </p>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-1.5"
          >
            <p className="text-xs text-muted-foreground">Type</p>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-primary" />
              <p className="font-semibold text-foreground">ERC-721</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-1.5"
          >
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="font-semibold text-foreground">Verified</p>
          </motion.div>
        </div>

        {/* Verification Button */}
        <motion.button
          variants={itemVariants}
          className="w-full px-4 py-3 rounded font-medium bg-gradient-to-r from-purple-500 to-emerald-500 text-white hover:from-purple-600 hover:to-emerald-600 transition-all neon-glow flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Lock className="w-4 h-4" />
          Verify on Blockchain
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
