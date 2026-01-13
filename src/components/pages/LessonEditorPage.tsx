import { useState } from 'react';
import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Eye, Play, Youtube } from 'lucide-react';
import { Card } from '../ui/card';

interface LessonEditorPageProps {
  onNavigate: (_page: string) => void;
  lessonId?: string;
}

export function LessonEditorPage({ onNavigate, lessonId }: LessonEditorPageProps) {
  const [formData, setFormData] = useState({
    title: lessonId ? 'Introduction to Web Development' : '',
    courseId: lessonId ? '1' : '',
    youtubeUrl: lessonId ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : '',
    content: lessonId ? '# Introduction\n\nWelcome to this lesson on web development...' : '',
    order: lessonId ? '1' : '1',
    published: false,
  });

  const [showPreview, setShowPreview] = useState(false);

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(formData.youtubeUrl);

  const handleSave = () => {
    console.log('Save lesson:', formData);
    onNavigate('lessons');
  };

  const handlePublish = () => {
    console.log('Publish lesson:', { ...formData, published: true });
    onNavigate('lessons');
  };

  return (
    <div>
      <PageHeader
        title={lessonId ? 'Edit Lesson' : 'Create New Lesson'}
        description={lessonId ? 'Update lesson content and video' : 'Add a new video lesson to your course'}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('lessons')}
              className="border-border"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lessons
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="p-8 border-2 border-border">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-primary font-semibold">Lesson Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter lesson title"
                className="mt-2 h-12 bg-secondary border-border"
              />
            </div>

            <div>
              <Label htmlFor="course" className="text-primary font-semibold">Select Course *</Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => setFormData({ ...formData, courseId: value })}
              >
                <SelectTrigger className="mt-2 h-12 bg-secondary border-border">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Full Stack Web Development</SelectItem>
                  <SelectItem value="2">Machine Learning Fundamentals</SelectItem>
                  <SelectItem value="3">Mobile App Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="youtubeUrl" className="text-primary font-semibold flex items-center gap-2">
                <Youtube className="h-5 w-5 text-destructive" />
                YouTube Video URL *
              </Label>
              <Input
                id="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-2 h-12 bg-secondary border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Enter the full YouTube URL. The video will be embedded in the lesson.
              </p>
            </div>

            <div>
              <Label htmlFor="order" className="text-primary font-semibold">Lesson Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                placeholder="1"
                min="1"
                className="mt-2 h-12 bg-secondary border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Set the order of this lesson in the course.
              </p>
            </div>

            <div>
              <Label htmlFor="content" className="text-primary font-semibold">Lesson Content (Markdown)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your lesson content using Markdown..."
                rows={12}
                className="mt-2 bg-secondary border-border font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Use Markdown syntax for formatting. Code blocks, headings, lists, etc.
              </p>
            </div>

            <div className="flex items-center justify-between p-5 bg-secondary rounded-xl border-2 border-border">
              <div>
                <Label htmlFor="published" className="text-primary font-semibold">Publish Lesson</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Make this lesson visible to students
                </p>
              </div>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                onClick={handleSave}
                variant="outline"
                className="flex-1 h-12 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Save as Draft
              </Button>
              <Button
                onClick={handlePublish}
                className="flex-1 bg-success hover:bg-success/90 h-12"
              >
                <Play className="h-4 w-4 mr-2" />
                Publish Lesson
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview Section */}
        <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
          <Card className="p-8 border-2 border-primary/20 sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Live Preview</h3>
            </div>

            {/* YouTube Video Preview */}
            {embedUrl ? (
              <div className="mb-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={embedUrl}
                    title="YouTube video preview"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm text-success font-medium flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube video loaded successfully
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-6 aspect-video bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Enter a YouTube URL to preview</p>
                </div>
              </div>
            )}

            {/* Content Preview */}
            <div>
              <h4 className="font-semibold text-primary mb-4">
                {formData.title || 'Lesson Title'}
              </h4>
              <div className="prose prose-sm max-w-none">
                {formData.content.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-primary mb-3">{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-primary mb-2">{line.substring(3)}</h2>;
                  } else if (line.trim() === '') {
                    return <br key={index} />;
                  } else {
                    return <p key={index} className="text-foreground mb-2">{line}</p>;
                  }
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
