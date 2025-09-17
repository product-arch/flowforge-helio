import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Code } from 'lucide-react';
import type { ConditionGroupData } from './QueryBuilder';

interface PseudoSQLPreviewProps {
  query: ConditionGroupData;
  mode: 'conditional' | 'switch' | 'filter';
}

export const PseudoSQLPreview: React.FC<PseudoSQLPreviewProps> = ({ query, mode }) => {
  const generateConditionSQL = (condition: any): string => {
    const { field, operator, value, type } = condition;
    
    if (!field) return '';
    
    const formatValue = (val: any) => {
      if (type === 'text') return `'${val}'`;
      if (type === 'date') return `'${val}'`;
      if (type === 'boolean') return val ? 'TRUE' : 'FALSE';
      if (type === 'array') return `[${val}]`;
      return val;
    };

    switch (operator) {
      case 'equals':
        return `${field} = ${formatValue(value)}`;
      case 'not_equals':
        return `${field} != ${formatValue(value)}`;
      case 'contains':
        return type === 'array' 
          ? `${field} CONTAINS ${formatValue(value)}`
          : `${field} LIKE '%${value}%'`;
      case 'not_contains':
        return type === 'array'
          ? `${field} NOT CONTAINS ${formatValue(value)}`
          : `${field} NOT LIKE '%${value}%'`;
      case 'starts_with':
        return `${field} LIKE '${value}%'`;
      case 'ends_with':
        return `${field} LIKE '%${value}'`;
      case 'greater_than':
        return `${field} > ${value}`;
      case 'greater_than_or_equal':
        return `${field} >= ${value}`;
      case 'less_than':
        return `${field} < ${value}`;
      case 'less_than_or_equal':
        return `${field} <= ${value}`;
      case 'between':
        return `${field} BETWEEN ${value.min} AND ${value.max}`;
      case 'is_empty':
        return `${field} IS NULL OR ${field} = ''`;
      case 'is_not_empty':
        return `${field} IS NOT NULL AND ${field} != ''`;
      case 'is_true':
        return `${field} = TRUE`;
      case 'is_false':
        return `${field} = FALSE`;
      case 'today':
        return `DATE(${field}) = DATE(NOW())`;
      case 'yesterday':
        return `DATE(${field}) = DATE(NOW()) - INTERVAL 1 DAY`;
      case 'this_week':
        return `WEEK(${field}) = WEEK(NOW())`;
      case 'this_month':
        return `MONTH(${field}) = MONTH(NOW())`;
      case 'regex':
        return `${field} REGEXP '${value}'`;
      case 'length_equals':
        return `LENGTH(${field}) = ${value}`;
      case 'length_greater_than':
        return `LENGTH(${field}) > ${value}`;
      case 'length_less_than':
        return `LENGTH(${field}) < ${value}`;
      default:
        return `${field} ${operator} ${formatValue(value)}`;
    }
  };

  const generateGroupSQL = (group: ConditionGroupData, level: number = 0): string => {
    const conditions = group.conditions
      .filter(c => c.field)
      .map(c => generateConditionSQL(c))
      .filter(sql => sql);
    
    const nestedGroups = group.groups.map(g => generateGroupSQL(g, level + 1));
    
    const allClauses = [...conditions, ...nestedGroups].filter(Boolean);
    
    if (allClauses.length === 0) return '';
    if (allClauses.length === 1) return allClauses[0];
    
    const joined = allClauses.join(`\n${' '.repeat((level + 1) * 2)}${group.operator} `);
    
    return level > 0 ? `(${joined})` : joined;
  };

  const generateSQL = (): string => {
    const whereClause = generateGroupSQL(query);
    
    switch (mode) {
      case 'conditional':
        return `-- Conditional Logic Query
SELECT *
FROM messages
WHERE ${whereClause || 'TRUE'}

-- Action Logic:
-- IF condition evaluates to TRUE → Route to 'true' output
-- IF condition evaluates to FALSE → Route to 'false' output`;

      case 'switch':
        return `-- Switch Case Query
SELECT *,
  CASE 
    WHEN ${whereClause || 'TRUE'} THEN 'case_1'
    WHEN /* Additional cases here */ THEN 'case_2'
    ELSE 'default'
  END as route_path
FROM messages

-- Action Logic:
-- Route messages to different paths based on case evaluation
-- Each case can have different criteria and priorities`;

      case 'filter':
        return `-- Filter Query
SELECT *
FROM messages
WHERE ${whereClause || 'TRUE'}

-- Action Logic:
-- ALLOW: Messages matching criteria proceed through flow
-- BLOCK: Messages not matching criteria are filtered out`;

      default:
        return `-- Decision Query
SELECT *
FROM messages
WHERE ${whereClause || 'TRUE'}`;
    }
  };

  const sql = generateSQL();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sql);
  };

  const downloadSQL = () => {
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode}_query.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasValidConditions = query.conditions.some(c => c.field) || 
    query.groups.some(g => g.conditions.some(c => c.field));

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="w-5 h-5" />
              Pseudo-SQL Preview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {mode} Mode
              </Badge>
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={downloadSQL}>
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <code className="text-foreground whitespace-pre-wrap">
                  {sql}
                </code>
              </pre>
              
              {!hasValidConditions && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Code className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      No conditions defined yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Add conditions in the Builder panel to see generated SQL
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Query Statistics */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {query.conditions.length}
              </div>
              <div className="text-xs text-muted-foreground">Conditions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {query.groups.length}
              </div>
              <div className="text-xs text-muted-foreground">Groups</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {query.conditions.filter(c => c.field).length}
              </div>
              <div className="text-xs text-muted-foreground">Valid</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};