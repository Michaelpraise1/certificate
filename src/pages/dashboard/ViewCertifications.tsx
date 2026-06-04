import React, { useEffect, useMemo, useState } from 'react';

type CertificationStatus = 'processing' | 'done' | 'failed';

type CertificationItem = {
    id: number;
    title: string;
    candidateFile: string;
    status: CertificationStatus;
    createdAt: string;
};

type Certification = {
    id: number;
    title: string;
    cstatus: string;
    candidates: string;
    created_at: string;
    updated_at?: string;
};

const statusStyles: Record<CertificationStatus, string> = {
    done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    processing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    failed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
};

const safeStatus = (value?: string, isActive?: boolean, failed?: boolean): CertificationStatus => {
    if (failed) {
        return 'failed';
    }

    if (typeof value === 'string') {
        const normalized = value.toLowerCase();
        if (normalized === 'done' || normalized === 'processing' || normalized === 'failed') {
            return normalized;
        }
    }

    if (isActive === true) {
        return 'done';
    }

    return 'processing';
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

export default function ViewCertificationsPage() {
    const [certifications, setCertifications] = useState<CertificationItem[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | CertificationStatus>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCertifications = async () => {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                };

                // Try both endpoints so the page still works across backend naming differences.
                const primaryRequest = await fetch(`${url}api/v1/certifications/all`, { headers });
                const primaryResponse = primaryRequest.ok ? await primaryRequest.json() : null;

                const fallbackRequest = !primaryResponse ? await fetch(`${url}api/v1/certificates`, { headers }) : null;
                const fallbackResponse = fallbackRequest && fallbackRequest.ok ? await fallbackRequest.json() : null;

                const records = (primaryResponse?.data || fallbackResponse?.data || []) as Certification[];
                const mapped = records.map((item, index) => ({
                    id: item.id ?? index,
                    title: item.title,
                    candidateFile: item.candidates,
                    status: safeStatus(item.cstatus),
                    createdAt: item.created_at || item.updated_at || new Date().toISOString(),
                }));

                setCertifications(mapped);
            } catch {
                setErrorMessage('Unable to load certifications right now.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertifications();
    }, [url]);

    const filteredCertifications = useMemo(() => {
        if (statusFilter === 'all') {
            return certifications;
        }

        return certifications.filter((cert) => cert.status === statusFilter);
    }, [certifications, statusFilter]);

    const statusOptions: Array<'all' | CertificationStatus> = ['all', 'done', 'processing', 'failed'];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Certifications</h1>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    View certification records and monitor their lifecycle status.
                </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                        <button
                            key={option}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${statusFilter === option
                                ? 'bg-primary text-white'
                                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                            onClick={() => setStatusFilter(option)}
                            type="button"
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                    ))}
                </div>

                {isLoading && <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading certifications...</p>}

                {!isLoading && errorMessage && (
                    <div className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300">
                        {errorMessage}
                    </div>
                )}

                {!isLoading && !errorMessage && filteredCertifications.length === 0 && (
                    <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        No certifications found for this status.
                    </div>
                )}

                {!isLoading && !errorMessage && filteredCertifications.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-150">
                            <thead>
                                <tr className="text-left border-b border-zinc-200 dark:border-zinc-800">
                                    <th className="py-3 px-2 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">ID</th>
                                    <th className="py-3 px-2 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Title</th>
                                    <th className="py-3 px-2 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Candidates File</th>
                                    <th className="py-3 px-2 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Status</th>
                                    <th className="py-3 px-2 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCertifications.map((cert) => (
                                    <tr key={cert.id} className="border-b border-zinc-100 dark:border-zinc-800/70">
                                        <td className="py-4 px-2 text-sm text-zinc-600 dark:text-zinc-300">#{cert.id}</td>
                                        <td className="py-4 px-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{cert.title}</td>
                                        <td className="py-4 px-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{cert.candidateFile}</td>
                                        <td className="py-4 px-2 text-sm">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[cert.status]}`}>
                                                {cert.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-sm text-zinc-600 dark:text-zinc-300">{formatDate(cert.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}