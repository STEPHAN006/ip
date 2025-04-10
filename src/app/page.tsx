'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchForm from './components/SearchForm';

// Import dynamique de la carte pour éviter les erreurs SSR
const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <p>Chargement de la carte...</p>
});

interface LocationData {
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  isp: string;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const handleSearch = async (ip: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/geolocate?ip=${encodeURIComponent(ip)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la recherche');
      }

      setLocationData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Géolocalisation par IP
        </h1>

        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {locationData && (
          <div className="mt-8 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Informations de localisation</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Pays</p>
                  <p className="font-medium">{locationData.country}</p>
                </div>
                <div>
                  <p className="text-gray-600">Région</p>
                  <p className="font-medium">{locationData.region}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ville</p>
                  <p className="font-medium">{locationData.city}</p>
                </div>
                <div>
                  <p className="text-gray-600">Fournisseur</p>
                  <p className="font-medium">{locationData.isp}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Carte</h2>
              <Map
                latitude={locationData.latitude}
                longitude={locationData.longitude}
                city={locationData.city}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
