import { useState } from 'react';
import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, ArrowLeft } from 'lucide-react';

interface AddCoursePageProps {
  onNavigate: (_page: string) => void;
  courseId?: string;
}

export function AddCoursePage({ onNavigate, courseId }: AddCoursePageProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    published: false,
  });

  const handleSave = () => {
    console.log('Save course:', formData);
    onNavigate('courses');
  };

  const handlePublish = () => {
    console.log('Publish course:', { ...formData, published: true });
    onNavigate('courses');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <PageHeader
        title={courseId ? 'Edit Course' : 'Add New Course'}
        description={courseId ? 'Update course details' : 'Create a new course for your platform'}
        action={
          <Button
            variant="outline"
            onClick={() => onNavigate('courses')}
            className="border-[#D9E4EC]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        }
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-[#D9E4EC] p-8">
          <div className="space-y-6">
            {/* Course Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Web Development Bootcamp"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-[#F5F7FA] border-[#D9E4EC]"
              />
            </div>

            {/* Course Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Course Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-[#0B3F78]/60">smru.in/courses/</span>
                <Input
                  id="slug"
                  placeholder="web-development-bootcamp"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-[#F5F7FA] border-[#D9E4EC]"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-[#F5F7FA] border-[#D9E4EC]">
                  <SelectValue placeholder="Select a category" />
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

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                placeholder="A brief description of what students will learn..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-[#F5F7FA] border-[#D9E4EC]"
              />
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label>Course Thumbnail</Label>
              <div className="border-2 border-dashed border-[#D9E4EC] rounded-lg p-8 text-center bg-[#F5F7FA] hover:bg-white transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-[#0B3F78]/40 mx-auto mb-3" />
                <p className="text-[#0B3F78] mb-1">Click to upload or drag and drop</p>
                <p className="text-[#0B3F78]/60">PNG, JPG or WEBP (max. 2MB)</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between py-4 px-5 bg-[#F5F7FA] rounded-lg">
              <div>
                <Label>Publish Course</Label>
                <p className="text-[#0B3F78]/60">Make this course visible to students</p>
              </div>
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-[#D9E4EC]">
            <Button
              onClick={handleSave}
              variant="outline"
              className="flex-1 border-[#D9E4EC]"
            >
              Save as Draft
            </Button>
            <Button
              onClick={handlePublish}
              className="flex-1 bg-[#F77F00] hover:bg-[#F7A200] text-white"
            >
              {formData.published ? 'Update & Publish' : 'Publish Course'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
