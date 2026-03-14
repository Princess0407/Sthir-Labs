'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Zap, FileText, Shield } from 'lucide-react';
import { containerVariants, itemVariants } from '@/lib/animations';

const stages = [
{
  id: 1,
  label: 'Document Ingestion',
  status: 'complete',
  icon: FileText,
  description: 'Files uploaded and parsed',
  timestamp: '14:32:22 UTC'
},
{
  id: 2,
  label: 'OCR Processing',
  status: 'complete',
  icon: Zap,
  description: 'Text extraction in progress',
  timestamp: '14:32:45 UTC'
},
{
  id: 3,
  label: 'Forensic Verification',
  status: 'active',
  icon: Shield,
  description: 'Analyzing document authenticity',
  timestamp: '14:33:12 UTC'
},
{
  id: 4,
  label: 'Chain of Title Analysis',
  status: 'pending',
  icon: Clock,
  description: 'Tracing ownership history',
  timestamp: null
},
{
  id: 5,
  label: 'Verdict Generation',
  status: 'pending',
  icon: CheckCircle,
  description: 'Compiling final report',
  timestamp: null
}];


export function ForensicProcessFeed() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4">
      
      <motion.div variants={itemVariants} className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Forensic Process Feed</h2>
        <p className="text-sm text-muted-foreground">Real-time verification stages</p>
      </motion.div>

      <motion.div className="space-y-3" variants={containerVariants}>
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = stage.status === 'active';
          const isComplete = stage.status === 'complete';
          const isPending = stage.status === 'pending';

          return (
            <motion.div
              key={stage.id}
              variants={itemVariants}
              className={`relative p-4 rounded border transition-all ${
              isComplete ?
              'border-emerald-500/30 bg-emerald-500/5' :
              isActive ?
              'border-primary/50 bg-primary/5 neon-glow' :
              'border-border/50 bg-muted/20'}`
              }>
              
              <div className="flex gap-4">
                {/* Timeline marker */}
                <div className="relative flex flex-col items-center flex-shrink-0">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete ?
                    'bg-emerald-500/20 text-emerald-500' :
                    isActive ?
                    'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'}`
                    }>
                    
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  {index < stages.length - 1 &&
                  <div
                    className={`w-0.5 h-8 my-1 ${
                    isComplete ?
                    'bg-emerald-500/30' :
                    isActive ?
                    'bg-primary/30' :
                    'bg-border/50'}`
                    } />

                  }
                </div>

                {/* Content */}
                <div className="flex-1 pt-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{stage.label}</h3>
                    {stage.timestamp &&
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {stage.timestamp}
                      </span>
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>

                  {isActive &&
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
                    
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                      Processing...
                    </motion.div>
                  }
                </div>
              </div>
            </motion.div>);

        })}
      </motion.div>

      {/* Progress Bar */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-muted-foreground">Overall Progress</span>
          <span className="text-xs font-bold text-primary">60%</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '60%' }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-500" />
          
        </div>
      </motion.div>
    </motion.section>);

}