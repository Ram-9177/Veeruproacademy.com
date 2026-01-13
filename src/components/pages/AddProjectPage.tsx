import { useState } from 'react';
import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, ArrowLeft, FolderOpen, IndianRupee, FileText, Image as ImageIcon } from 'lucide-react';
import { Card } from '../ui/card';
import { FileUpload } from '../FileUpload';

interface AddProjectPageProps {
  onNavigate: (_page: string) => void;
  projectId?: string;
}

export function AddProjectPage({ onNavigate, projectId }: AddProjectPageProps) {
  const [formData, setFormData] = useState({
    title: projectId ? 'E-commerce Dashboard' : '',
    category: projectId ? 'web-development' : '',
    price: projectId ? '2499' : '',
    driveFileId: projectId ? '1A2B3C4D5E6F7G8H9I0J' : '',
    description: projectId ? 'A complete e-commerce admin dashboard with product management, order tracking, customer analytics, and payment integration. Built with React, Node.js, and MongoDB.' : '',
    published: projectId ? true : false,
  });

  const [_thumbnail, setThumbnail] = useState<File | null>(null);

  const handleSave = () => {
    console.log('Save project:', formData);
    onNavigate('projects');
  };

  const handlePublish = () => {
    console.log('Publish project:', { ...formData, published: true });
    onNavigate('projects');
  };

  return (
    <div>
      <PageHeader
        title={projectId ? 'Edit Project' : 'Add New BTech Project'}
        description={projectId ? 'Update project details and files' : 'Create a new downloadable project for students'}
        action={
          <Button
            variant="outline"
            onClick={() => onNavigate('projects')}
            className="border-border"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        }
      />

      <div className="max-w-5xl mx-auto">
        <Card className="p-8 border-2 border-border">
          <div className="space-y-8">
            {/* Project Title */}
            <div>
              <Label htmlFor="title" className="text-primary font-semibold">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="E-commerce Platform with Admin Panel"
                className="mt-2 h-12 bg-secondary border-border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-primary font-semibold">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-2 h-12 bg-secondary border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="machine-learning">Machine Learning</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="iot">IoT & Embedded Systems</SelectItem>
                    <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="text-primary font-semibold flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-accent" />
                  Price (INR) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="2999"
                  min="0"
                  className="mt-2 h-12 bg-secondary border-border"
                />
              </div>
            </div>

            {/* Google Drive File ID */}
            <div>
              <Label htmlFor="driveFileId" className="text-primary font-semibold flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-success" />
                Google Drive File ID *
              </Label>
              <Input
                id="driveFileId"
                value={formData.driveFileId}
                onChange={(e) => setFormData({ ...formData, driveFileId: e.target.value })}
                placeholder="1A2B3C4D5E6F7G8H9I0J"
                className="mt-2 h-12 bg-secondary border-border font-mono"
              />
              <div className="mt-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-sm text-success font-medium mb-2">How to get Google Drive File ID:</p>
                <ol className="text-sm text-foreground space-y-1 ml-4 list-decimal">
                  <li>Upload your project ZIP file to Google Drive</li>
                  <li>Right-click the file and select &quot;Get link&quot;</li>
                  <li>Set sharing to &quot;Anyone with the link&quot;</li>
                  <li>Copy the file ID from the URL (between /d/ and /view)</li>
                  <li>Example: https://drive.google.com/file/d/<strong className="text-success">FILE_ID_HERE</strong>/view</li>
                </ol>
              </div>
            </div>

            {/* Preview Image Upload */}
            <div>
              <Label className="text-primary font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Project Preview Image
              </Label>
              <div className="mt-2">
                <FileUpload
                  onFileSelect={(file) => setThumbnail(file)}
                  accept="image/*"
                  label="Upload project preview image (JPG, PNG)"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-primary font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the project features, technologies used, and what students will learn..."
                rows={8}
                className="mt-2 bg-secondary border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Provide a detailed description including features, tech stack, and project highlights.
              </p>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-6 bg-secondary rounded-xl border-2 border-border">
              <div>
                <Label htmlFor="published" className="text-primary font-semibold">Publish Project</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Make this project visible in the marketplace
                </p>
              </div>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
            </div>

            {/* Project Info Card */}
            <Card className="p-6 bg-white border border-border shadow-sm">
              <h4 className="font-semibold text-primary mb-3">Project Submission Guidelines</h4>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Include complete source code with proper folder structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Add README.md with setup instructions and features list</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Include database schema or SQL files if applicable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <span>Provide documentation for API endpoints and configurations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <span>Test the project thoroughly before uploading</span>
                </li>
              </ul>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Button
                onClick={handleSave}
                variant="outline"
                className="flex-1 h-12 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Save as Draft
              </Button>
              <Button
                onClick={handlePublish}
                className="flex-1 bg-accent hover:bg-accent/90 h-12"
              >
                <Upload className="h-4 w-4 mr-2" />
                Publish Project
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
