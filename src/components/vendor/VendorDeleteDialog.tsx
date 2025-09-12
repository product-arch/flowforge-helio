import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { VendorIntegration } from '@/types/vendor-integration';
import { useToast } from '@/hooks/use-toast';

interface VendorDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  integration: VendorIntegration | null;
  onDelete: (integration: VendorIntegration) => void;
}

export const VendorDeleteDialog: React.FC<VendorDeleteDialogProps> = ({
  isOpen,
  onClose,
  integration,
  onDelete
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const expectedText = integration ? `${integration.vendor.name}/${integration.channel}` : '';
  const canDelete = confirmText === expectedText;

  const handleDelete = async () => {
    if (!integration || !canDelete) return;
    
    setDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onDelete(integration);
      
      toast({
        title: "Integration Deleted",
        description: `${integration.vendor.name} ${integration.channel} integration has been removed`,
        className: "border-status-warning bg-status-warning/10 text-status-warning"
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete integration. Please try again.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    setDeleting(false);
    onClose();
  };

  if (!integration) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Integration
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to permanently delete the integration for{' '}
              <strong>{integration.vendor.name}</strong> on the{' '}
              <strong>{integration.channel.toUpperCase()}</strong> channel.
            </p>
            
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-destructive mb-1">This action cannot be undone!</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• All configuration settings will be lost</li>
                    <li>• API credentials will be removed</li>
                    <li>• Historical test data will be deleted</li>
                    <li>• Active flows using this vendor may fail</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmText">
                Type <code className="bg-muted px-1 rounded">{expectedText}</code> to confirm:
              </Label>
              <Input
                id="confirmText"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={expectedText}
                className={confirmText && !canDelete ? 'border-destructive' : ''}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={deleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!canDelete || deleting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {deleting ? (
              <>
                <Trash2 className="w-4 h-4 mr-2 animate-pulse" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Integration
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};