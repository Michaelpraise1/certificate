const url = import.meta.env.VITE_API_URL;

export const login = async (formData: { email: string; password: string }) => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}api/v1/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Failed to log in. Please check your credentials.",
    );
  }

  const data = await response.json();

  // Store token if returned
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
};

export const createCertification = async ({
  formData,
  certificate_id,
  doc,
}: {
  formData: Record<string, string>;
  certificate_id: number;
  doc: File;
}) => {
  const TOKEN = localStorage.getItem("token");
  const payload = new FormData();

  payload.append("certificate_id", String(certificate_id));
  payload.append("doc", doc);
  payload.append("certificate_data", JSON.stringify(formData));

  const request = await fetch(`${url}api/v1/certification/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: payload,
  });

  if (request.status !== 201) throw new Error(request.statusText);

  const response = await request.json();

  return response;
};

export const getCertificates = async () => {
  const token = localStorage.getItem("token");
  const request = await fetch(`${url}api/v1/certificates`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await request.json();
  return response.data;
};

export const getCertifications = async () => {};

export const imgSrc = (imageUrl: string) => {
  return `${url}${imageUrl}`;
};

export const fileSrc = (fileUrl: string) => {
  return `${url}${fileUrl}`;
};
