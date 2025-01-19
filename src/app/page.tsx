import Image from 'next/image';
import HeroCard from '@/components/HeroCard';
import UniteCard from '@/components/UniteCard';
import { Armee, Hero, Unite } from '@/types';

const renderRichText = (content: any[]) => {
  if (!content || !Array.isArray(content)) return '';
  return content.map((block) => 
    block.children.map((child: any) => child.text).join('')
  ).join('\n');
};

async function getData() {
  try {
    console.log('Fetching data from APIs...');
    
    const [armeeRes, herosRes, unitesRes] = await Promise.all([
      fetch('http://localhost:1337/api/armees?populate=*', { cache: 'no-store' }),
      fetch('http://localhost:1337/api/heros?populate=*', { cache: 'no-store' }),
      fetch('http://localhost:1337/api/unites?populate=*', { cache: 'no-store' })
    ]);

    console.log('API Response status:', {
      armeeRes: armeeRes.status,
      herosRes: herosRes.status,
      unitesRes: unitesRes.status
    });

    if (!armeeRes.ok || !herosRes.ok || !unitesRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const [armeeData, herosData, unitesData] = await Promise.all([
      armeeRes.json(),
      herosRes.json(),
      unitesRes.json()
    ]);

    console.log('Raw Armée data:', JSON.stringify(armeeData, null, 2));
    console.log('Raw Héros data:', JSON.stringify(herosData, null, 2));
    console.log('Raw Unités data:', JSON.stringify(unitesData, null, 2));

    const firstArmee = armeeData.data[0];
    const armee = firstArmee ? {
      id: firstArmee.id,
      nom: firstArmee.Nom,
      description: firstArmee.Description || [],
      image: firstArmee.Image?.[0] || null
    } : null;

    console.log('Processed Armée data:', armee);

    const heros = herosData.data.map((hero: any) => ({
      id: hero.id,
      nom: hero.Nom,
      titre: hero.Titre,
      description: hero.Description || [],
      image: hero.Image?.[0] || null
    }));

    const unites = unitesData.data.map((unite: any) => ({
      id: unite.id,
      nom: unite.Nom,
      type: unite.Type,
      roles: unite.Roles,
      equipement: unite.Equipement,
      image: unite.Image?.[0] || null
    }));

    return {
      armee: armee ? 'exists' : 'not-found',
      herosCount: heros.length,
      unitesCount: unites.length,
      armee_data: armee,
      heros,
      unites
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative h-[500px] rounded-lg overflow-hidden mb-16">
          {data.armee_data?.image?.url ? (
            <>
              <Image
                src={`http://localhost:1337${data.armee_data.image.url}`}
                alt={data.armee_data.nom}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
            </>
          ) : null}
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-5xl font-bold mb-4 text-amber-500">
              {data.armee_data?.nom}
            </h1>
            <div className="prose prose-invert max-w-3xl">
              {renderRichText(data.armee_data?.description)}
            </div>
          </div>
        </div>

        {/* Heroes Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-amber-500 mb-8">Héros Légendaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.heros?.map((hero) => (
              <HeroCard key={hero.id} hero={hero} />
            ))}
          </div>
        </section>

        {/* Units Section */}
        <section>
          <h2 className="text-3xl font-bold text-amber-500 mb-8">Unités d'Élite</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.unites?.map((unite) => (
              <UniteCard key={unite.id} unite={unite} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
