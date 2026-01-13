import { useState } from 'react';
import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Save, Globe, Shield, TrendingUp, Users, BookOpen, FolderKanban, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

export function SettingsPage() {
  const [formData, setFormData] = useState({
    merchantUpiId: 'veerupro@upi',
  merchantName: 'Veeru\'s Pro Academy',
  siteTitle: 'Veeru\'s Pro Academy - Elite Learning Platform',
    supportEmail: 'support@veerupro.academy',
    categories: 'Web Development, Data Science, Machine Learning, Mobile Development',
  });

  const handleSave = () => {
    console.log('Save settings:', formData);
    toast.success('Settings saved successfully!');
  };

  return (
    <div>
      <PageHeader
        title="Platform Settings"
        description="Configure your Veeru's Pro Academy platform settings and preferences"
      />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Payment Settings */}
        <Card className="p-8 border-2 border-border shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Payment Settings</h2>
              <p className="text-sm text-muted-foreground">Configure UPI payment details for project purchases</p>
            </div>
          </div>
          
          <Separator className="mb-6" />

          <div className="space-y-6">
            <div>
              <Label htmlFor="merchantUpiId" className="text-foreground font-semibold">Merchant UPI ID *</Label>
              <Input
                id="merchantUpiId"
                placeholder="veerupro@upi"
                value={formData.merchantUpiId}
                onChange={(e) => setFormData({ ...formData, merchantUpiId: e.target.value })}
                className="mt-2 h-12 bg-muted border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Students will send payments to this UPI ID for project purchases
              </p>
            </div>

            <div>
              <Label htmlFor="merchantName" className="text-foreground font-semibold">Merchant Name *</Label>
              <Input
                id="merchantName"
                placeholder="Veeru's Pro Academy"
                value={formData.merchantName}
                onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                className="mt-2 h-12 bg-muted border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">
                This name will appear in payment instructions and QR codes
              </p>
            </div>
          </div>
        </Card>

        {/* Site Settings */}
        <Card className="p-8 border-2 border-border shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Site Settings</h2>
              <p className="text-sm text-muted-foreground">General platform configuration and branding</p>
            </div>
          </div>
          
          <Separator className="mb-6" />

          <div className="space-y-6">
            <div>
              <Label htmlFor="siteTitle" className="text-foreground font-semibold">Site Title *</Label>
              <Input
                id="siteTitle"
                placeholder="Veeru's Pro Academy - Elite Learning Platform"
                value={formData.siteTitle}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                className="mt-2 h-12 bg-muted border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">
                This title appears in browser tabs and search results
              </p>
            </div>

            <div>
              <Label htmlFor="supportEmail" className="text-foreground font-semibold">Support Email *</Label>
              <Input
                id="supportEmail"
                type="email"
                placeholder="support@veerupro.academy"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="mt-2 h-12 bg-muted border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Students can reach out to this email for support and inquiries
              </p>
            </div>

            <div>
              <Label htmlFor="categories" className="text-foreground font-semibold">Default Course Categories</Label>
              <Input
                id="categories"
                placeholder="Web Development, Data Science, Machine Learning"
                value={formData.categories}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                className="mt-2 h-12 bg-muted border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Comma-separated list of course categories (used in filters)
              </p>
            </div>
          </div>
        </Card>

        {/* Admin Account */}
        <Card className="p-8 border-2 border-border shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Admin Account</h2>
              <p className="text-sm text-muted-foreground">Manage your admin account settings</p>
            </div>
          </div>
          
          <Separator className="mb-6" />

          <div className="space-y-6">
            <div>
              <Label htmlFor="adminEmail" className="text-foreground font-semibold">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value="admin@veerupro.academy"
                disabled
                className="mt-2 h-12 bg-muted border-border opacity-70"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Contact support to change your admin email address
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-foreground">
                <Shield className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Platform Statistics */}
        <Card className="p-8 border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Platform Statistics</h2>
              <p className="text-sm text-muted-foreground">Overview of your platform performance</p>
            </div>
          </div>
          
          <Separator className="mb-6" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted rounded-xl border-2 border-border">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Total Students</p>
              <p className="text-2xl font-bold text-foreground">10,245</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-xl border-2 border-border">
              <BookOpen className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Active Courses</p>
              <p className="text-2xl font-bold text-success">24</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-xl border-2 border-border">
              <FolderKanban className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Projects</p>
              <p className="text-2xl font-bold text-accent">12</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-xl border-2 border-border">
              <IndianRupee className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-yellow-500">₹1,25,430</p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="h-5 w-5 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
