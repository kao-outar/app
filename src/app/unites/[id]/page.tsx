import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getUniteData(id: string) {
  try {
    console.log('Fetching unit data for ID:', id);
    const res = await fetch(
      `http://localhost:1337/api/Unites?filters[id][$eq]=${id}&populate=*`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch unit');
    }

    const data = await res.json();
    console.log('Unite data:', data);

    if (!data.data || data.data.length === 0) return null;

    const uniteData = data.data[0];
    const unite = {
      id: uniteData.id,
      nom: uniteData.Nom,
      type: uniteData.Type,
      roles: uniteData.Roles,
      equipement: uniteData.Equipement,
      image: uniteData.Image?.[0] || null
    };

    console.log('Processed unit data:', unite);
    return unite;
  } catch (error) {
    console.error('Error fetching unit:', error);
    throw error;
  }
}

export default async function UnitePage({ params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const unite = await getUniteData(id);

    if (!unite) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <Link 
            href="/" 
            className="inline-block mb-8 text-amber-500 hover:text-amber-400 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-amber-900/30">
            <div className="relative h-[400px] md:h-[600px]">
              {unite.image?.url ? (
                <>
                  <Image
                    src={`http://localhost:1337${unite.image.url}`}
                    alt={unite.nom}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
                </>
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-400">Aucune image disponible</p>
                </div>
              )}
            </div>

            <div className="p-8 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-900/0 via-amber-600/50 to-amber-900/0" />
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-4xl md:text-5xl font-bold text-amber-500">
                    {unite.nom}
                  </h1>
                  <span className="px-4 py-2 bg-amber-900/30 text-amber-400 rounded-full text-sm">
                    {unite.type}
                  </span>
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-amber-400 mb-3">Rôles sur le champ de bataille</h2>
                    <p className="text-gray-300">{unite.roles}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-amber-400 mb-3">Arsenal de guerre</h2>
                    <div className="text-gray-300 whitespace-pre-line">
                      {unite.equipement}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in UnitePage:', error);
    return (
      <main className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <Link 
            href="/" 
            className="inline-block mb-8 text-amber-500 hover:text-amber-400 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
          <div className="bg-gray-800 rounded-lg p-8 border border-red-900/30">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Erreur</h1>
            <p className="text-gray-300">
              Une erreur est survenue lors du chargement des données de l'unité. Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
      </main>
    );
  }
}
