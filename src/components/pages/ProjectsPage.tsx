import { useState } from 'react';
import { PageHeader } from '../PageHeader';
import { ProjectCard } from '../ProjectCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

interface Project {
  id: string;
  title: string;
  category: string;
  price: number;
  fileId: string;
  status: 'active' | 'draft';
}

interface ProjectsPageProps {
  onNavigate: (_page: string, _projectId?: string) => void;
}

export function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const projects: Project[] = [
    { id: '1', title: 'E-commerce Dashboard', category: 'Web Development', price: 2499, fileId: 'abc123def', status: 'active' },
    { id: '2', title: 'Social Media App UI', category: 'UI/UX Design', price: 1999, fileId: 'xyz789ghi', status: 'active' },
    { id: '3', title: 'Inventory Management System', category: 'Full Stack', price: 3499, fileId: 'mno456pqr', status: 'active' },
    { id: '4', title: 'Portfolio Website Template', category: 'Web Design', price: 999, fileId: 'stu123vwx', status: 'draft' },
    { id: '5', title: 'Task Manager Application', category: 'Web Development', price: 1799, fileId: 'def456ghi', status: 'active' },
    { id: '6', title: 'Blog CMS Platform', category: 'Full Stack', price: 2999, fileId: 'jkl789mno', status: 'draft' },
  ];

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Projects Management"
        description="Manage downloadable projects and resources"
        action={
          <Button
            onClick={() => onNavigate('add-project')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Search and View Controls */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted border-border"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-muted' : ''}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'bg-muted' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                {...project}
                onEdit={(id) => onNavigate('add-project', id)}
                onDelete={(id) => console.log('Delete project:', id)}
              />
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted border-b-border">
                  <TableHead>Project Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price (INR)</TableHead>
                  <TableHead>File ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="border-b-border">
                    <TableCell>
                      <p className="text-foreground">{project.title}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{project.category}</TableCell>
                    <TableCell className="text-primary">₹{project.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded text-foreground">
                        {project.fileId}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={project.status === 'active' ? 'default' : 'secondary'}
                        className={project.status === 'active' ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground'}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onNavigate('add-project', project.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log('Delete:', project.id)}
                          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
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
          <p className="text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
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
