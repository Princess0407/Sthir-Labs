"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Zap, Shield, Clock, CheckCircle2 } from "lucide-react";

function LogoFold() {
    return (
        <svg width="60" height="60" viewBox="0 0 64 64" fill="none" stroke="#FFCBA4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <path d="M12 12 l40 0 l0 40 l-40 0 z" fill="#FFCBA4" fillOpacity="0.2" />
            <path d="M52 12 l-20 20 l-20 -20" />
            <path d="M12 52 l20 -20 l20 20" />
        </svg>
    );
}

export default function DashboardPage() {
    const [isUploaded, setIsUploaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("idle"); // idle, processing, success, error
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    // --- INTEGRATED FETCH LOGIC ---
    const uploadFile = async (file) => {
        setIsUploaded(true);
        setUploadStatus("processing");
        setProgress(10); // Start progress immediately

        const formData = new FormData();
        formData.append("file", file);
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
    };

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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F7F2] font-sans selection:bg-[#FFCBA4] selection:text-white relative p-6">
            <div className="flex flex-col items-center justify-center w-full max-w-md space-y-12">
                {/* Branding */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center space-y-4"
                >
                    <LogoFold />
                    <h1 className="text-[20px] font-light text-[#3E2723]" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                        Sthir Labs
                    </h1>
                </motion.div>

                {/* Main Area */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="flex flex-col items-center space-y-6 w-full"
                >
                    <AnimatePresence mode="wait">
                        {!isUploaded ? (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center space-y-6 w-full mt-12"
                            >
                                <h2 className="text-[15px] font-bold text-[#64748b] uppercase tracking-tight">
                                    Verification
                                </h2>
                                <div
                                    className={`flex flex-col items-center justify-center w-full py-8 transition-transform duration-300 ${isDragging ? 'scale-105' : 'scale-100'}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <button
                                        onClick={handleUploadClick}
                                        className="bg-[#FFCBA4] text-white font-bold py-3 px-10 rounded-full hover:opacity-90 transition-opacity shadow-md active:scale-95 drop-shadow-sm"
                                    >
                                        Upload
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <p className="text-gray-500 text-[14px] mt-5 select-none font-medium text-center">
                                        Drag files or click to browse
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="workflow"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col space-y-8 w-full px-4"
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
                                <div className="flex flex-col w-full space-y-3 pt-6">
                                    <div className="flex justify-between w-full text-sm items-center">
                                        <span className="text-[#3E2723]/60 font-bold tracking-widest text-[14px] uppercase">
                                            OVERALL PROGRESS
                                        </span>
                                        {/* Progress text in a brownish cream as requested */}
                                        <span className="font-bold text-[#D8C9B9]">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200/60 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#FFCBA4] rounded-full transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

function StepItem({ icon: Icon, title, status }) {
    const isProcessing = status === 'processing';
    const isPending = status === 'pending';
    const isDone = status === 'done';

    // Active is Deep Espresso, bold; inactive is Slate Grey (#94a3b8)
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