// src/app/admin/car/[id]/page.tsx

import CarAddEdit from "@/components/car/CarAddEdit"; // <-- Updated path

interface CarAddEditPageProps {
  params: {
    id: string; // Will be either 'add' or a specific car ID
  };
}

export default function AdminCarAddEditPage({ params }: CarAddEditPageProps) {
  return <CarAddEdit params={params} />;
}