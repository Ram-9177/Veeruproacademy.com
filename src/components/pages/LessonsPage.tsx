import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Play } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

interface Lesson {
  id: string;
  title: string;
  course: string;
  duration: string;
  status: 'published' | 'draft';
  views: number;
}

export function LessonsPage() {
  const lessons: Lesson[] = [
    { id: '1', title: 'Introduction to Web Development', course: 'Web Development Bootcamp', duration: '12:45', status: 'published', views: 245 },
    { id: '2', title: 'HTML Fundamentals', course: 'Web Development Bootcamp', duration: '18:20', status: 'published', views: 198 },
    { id: '3', title: 'CSS Styling Basics', course: 'Web Development Bootcamp', duration: '22:15', status: 'published', views: 176 },
    { id: '4', title: 'React Hooks Deep Dive', course: 'Advanced React Patterns', duration: '25:30', status: 'published', views: 142 },
    { id: '5', title: 'State Management', course: 'Advanced React Patterns', duration: '20:10', status: 'draft', views: 0 },
    { id: '6', title: 'Python Basics', course: 'Python for Data Science', duration: '15:45', status: 'published', views: 234 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <PageHeader
        title="All Lessons"
        description="View and manage all lessons across courses"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9E4EC] p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0B3F78]/40" />
            <Input
              placeholder="Search lessons..."
              className="pl-10 bg-[#F5F7FA] border-[#D9E4EC]"
            />
          </div>
        </div>

        {/* Lessons Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9E4EC] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F7FA]">
                <TableHead>Lesson Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-[#F5F7FA] p-2 rounded">
                        <Play className="h-4 w-4 text-[#0D4C92]" />
                      </div>
                      <span className="text-[#0B3F78]">{lesson.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#0B3F78]/60">{lesson.course}</TableCell>
                  <TableCell>{lesson.duration}</TableCell>
                  <TableCell>{lesson.views.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={lesson.status === 'published' ? 'default' : 'secondary'}
                      className={lesson.status === 'published' ? 'bg-green-500' : 'bg-[#D9E4EC] text-[#0B3F78]'}
                    >
                      {lesson.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-[#0B3F78]/60">
            Showing {lessons.length} lessons
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-[#0D4C92] text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
