import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/types';

interface HeroCardProps {
  hero: Hero;
}

export default function HeroCard({ hero }: HeroCardProps) {
  const renderRichText = (content: any[]) => {
    if (!content || !Array.isArray(content)) return '';
    return content.map((block) => 
      block.children.map((child: any) => child.text).join('')
    ).join('\n');
  };

  return (
    <Link href={`/heros/${hero.id}`} className="block transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-amber-900/30 hover:border-amber-600/50 shadow-lg relative">
        {/* Effet de lueur */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/0 to-amber-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative h-64">
          {hero.image?.url ? (
            <Image
              src={`http://localhost:1337${hero.image.url}`}
              alt={hero.nom}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <p className="text-gray-400">Aucune image</p>
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>

        <div className="p-6 relative z-10">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-amber-500 mb-1">{hero.nom}</h3>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{hero.titre}</p>
            <p className="text-gray-300 text-sm line-clamp-3 mt-2">
              {renderRichText(hero.description)}
            </p>
          </div>
          
          {/* Bouton stylisé */}
          <div className="mt-4 text-right">
            <span className="inline-block px-4 py-2 text-sm text-amber-500 border border-amber-900/50 rounded hover:bg-amber-900/20 transition-colors duration-300">
              Voir le profil
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
