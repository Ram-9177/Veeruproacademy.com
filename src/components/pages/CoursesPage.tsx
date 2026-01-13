import { useState } from 'react';
import { PageHeader } from '../PageHeader';
import { CourseCard } from '../CourseCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

interface Course {
  id: string;
  title: string;
  category: string;
  lessonsCount: number;
  status: 'active' | 'draft';
  slug: string;
}

interface CoursesPageProps {
  onNavigate: (_page: string, _courseId?: string) => void;
}

export function CoursesPage({ onNavigate }: CoursesPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const courses: Course[] = [
    { id: '1', title: 'Web Development Bootcamp', category: 'Development', lessonsCount: 24, status: 'active', slug: 'web-dev-bootcamp' },
    { id: '2', title: 'Advanced React Patterns', category: 'Development', lessonsCount: 18, status: 'active', slug: 'advanced-react' },
    { id: '3', title: 'Python for Data Science', category: 'Data Science', lessonsCount: 32, status: 'active', slug: 'python-data-science' },
    { id: '4', title: 'UI/UX Design Fundamentals', category: 'Design', lessonsCount: 16, status: 'draft', slug: 'uiux-fundamentals' },
    { id: '5', title: 'Digital Marketing Mastery', category: 'Marketing', lessonsCount: 22, status: 'active', slug: 'digital-marketing' },
    { id: '6', title: 'Mobile App Development', category: 'Development', lessonsCount: 28, status: 'draft', slug: 'mobile-app-dev' },
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <PageHeader
        title="Courses Management"
        description="Manage all your courses and their content"
        action={
          <Button
            onClick={() => onNavigate('add-course')}
            className="bg-[#F77F00] hover:bg-[#F7A200] text-white rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Search and View Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9E4EC] p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0B3F78]/40" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#F5F7FA] border-[#D9E4EC]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-[#F5F7FA]' : ''}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'bg-[#F5F7FA]' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                onEdit={(id) => onNavigate('edit-course', id)}
                onDelete={(id) => console.log('Delete course:', id)}
              />
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-sm border border-[#D9E4EC] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F5F7FA]">
                  <TableHead>Course Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="text-[#0B3F78]">{course.title}</p>
                        <p className="text-[#0B3F78]/60">/{course.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.lessonsCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={course.status === 'active' ? 'default' : 'secondary'}
                        className={course.status === 'active' ? 'bg-green-500' : 'bg-[#D9E4EC] text-[#0B3F78]'}
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onNavigate('edit-course', course.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log('Delete:', course.id)}
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-[#0B3F78]/60">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-[#0D4C92] text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
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
