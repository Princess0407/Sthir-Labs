"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Zap, Shield, Clock, CheckCircle2 } from "lucide-react";

// Minimal SVG representation of LogoFold styled in Pastel Peach (#FFCBA4)
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
        setIsUploaded(true);
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploaded(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,_#FFFFFF_0%,_#F5EFE7_100%)] font-sans selection:bg-[#FFCBA4] selection:text-white relative p-6">
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
                                <h2 className="text-[15px] font-bold text-[#3E2723]" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
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
                                        className="bg-[#FFCBA4] text-white font-bold py-3 px-10 rounded-full hover:opacity-90 transition-opacity shadow-sm drop-shadow-sm"
                                    >
                                        Upload
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <p className="text-white/30 text-[14px] mt-5 select-none font-medium text-center">
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
                                    <div className="flex justify-between w-full text-white text-sm">
                                        <span className="text-white/40 font-bold" style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: '13px' }}>PROCESSING</span>
                                        <span className="font-semibold text-white/80">60%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/40 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#FFCBA4] rounded-full" style={{ width: '60%' }} />
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

    // Low-opacity medium grey for non-bold descriptive text (white at 40%) per instructions
    const textColorClass = isProcessing ? 'text-[#FFCBA4]' : isPending ? 'text-white/20' : 'text-white/40';
    const iconColorClass = isProcessing ? 'text-[#FFCBA4]' : isPending ? 'text-white/20' : 'text-white/60';

    return (
        <div className="flex items-center space-x-4 w-full">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isProcessing ? 'animate-pulse bg-[#FFCBA4]/10 border border-[#FFCBA4]/30' : ''}`}>
                <Icon className={`w-5 h-5 ${iconColorClass}`} />
            </div>
            <span className={`text-[15px] ${isProcessing ? 'font-medium' : ''} ${textColorClass}`}>
                {title}
            </span>
        </div>
    );
}
