import Image from 'next/image';
import Link from 'next/link';
import { Unite } from '@/types';

interface UniteCardProps {
  unite: Unite;
}

export default function UniteCard({ unite }: UniteCardProps) {
  return (
    <Link href={`/unites/${unite.id}`} className="block transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-amber-900/30 hover:border-amber-600/50 shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/0 to-amber-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative h-64">
          {unite.image?.url ? (
            <Image
              src={`http://localhost:1337${unite.image.url}`}
              alt={unite.nom}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <p className="text-gray-400">Aucune image</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>

        <div className="p-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-amber-500">{unite.nom}</h3>
              <span className="px-3 py-1 bg-amber-900/30 text-amber-400 text-sm rounded-full">
                {unite.type}
              </span>
            </div>
            <p className="text-gray-300 text-sm line-clamp-3">
              {unite.roles}
            </p>
          </div>
          
          <div className="mt-4 text-right">
            <span className="inline-block px-4 py-2 text-sm text-amber-500 border border-amber-900/50 rounded hover:bg-amber-900/20 transition-colors duration-300">
              Voir les détails
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
