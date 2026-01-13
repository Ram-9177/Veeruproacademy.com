import { FolderKanban, Edit, Trash2, IndianRupee } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  status: 'active' | 'draft';
  thumbnail?: string;
  onEdit?: (_id: string) => void;
  onDelete?: (_id: string) => void;
}

export function ProjectCard({ 
  id: _id, 
  title, 
  category, 
  price, 
  status, 
  thumbnail,
  onEdit,
  onDelete 
}: ProjectCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-border hover:shadow-xl hover:border-accent transition-all group">
      <div className="aspect-video bg-secondary flex items-center justify-center relative overflow-hidden">
        {thumbnail ? (
          <>
            <Image src={thumbnail} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
          </>
        ) : (
          <FolderKanban className="h-16 w-16 text-muted-foreground" />
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge 
            variant={status === 'active' ? 'default' : 'secondary'}
            className={status === 'active' 
              ? 'bg-success hover:bg-success text-white shadow-lg' 
              : 'bg-warning/80 hover:bg-warning text-white shadow-lg'
            }
          >
            {status}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-accent/95 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg font-semibold">
            <IndianRupee className="h-5 w-5" />
            <span className="text-lg">{price.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">{title}</h3>
          <Badge className="bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20">
            {category}
          </Badge>
        </div>
        
        <div className="flex gap-2 pt-4 border-t-2 border-border">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit?.(_id)}
            className="flex-1 border-primary text-primary hover:bg-primary hover:text-white h-10"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete?.(_id)}
            className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white h-10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
