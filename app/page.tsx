'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ContactForm from '@/components/ContactForm';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<string>('');

  return (
    <main className="h-screen w-full flex">
      {/* Левая колонка с картой */}
      <section className="w-1/2 h-full relative">
        <Map onPlaceSelect={setSelectedPlace} />
      </section>
      
      {/* Правая колонка с формой */}
      <section className="w-1/2 h-full bg-gray-50 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <ContactForm selectedPlace={selectedPlace} />
        </div>
      </section>
    </main>
  );
} 