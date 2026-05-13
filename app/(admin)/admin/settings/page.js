'use client';

import { useState } from 'react';
import { useUser, useUserMutations } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save, User, Lock, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { data: user, isLoading: loadingUser } = useUser();
  const { updateProfile, isUpdating } = useUserMutations();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (!formData.password) {
      toast.error('Current password is required to save changes');
      return;
    }

    try {
      await updateProfile({
        email: formData.email,
        password: formData.password,
        newPassword: formData.newPassword || undefined,
      });
      toast.success('Profile updated successfully');
      setFormData(prev => ({ ...prev, password: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-1">Manage your admin profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4" />
              Security First
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We recommend changing your password every 90 days. Always use a strong, unique password for your admin account.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2 text-sm">
              Account Info
            </h3>
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Role</div>
              <div className="text-xs font-semibold text-slate-700 bg-white px-2 py-1 rounded border border-slate-100 inline-block">Super Admin</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your login email address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@clickmasters.com"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Security & Password
                </CardTitle>
                <CardDescription>Change your password or leave blank to keep current.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="��������"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="��������"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <Label htmlFor="password">Current Password <span className="text-red-500">*</span></Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Required to save changes"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary text-accent hover:bg-primary/90 min-w-37.5"
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
