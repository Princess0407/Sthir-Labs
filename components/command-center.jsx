'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Zap, FileText, AlertCircle } from 'lucide-react';
import { containerVariants, itemVariants } from '@/lib/animations';

export function VerificationCommandCenter() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files).slice(0, 3);
    setFiles((prev) => [...prev, ...newFiles].slice(0, 3));
    if (newFiles.length > 0) {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 3000);
    }
  };

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files).slice(0, 3);
    setFiles((prev) => [...prev, ...newFiles].slice(0, 3));
    if (newFiles.length > 0) {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 3000);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
        <h2 className="text-xl font-bold text-foreground">Verification Command Center</h2>
        <p className="text-sm text-muted-foreground">Upload land documents for automated forensic analysis</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded transition-all p-8 ${
          isDragging
            ? 'border-primary bg-primary/5 neon-glow'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <div className="text-center space-y-3">
          <motion.div
            animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            className="w-12 h-12 mx-auto rounded bg-gradient-to-br from-purple-500/20 to-emerald-500/20 flex items-center justify-center neon-glow"
          >
            <Zap className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <p className="font-medium text-foreground">Drag files here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">Supports PDF, JPG, PNG (max 3 files)</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Select Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </motion.div>

      {/* Laser Scan Animation */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded overflow-hidden"
          >
            <motion.div
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      <motion.div
        className="space-y-2"
        variants={containerVariants}
        initial="hidden"
        animate={files.length > 0 ? 'visible' : 'hidden'}
      >
        {files.map((file, index) => (
          <motion.div
            key={`${file.name}-${index}`}
            variants={itemVariants}
            className="flex items-center gap-3 p-3 rounded bg-muted/50 neon-border group"
          >
            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <motion.button
              onClick={() => removeFile(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <AlertCircle className="w-4 h-4 text-destructive" />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {files.length > 0 && (
        <motion.button
          variants={itemVariants}
          className="w-full px-4 py-2 rounded font-medium bg-gradient-to-r from-purple-500 to-emerald-500 text-white hover:from-purple-600 hover:to-emerald-600 transition-all neon-glow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Initiate Forensic Scan
        </motion.button>
      )}
    </motion.section>
  );
}
