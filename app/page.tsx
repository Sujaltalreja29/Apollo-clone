import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/header";
import DoctorListing from "@/components/doctor-listing";

export const metadata: Metadata = {
  title: "General Physician & Internal Medicine Specialists | Apollo 247",
  description:
    "Consult with top general physicians and internal medicine specialists. Book appointments online with experienced doctors.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={<div>Loading doctors...</div>}>
        <DoctorListing />
      </Suspense>
    </main>
  );
}
