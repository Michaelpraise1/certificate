import { Input } from "./ui/Input";
import { useState } from "react";
import { PlusCircle, Loader2 } from 'lucide-react';
import { createCertification, fileSrc } from "../utils/services";
import { useNavigate } from "react-router-dom";

export default function CertificateForm({ variables, certificateId }: { variables: string; certificateId: number}) {

    const navigate = useNavigate();
    const variableArray: string[] = variables.split(',');
    const defaultValues = Object.fromEntries(variableArray.map(v => [v, ""]));
    const [formData, setFormData] = useState<Record<string, string>>(defaultValues);
    const [fileUpload, setFileUpload] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);


        try {
            await createCertification({
                formData,
                doc: fileUpload as File,
                certificate_id: certificateId
            });

            navigate("/certifications")
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setIsLoading(false);
        }


    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 w-full max-w-2xl">

                {variableArray.map((v, idx) => {

                    const label = v.replaceAll("{", "").replaceAll("}", "").replaceAll("_", " ");

                    return (
                        <div key={idx}>
                            <Input
                                label={label}
                                placeholder={`Enter ${label} here`}
                                value={formData[v]}
                                onChange={e => setFormData({ ...formData, [v]: e.target.value })}
                                required
                            />
                        </div>
                    );
                })}

                <p className="text-sm text-gray-600">
                    Please download the recipient template before uploading your file.{' '}
                    <a
                        href={fileSrc('template/certifySample.csv')}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-primary underline underline-offset-2"
                    >
                        Download template
                    </a>
                </p>

                <Input
                    label="recipients"
                    type={'file'}
                    value={undefined}
                    onChange={e => setFileUpload(e.target.files?.[0] ?? null)}
                    accept={'.csv, .xlsx'}
                />


                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto flex items-center justify-center py-3 px-6 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
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
        </>
    )

}