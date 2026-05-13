import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function CreateCertificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Created certification:', formData);
    
    setIsLoading(false);
    // Reset form or show success toast...
    setFormData({ title: '', description: '', instructor: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create a Certification</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Define the parameters for a new certification program. You can issue this to students once configured.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 block items-center pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 w-full max-w-2xl">
          <Input 
            label="Certification Title" 
            placeholder="e.g. Meta Front-End Developer Professional Certificate"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
          
          <div className="w-full flex flex-col gap-1.5 text-left">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              className="flex min-h-[120px] w-full items-center rounded-md border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-colors resize-y dark:text-white"
              placeholder="Provide a brief description of what this certification entails..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <Input 
            label="Issuing Instructor / Authority" 
            placeholder="e.g. Dr. John Doe"
            value={formData.instructor}
            onChange={e => setFormData({...formData, instructor: e.target.value})}
            required
          />

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center py-3 px-6 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                <>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Generate Certification Template
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
