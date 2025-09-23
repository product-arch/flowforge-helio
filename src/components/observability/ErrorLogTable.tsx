import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertTriangle, MoreHorizontal, Eye, Download, Check } from 'lucide-react';
import { DatabaseError } from '@/types/observability';

interface ErrorLogTableProps {
  errors: (DatabaseError | any)[];
  onErrorClick: (error: any) => void;
}

export const ErrorLogTable: React.FC<ErrorLogTableProps> = ({
  errors,
  onErrorClick
}) => {
  const [acknowledgedErrors, setAcknowledgedErrors] = useState<Set<string>>(new Set());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'warning': return 'bg-status-warning/10 text-status-warning border-status-warning/20';
      case 'critical': return 'bg-status-error/10 text-status-error border-status-error/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getRowStyle = (error: DatabaseError) => {
    if (error.acknowledged || acknowledgedErrors.has(error.id)) {
      return 'opacity-60 bg-muted/5';
    }
    switch (error.severity) {
      case 'critical': return 'bg-status-error/5 border-l-4 border-l-status-error/50';
      case 'warning': return 'bg-status-warning/5 border-l-4 border-l-status-warning/50';
      default: return '';
    }
  };

  const handleAcknowledge = (errorId: string) => {
    setAcknowledgedErrors(prev => new Set([...prev, errorId]));
  };

  const handleExport = (error: DatabaseError) => {
    const exportData = {
      timestamp: error.timestamp,
      query: error.query,
      errorCode: error.errorCode,
      service: error.service,
      retryCount: error.retryCount,
      severity: error.severity,
      fullQuery: error.fullQuery,
      bindParameters: error.bindParameters,
      stackTrace: error.stackTrace
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-${error.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const truncateQuery = (query: string, maxLength: number = 60) => {
    return query.length > maxLength ? `${query.substring(0, maxLength)}...` : query;
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Database Error Log
          <Badge variant="secondary" className="ml-auto">
            {errors.filter(e => !e.acknowledged && !acknowledgedErrors.has(e.id)).length} unacknowledged
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Time</TableHead>
                <TableHead>Query</TableHead>
                <TableHead className="w-32">Error Code</TableHead>
                <TableHead className="w-24">Service</TableHead>
                <TableHead className="w-16">Retries</TableHead>
                <TableHead className="w-20">Severity</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.map((error) => (
                <TableRow 
                  key={error.id}
                  className={`cursor-pointer hover:bg-muted/10 transition-colors ${getRowStyle(error)}`}
                  onClick={() => onErrorClick(error)}
                >
                  <TableCell className="text-xs text-muted-foreground">
                    {error.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {truncateQuery(error.query)}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {error.errorCode}
                  </TableCell>
                  <TableCell className="text-xs">
                    {error.service}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {error.retryCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getSeverityColor(error.severity)}`}
                    >
                      {error.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onErrorClick(error);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {!error.acknowledged && !acknowledgedErrors.has(error.id) && (
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcknowledge(error.id);
                            }}
                          >
                            <Check className="w-3 h-3 mr-2" />
                            Acknowledge
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExport(error);
                          }}
                        >
                          <Download className="w-3 h-3 mr-2" />
                          Export
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {errors.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No errors logged</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};