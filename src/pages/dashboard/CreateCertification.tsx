import React, { useState, useEffect } from 'react';
import CertificateForm from '../../components/certificate-form';
import { ChevronLeft } from 'lucide-react';


type Certificate = {
  id: number;
  display: string;
  template: string;
  variables: string;
  default_variables: string;
  title: string;
}

export default function CreateCertificationPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function process() {
      const response = await fetchCertificates();
      setCertificates(response);
    }

    process();
  }, []);


  const fetchCertificates = async () => {
    const token = localStorage.getItem('token');
    const request = await fetch(`${url}api/v1/certificates`, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const response = await request.json();
    return response.data;
  }

  const selectCertificate = (index: number) => {
    const selectedCert = certificates.filter((c, ix) => ix === index);
    setSelectedCertificate(selectedCert[0]);
  }

  const goBack = () => {
    setSelectedCertificate(null);
  }

  return (
    <div className="max-w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create a Certification</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Define the parameters for a new certification program. You can issue this to students once configured.
        </p>
      </div>

      {
        !selectedCertificate && <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          {/* Decorative background element */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-500 mb-3">Choose a Template</h2>

          {
            certificates.length > 0 && <div className='flex gap-2 p-2'>
              {
                certificates.map((cert, idx) =>
                  <div className='p-2 w-fit h-fit cursor-pointer hover:border-gray-700 hover:border' key={idx} onClick={() => selectCertificate(idx)}>
                    {/* image */}
                    <div className='w-64 h-32 mb-3'>
                      <img src={`${url}${cert.display}`} alt={cert.title} className='w-full h-full' />
                    </div>
                    <div className='text-center text-gray-500'>
                      <span>{cert.title}</span>
                    </div>
                  </div>
                )
              }
            </div>
          }
        </div>
      }

      {
        selectedCertificate && <div className="mx-auto max-w-6xl bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 block items-center pointer-events-none" />

          <div className='mb-4'>
            <button className='flex gap-2 outline p-3 outline-gray-600 rounded-4xl cursor-pointer' onClick={() => goBack()}>
              <ChevronLeft></ChevronLeft> Back
            </button>
          </div>


          <div className='flex justify-center items-center p-3'>
            <CertificateForm variables={selectedCertificate.variables} baseUrl={url} />
          </div>

        </div>
      }

    </div>
  );
}
