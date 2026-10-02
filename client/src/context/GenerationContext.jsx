import React, { createContext, useContext, useState, useEffect } from 'react';
import { jobApi } from '../api';

const GenerationContext = createContext(null);

export const GenerationProvider = ({ children }) => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [currentModalJob, setCurrentModalJob] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Register a new background job to track
  const trackJob = (jobId, title = 'Generation Task', onComplete = null) => {
    const newJob = {
      jobId,
      title,
      progress: 5,
      status: 'processing',
      statusMessage: 'Initiating cinematic task...',
      onComplete,
    };
    setActiveJobs((prev) => [newJob, ...prev.filter((j) => j.jobId !== jobId)]);
    setCurrentModalJob(newJob);
    return newJob;
  };

  // Poll active jobs
  useEffect(() => {
    if (activeJobs.length === 0) return;

    const interval = setInterval(async () => {
      const updatedJobs = await Promise.all(
        activeJobs.map(async (job) => {
          if (job.status === 'completed' || job.status === 'failed') {
            return job;
          }
          try {
            const res = await jobApi.getById(job.jobId);
            const serverJob = res.data.data;
            if (serverJob) {
              const merged = {
                ...job,
                progress: serverJob.progress,
                status: serverJob.status,
                statusMessage: serverJob.statusMessage,
                resultUrl: serverJob.resultUrl,
                resultData: serverJob.resultData,
                error: serverJob.error,
              };

              if (serverJob.status === 'completed') {
                addToast(`🎉 ${job.title} completed successfully!`, 'success');
                if (job.onComplete) {
                  job.onComplete(serverJob);
                }
              } else if (serverJob.status === 'failed') {
                addToast(`⚠️ ${job.title} failed: ${serverJob.error || 'Unknown error'}`, 'error');
              }

              // Update modal job if open
              if (currentModalJob && currentModalJob.jobId === job.jobId) {
                setCurrentModalJob(merged);
              }

              return merged;
            }
          } catch (err) {
            console.error('[GenerationContext] Poll error:', err);
          }
          return job;
        })
      );

      setActiveJobs(updatedJobs);
    }, 1500);

    return () => clearInterval(interval);
  }, [activeJobs, currentModalJob]);

  const closeJobModal = () => {
    setCurrentModalJob(null);
  };

  return (
    <GenerationContext.Provider
      value={{
        activeJobs,
        currentModalJob,
        toasts,
        trackJob,
        setCurrentModalJob,
        closeJobModal,
        addToast,
        removeToast,
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
};

export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (!context) throw new Error('useGeneration must be used within a GenerationProvider');
  return context;
};
