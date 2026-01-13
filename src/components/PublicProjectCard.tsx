import { FolderKanban, IndianRupee, ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface PublicProjectCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail?: string;
  onViewProject: (_id: string) => void;
}


export function PublicProjectCard({
  id: _id,
  title,
  description,
  category,
  price,
  thumbnail,
  onViewProject,
}: PublicProjectCardProps) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 shadow-[0_20px_44px_rgba(5,8,18,0.5)] transition-all">
      <div
        className="aspect-video flex items-center justify-center relative overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(226,120,168,0.18),_transparent_65%)]"
        onClick={() => onViewProject(_id)}
      >
        {thumbnail ? (
          <>
            <Image src={thumbnail} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/70 opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-16 w-16 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 shadow-[0_20px_45px_rgba(5,8,18,0.55)] flex items-center justify-center">
                <Download className="h-8 w-8 text-white" />
              </div>
            </div>
          </>
        ) : (
          <FolderKanban className="h-16 w-16 text-white/55" />
        )}
        <div className="absolute top-4 right-4">
          <div className="rounded-xl border border-white/20 bg-black/40 px-4 py-2 backdrop-blur flex items-center gap-1.5 shadow-[0_12px_26px_rgba(5,8,18,0.45)] font-semibold text-white">
            <IndianRupee className="h-5 w-5 text-primary-200" />
            <span className="text-lg text-white">{price.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="border border-white/20 bg-white/10 text-white/85">
            {category}
          </Badge>
          <Badge className="border border-success/30 bg-success/10 text-success-100">
            Ready to Download
          </Badge>
        </div>
        <h3 className="text-white font-semibold mb-3 text-lg group-hover:text-primary-200 transition-colors">
          {title}
        </h3>
        <p className="text-white/65 mb-6 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <Button
          onClick={() => onViewProject(_id)}
          className="w-full h-11 bg-gradient-to-r from-primary-600 to-primary-400 hover:from-primary-500 hover:to-primary-300"
        >
          View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
