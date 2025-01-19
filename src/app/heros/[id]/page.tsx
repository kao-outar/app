import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const renderRichText = (content: any[]) => {
  if (!content || !Array.isArray(content)) return '';
  return content.map((block) => 
    block.children.map((child: any) => child.text).join('')
  ).join('\n');
};

async function getHeroData(id: string) {
  try {
    console.log('Fetching hero data for ID:', id);
    const res = await fetch(
      `http://localhost:1337/api/Heros?filters[id][$eq]=${id}&populate=*`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch hero');
    }

    const data = await res.json();
    console.log('Hero data:', data);

    if (!data.data || data.data.length === 0) return null;

    const heroData = data.data[0];
    const hero = {
      id: heroData.id,
      nom: heroData.Nom,
      titre: heroData.Titre,
      description: heroData.Description || [],
      image: heroData.Image?.[0] || null
    };

    console.log('Processed hero data:', hero);
    return hero;
  } catch (error) {
    console.error('Error fetching hero:', error);
    throw error;
  }
}

export default async function HeroPage({ params }: { params: { id: string } }) {
  try {
    const hero = await getHeroData(params.id);

    if (!hero) {
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

          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            <div className="relative h-[400px] md:h-[600px]">
              {hero.image?.url ? (
                <>
                  <Image
                    src={`http://localhost:1337${hero.image.url}`}
                    alt={hero.nom}
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

            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-amber-500 mb-4">
                  {hero.nom}
                </h1>
                <p className="text-xl text-amber-400/80 mb-8">{hero.titre}</p>
                <div className="prose prose-lg prose-invert">
                  {renderRichText(hero.description)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in HeroPage:', error);
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
              Une erreur est survenue lors du chargement des données du héros. Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
      </main>
    );
  }
}
