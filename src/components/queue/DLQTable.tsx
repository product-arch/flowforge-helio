import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DLQMessage } from '@/types/queue-dashboard';
import { RotateCcw, Trash2, RotateCcw as ReplayAll, Trash as PurgeAll, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DLQTableProps {
  messages: DLQMessage[];
  selectedFilter: string | null;
  onReplayMessage: (messageId: string) => void;
  onDiscardMessage: (messageId: string) => void;
  onReplayAll: () => void;
  onPurgeAll: () => void;
}

const DLQTable: React.FC<DLQTableProps> = ({
  messages,
  selectedFilter,
  onReplayMessage,
  onDiscardMessage,
  onReplayAll,
  onPurgeAll
}) => {
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [showReplayDialog, setShowReplayDialog] = useState<{ show: boolean; messageId?: string; type: 'single' | 'all' | 'selected' }>({ show: false, type: 'single' });
  const [showDiscardDialog, setShowDiscardDialog] = useState<{ show: boolean; messageId?: string; type: 'single' | 'selected' }>({ show: false, type: 'single' });
  const [showPurgeDialog, setShowPurgeDialog] = useState(false);
  const { toast } = useToast();

  const filteredMessages = selectedFilter 
    ? messages.filter(msg => msg.errorCode.toLowerCase().includes(selectedFilter.toLowerCase().replace(' ', '_')))
    : messages;

  const handleSelectMessage = (messageId: string, checked: boolean) => {
    const newSelected = new Set(selectedMessages);
    if (checked) {
      newSelected.add(messageId);
    } else {
      newSelected.delete(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMessages(new Set(filteredMessages.map(msg => msg.id)));
    } else {
      setSelectedMessages(new Set());
    }
  };

  const handleReplayConfirm = () => {
    if (showReplayDialog.type === 'single' && showReplayDialog.messageId) {
      onReplayMessage(showReplayDialog.messageId);
      toast({
        title: "Message Replayed",
        description: "Message has been moved back to the queue for processing",
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    } else if (showReplayDialog.type === 'all') {
      onReplayAll();
      toast({
        title: "All Messages Replayed",
        description: `${filteredMessages.length} messages have been moved back to the queue`,
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    } else if (showReplayDialog.type === 'selected') {
      selectedMessages.forEach(id => onReplayMessage(id));
      toast({
        title: "Selected Messages Replayed",
        description: `${selectedMessages.size} messages have been moved back to the queue`,
        className: "border-status-success bg-status-success/10 text-status-success"
      });
      setSelectedMessages(new Set());
    }
    setShowReplayDialog({ show: false, type: 'single' });
  };

  const handleDiscardConfirm = () => {
    if (showDiscardDialog.type === 'single' && showDiscardDialog.messageId) {
      onDiscardMessage(showDiscardDialog.messageId);
      toast({
        title: "Message Discarded",
        description: "Message has been permanently removed from the DLQ",
        className: "border-status-warning bg-status-warning/10 text-status-warning"
      });
    } else if (showDiscardDialog.type === 'selected') {
      selectedMessages.forEach(id => onDiscardMessage(id));
      toast({
        title: "Selected Messages Discarded",
        description: `${selectedMessages.size} messages have been permanently removed`,
        className: "border-status-warning bg-status-warning/10 text-status-warning"
      });
      setSelectedMessages(new Set());
    }
    setShowDiscardDialog({ show: false, type: 'single' });
  };

  const handlePurgeConfirm = () => {
    onPurgeAll();
    setSelectedMessages(new Set());
    toast({
      title: "DLQ Purged",
      description: "All dead letter messages have been permanently removed",
      className: "border-status-error bg-status-error/10 text-status-error"
    });
    setShowPurgeDialog(false);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString('en-US', { hour12: false });
  };

  const getErrorBadgeVariant = (errorCode: string) => {
    if (errorCode.includes('TIMEOUT')) return 'destructive';
    if (errorCode.includes('RATE_LIMIT')) return 'secondary';
    if (errorCode.includes('AUTH')) return 'outline';
    return 'default';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Dead Letter Queue
              {selectedFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  {selectedFilter}
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''} in DLQ
              {selectedMessages.size > 0 && ` (${selectedMessages.size} selected)`}
            </p>
          </div>
          <div className="flex gap-2">
            {selectedMessages.size > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReplayDialog({ show: true, type: 'selected' })}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Replay Selected
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDiscardDialog({ show: true, type: 'selected' })}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Discard Selected
                </Button>
              </>
            )}
            {filteredMessages.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReplayDialog({ show: true, type: 'all' })}
                >
                  <ReplayAll className="w-4 h-4 mr-1" />
                  Replay All
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setShowPurgeDialog(true)}
                >
                  <PurgeAll className="w-4 h-4 mr-1" />
                  Purge All
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {selectedFilter ? `No messages found matching filter: ${selectedFilter}` : 'No messages in DLQ'}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedMessages.size === filteredMessages.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all messages"
                    />
                  </TableHead>
                  <TableHead>Message ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Retries</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedMessages.has(message.id)}
                        onCheckedChange={(checked) => handleSelectMessage(message.id, checked as boolean)}
                        aria-label={`Select message ${message.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{message.id}</TableCell>
                    <TableCell className="text-sm">{formatTimestamp(message.timestamp)}</TableCell>
                    <TableCell>
                      <Badge variant={getErrorBadgeVariant(message.errorCode)}>
                        {message.errorCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{message.retryCount}</TableCell>
                    <TableCell>{message.lastAttemptVendor}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{message.originalChannel}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowReplayDialog({ show: true, messageId: message.id, type: 'single' })}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDiscardDialog({ show: true, messageId: message.id, type: 'single' })}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Replay Confirmation Dialog */}
      <AlertDialog open={showReplayDialog.show} onOpenChange={(open) => setShowReplayDialog({ ...showReplayDialog, show: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replay Message{showReplayDialog.type !== 'single' ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              {showReplayDialog.type === 'single' 
                ? `Replay message ${showReplayDialog.messageId}? This will move it back to the pending queue for processing.`
                : showReplayDialog.type === 'all'
                ? `Replay all ${filteredMessages.length} messages? This may impact queue load and processing times.`
                : `Replay ${selectedMessages.size} selected messages? This may impact queue load and processing times.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReplayConfirm}>
              Replay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog.show} onOpenChange={(open) => setShowDiscardDialog({ ...showDiscardDialog, show: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Message{showDiscardDialog.type !== 'single' ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              {showDiscardDialog.type === 'single'
                ? `Permanently discard message ${showDiscardDialog.messageId}? This action cannot be undone.`
                : `Permanently discard ${selectedMessages.size} selected messages? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardConfirm} className="bg-destructive text-destructive-foreground">
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Purge All Confirmation Dialog */}
      <AlertDialog open={showPurgeDialog} onOpenChange={setShowPurgeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Purge All Messages?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {filteredMessages.length} messages from the Dead Letter Queue. 
              This action cannot be undone. Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePurgeConfirm} className="bg-destructive text-destructive-foreground">
              Purge All Messages
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default DLQTable;