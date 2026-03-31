export async function fetchBootstrap() {
  const response = await fetch("/api/bootstrap");
  if (!response.ok) {
    throw new Error("Unable to load dashboard data");
  }

  return response.json();
}

export async function fetchPatient(id) {
  const response = await fetch(`/api/patients/${id}`);
  if (!response.ok) {
    throw new Error("Unable to load patient record");
  }

  return response.json();
}
