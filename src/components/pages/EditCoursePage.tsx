import { useState } from 'react';
import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, ArrowLeft, Plus, Edit, Trash2, GripVertical } from 'lucide-react';

interface EditCoursePageProps {
  onNavigate: (_page: string, _lessonId?: string) => void;
  courseId?: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  published: boolean;
}

export function EditCoursePage({ onNavigate, courseId: _courseId }: EditCoursePageProps) {
  const [formData, setFormData] = useState({
    title: 'Web Development Bootcamp',
    slug: 'web-development-bootcamp',
    description: 'Learn full-stack web development from scratch',
    category: 'development',
    published: true,
  });

  const [lessons] = useState<Lesson[]>([
    { id: '1', title: 'Introduction to Web Development', duration: '12:45', published: true },
    { id: '2', title: 'HTML Fundamentals', duration: '18:20', published: true },
    { id: '3', title: 'CSS Styling Basics', duration: '22:15', published: true },
    { id: '4', title: 'JavaScript Essentials', duration: '25:30', published: false },
  ]);

  const handleSave = () => {
    console.log('Update course:', formData);
    onNavigate('courses');
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Edit Course"
        description="Update course details and manage lessons"
        action={
          <Button
            variant="outline"
            onClick={() => onNavigate('courses')}
            className="border-border"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        }
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        {/* Course Details Form */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 mb-6">
          <h2 className="text-foreground mb-6">Course Details</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-muted border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Course Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">smru.in/courses/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-muted border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Course Thumbnail</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted hover:bg-background transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-muted-foreground">PNG, JPG or WEBP (max. 2MB)</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 px-5 bg-muted rounded-lg">
              <div>
                <Label>Publish Course</Label>
                <p className="text-muted-foreground">Make this course visible to students</p>
              </div>
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground">Course Lessons</h2>
            <Button
              onClick={() => onNavigate('lesson-editor')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-background transition-colors"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                <div className="flex-1">
                  <p className="text-foreground">{lesson.title}</p>
                  <p className="text-muted-foreground">{lesson.duration}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full ${lesson.published ? 'bg-success/10 text-success' : 'bg-secondary text-secondary-foreground'}`}>
                    {lesson.published ? 'Published' : 'Draft'}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigate('lesson-editor', lesson.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
