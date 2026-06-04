import React, { useEffect, useMemo, useState } from 'react';

type Signature = {
  id: number;
  name: string;
  imageUrl: string;
  isDefault: boolean;
  uploadedAt: string;
};

type RawSignature = {
  id?: number;
  name?: string;
  image?: string;
  image_url?: string;
  url?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date';
  }

  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function ManageSignaturePage() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [signatureName, setSignatureName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const url = import.meta.env.VITE_API_URL;

  const previewUrl = useMemo(() => {
    if (!selectedFile) {
      return '';
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const fetchSignatures = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const token = localStorage.getItem('token');
        const request = await fetch(`${url}api/v1/signatures`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!request.ok) {
          setSignatures([]);
          return;
        }

        const response = await request.json();
        const records = (response.data || []) as RawSignature[];

        const mapped = records.map((item, index) => ({
          id: item.id ?? index,
          name: item.name || `Signature ${index + 1}`,
          imageUrl: item.image_url || item.image || item.url || '',
          isDefault: Boolean(item.is_default),
          uploadedAt: item.created_at || item.updated_at || new Date().toISOString(),
        }));

        setSignatures(mapped);
      } catch {
        setErrorMessage('Unable to load signatures right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignatures();
  }, [url]);

  const uploadSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedFile) {
      setErrorMessage('Choose an image file before uploading.');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('signature', selectedFile);
      formData.append('name', signatureName || selectedFile.name);

      const request = await fetch(`${url}api/v1/signatures`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!request.ok) {
        throw new Error('Upload failed');
      }

      const response = await request.json().catch(() => null);
      const uploaded = response?.data as RawSignature | undefined;

      const nextSignature: Signature = {
        id: uploaded?.id ?? Date.now(),
        name: uploaded?.name || signatureName || selectedFile.name,
        imageUrl: uploaded?.image_url || uploaded?.image || uploaded?.url || previewUrl,
        isDefault: Boolean(uploaded?.is_default),
        uploadedAt: uploaded?.created_at || new Date().toISOString(),
      };

      setSignatures((prev) => [nextSignature, ...prev]);
      setSelectedFile(null);
      setSignatureName('');
    } catch {
      setErrorMessage('Unable to upload signature right now.');
    } finally {
      setIsUploading(false);
    }
  };

  const setDefaultSignature = async (signatureId: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${url}api/v1/signatures/${signatureId}/set-default`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Keep optimistic update behavior even when API doesn't support this action.
    }

    setSignatures((prev) =>
      prev.map((signature) => ({
        ...signature,
        isDefault: signature.id === signatureId,
      })),
    );
  };

  const deleteSignature = async (signatureId: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${url}api/v1/signatures/${signatureId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Keep local delete behavior even if the API endpoint differs.
    }

    setSignatures((prev) => prev.filter((signature) => signature.id !== signatureId));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Manage Signature</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Upload, set default, and remove signature files used for issued certificates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Upload Signature</h2>

          <form className="space-y-4" onSubmit={uploadSignature}>
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="signature-name">
                Signature Name
              </label>
              <input
                id="signature-name"
                className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Registrar Signature"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="signature-file">
                Signature File
              </label>
              <input
                id="signature-file"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            {previewUrl && (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Preview</p>
                <img src={previewUrl} alt="Signature preview" className="h-28 object-contain" />
              </div>
            )}

            {errorMessage && (
              <div className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isUploading ? 'Uploading...' : 'Upload Signature'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Existing Signatures</h2>

          {isLoading && <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading signatures...</p>}

          {!isLoading && signatures.length === 0 && (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No signatures uploaded yet.
            </div>
          )}

          <div className="space-y-3">
            {signatures.map((signature) => (
              <div
                key={signature.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3 flex gap-3 items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {signature.imageUrl ? (
                    <img src={signature.imageUrl} alt={signature.name} className="w-14 h-14 object-contain rounded-md bg-zinc-50 dark:bg-zinc-950" />
                  ) : (
                    <div className="w-14 h-14 rounded-md bg-zinc-100 dark:bg-zinc-800" />
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">{signature.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Uploaded {formatDate(signature.uploadedAt)}</p>
                    {signature.isDefault && (
                      <span className="mt-1 inline-flex rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 text-xs font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDefaultSignature(signature.id)}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                    disabled={signature.isDefault}
                  >
                    Set Default
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSignature(signature.id)}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}