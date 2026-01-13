import { BookOpen, Edit, Trash2, Play } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface CourseCardProps {
  id: string;
  title: string;
  category: string;
  lessonsCount: number;
  status: 'active' | 'draft';
  thumbnail?: string;
  onEdit?: (_id: string) => void;
  onDelete?: (_id: string) => void;
}

export function CourseCard({ 
  id: _id, 
  title, 
  category, 
  lessonsCount, 
  status, 
  thumbnail,
  onEdit,
  onDelete 
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-border hover:shadow-xl hover:border-primary transition-all group">
      <div className="aspect-video bg-secondary flex items-center justify-center relative overflow-hidden">
        {thumbnail ? (
          <>
            <Image src={thumbnail} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
          </>
        ) : (
          <BookOpen className="h-16 w-16 text-muted-foreground" />
        )}
        <div className="absolute top-4 right-4">
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
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">{title}</h3>
          <div className="flex items-center justify-between">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
              {category}
            </Badge>
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
              <Play className="h-4 w-4" />
              {lessonsCount} lessons
            </span>
          </div>
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
