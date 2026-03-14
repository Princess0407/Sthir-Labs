"use client"

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Folder, Zap, Shield, Clock, CheckCircle2 } from "lucide-react";

export default function SthirLabsApp() {
  const [view, setView] = useState('splash');
  const [isUploaded, setIsUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => setView('dashboard'), 3500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploaded(true);
      setUploadStatus('uploading');

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/api/verify', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setUploadStatus('success');
          // Trigger progress bar 0 to 100 over 5 seconds
          const duration = 5000;
          const intervalTime = 50;
          const steps = duration / intervalTime;
          let currentStep = 0;

          const interval = setInterval(() => {
            currentStep++;
            setProgress((currentStep / steps) * 100);
            if (currentStep >= steps) {
              clearInterval(interval);
            }
          }, intervalTime);
        } else {
          setUploadStatus('error');
          console.error("Upload failed");
        }
      } catch (error) {
        setUploadStatus('error');
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center font-sans text-[#3E2723]">
      <AnimatePresence mode="wait">

        {/* VIEW 1: THE SPLASH SCREEN */}
        {view === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <Image
              src="/logo.png"
              alt=""
              width={140}
              height={140}
              className="mb-6 object-contain"
              priority
              unoptimized
            />
            <h1 className="text-[20px] font-light tracking-widest text-[#3E2723] uppercase">Sthir Labs</h1>

            <div className="mt-8 h-[2px] w-32 bg-gray-200 overflow-hidden">
              <motion.div
                className="h-full bg-[#FFCBA4]"
                initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3 }}
              />
            </div>
          </motion.div>
        )}

        {/* VIEW 2: THE DASHBOARD */}
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl flex flex-col items-center p-8"
          >
            {/* Branding Top with PNG */}
            <div className="flex flex-col items-center mb-16">
              <Image
                src="/logo.png"
                alt=""
                width={70}
                height={100}
                className="mb-4 object-contain"
                priority
                unoptimized
              />
              <h2 className="text-[40px] font-light text-[#3E2723]">Sthir Labs</h2>
            </div>

            {/* Verification Section */}
            <div className="w-full flex flex-col items-center gap-6">

              <AnimatePresence mode="wait">
                {!isUploaded ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center w-full"
                  >
                    <h3 className="text-[15px] font-bold text-[#64748b] uppercase tracking-tight mb-8">Verification</h3>

                    <label className="cursor-pointer group flex flex-col items-center">
                      <div className="bg-[#FFCBA4] hover:bg-[#efb993] text-white px-10 py-3 rounded-full transition-all shadow-md active:scale-95 text-center font-bold">
                        Upload
                      </div>
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>

                    <p className="text-[14px] text-gray-500 mt-4 italic">Drag files or click to browse</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="workflow"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col w-full max-w-md space-y-8"
                  >
                    {/* Dynamic Workflow List */}
                    <div className="flex flex-col w-full space-y-6">
                      <StepItem icon={Folder} title="Document Ingestion" status="done" />
                      <StepItem icon={Zap} title="OCR Processing" status="done" />
                      <StepItem icon={Shield} title="Forensic Verification" status="processing" />
                      <StepItem icon={Clock} title="Chain of Title Analysis" status="pending" />
                      <StepItem icon={CheckCircle2} title="Verdict Generation" status="pending" />
                    </div>

                    {/* Overall Progress */}
                    <div className="flex flex-col w-full space-y-3 pt-8 border-t border-[#3E2723]/10">
                      <div className="flex justify-between w-full text-sm items-center">
                        <span className="text-[#3E2723]/60 font-bold tracking-widest text-[14px] uppercase">OVERALL PROGRESS</span>
                        {/* Progress text in a brownish cream as requested */}
                        <span className="font-bold text-[#D8C9B9]">{Math.round(progress)}%</span>
                      </div>
                      {/* Low opacity grey bar */}
                      <div className="w-full h-2 bg-gray-200/60 rounded-full overflow-hidden">
                        {/* Solid Pastel Peach fill */}
                        <div className="h-full bg-[#FFCBA4] rounded-full transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}

function StepItem({ icon: Icon, title, status }) {
  const isProcessing = status === 'processing';
  const isPending = status === 'pending';
  const isDone = status === 'done';

  const textColorClass = isProcessing ? 'text-[#3E2723] font-bold' : 'text-[#94a3b8]';
  const iconColorClass = isProcessing ? 'text-[#FFCBA4]' : isPending ? 'text-[#94a3b8]' : 'text-[#FFCBA4]';

  return (
    <div className="flex items-center space-x-5 w-full">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isProcessing ? 'animate-pulse bg-[#FFCBA4]/10 border-2 border-[#FFCBA4]/30' : 'bg-transparent border border-transparent'}`}>
        <Icon className={`w-6 h-6 ${iconColorClass}`} />
      </div>
      <span className={`text-[18px] ${textColorClass}`}>
        {title}
      </span>
    </div>
  );
}