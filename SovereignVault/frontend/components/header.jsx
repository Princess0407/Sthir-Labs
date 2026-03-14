'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-b border-border/40 bg-background/80 backdrop-blur-sm neon-border sticky top-0 z-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}>
          
          <div className="w-8 h-8 rounded neon-glow bg-gradient-to-br from-purple-500 via-purple-600 to-emerald-500 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-foreground">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">
              Sthir Labs
            </span>
          </h1>
        </motion.div>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded text-xs font-mono bg-muted/50 text-muted-foreground neon-border">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            System: Active
          </div>

          <motion.button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded hover:bg-muted transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme">
            
            {theme === 'dark' ?
            <Sun className="w-4 h-4 text-yellow-500" /> :

            <Moon className="w-4 h-4 text-slate-600" />
            }
          </motion.button>
        </motion.div>
      </div>
    </motion.header>);

}