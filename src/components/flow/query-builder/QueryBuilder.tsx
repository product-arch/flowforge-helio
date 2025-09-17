import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Copy, Database, Code } from 'lucide-react';
import { FieldLibrary } from './FieldLibrary';
import { ConditionGroup } from './ConditionGroup';
import { PseudoSQLPreview } from './PseudoSQLPreview';

interface QueryBuilderProps {
  value: any;
  onChange: (value: any) => void;
  mode: 'conditional' | 'switch' | 'filter';
}

export interface ConditionRule {
  id: string;
  field: string;
  operator: string;
  value: any;
  type: 'text' | 'number' | 'date' | 'boolean' | 'array';
}

export interface ConditionGroupData {
  id: string;
  operator: 'AND' | 'OR';
  conditions: ConditionRule[];
  groups: ConditionGroupData[];
}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ value, onChange, mode }) => {
  const [selectedPanel, setSelectedPanel] = useState<'fields' | 'builder' | 'sql'>('builder');
  
  const [queryData, setQueryData] = useState<ConditionGroupData>(value || {
    id: 'root',
    operator: 'AND',
    conditions: [],
    groups: []
  });

  const handleQueryChange = (newQuery: ConditionGroupData) => {
    setQueryData(newQuery);
    onChange(newQuery);
  };

  const addCondition = (groupId: string) => {
    const newCondition: ConditionRule = {
      id: `condition_${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
      type: 'text'
    };

    const updateGroup = (group: ConditionGroupData): ConditionGroupData => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: [...group.conditions, newCondition]
        };
      }
      return {
        ...group,
        groups: group.groups.map(updateGroup)
      };
    };

    handleQueryChange(updateGroup(queryData));
  };

  const addGroup = (parentGroupId: string) => {
    const newGroup: ConditionGroupData = {
      id: `group_${Date.now()}`,
      operator: 'AND',
      conditions: [],
      groups: []
    };

    const updateGroup = (group: ConditionGroupData): ConditionGroupData => {
      if (group.id === parentGroupId) {
        return {
          ...group,
          groups: [...group.groups, newGroup]
        };
      }
      return {
        ...group,
        groups: group.groups.map(updateGroup)
      };
    };

    handleQueryChange(updateGroup(queryData));
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    const updateGroup = (group: ConditionGroupData): ConditionGroupData => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.filter(c => c.id !== conditionId)
        };
      }
      return {
        ...group,
        groups: group.groups.map(updateGroup)
      };
    };

    handleQueryChange(updateGroup(queryData));
  };

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<ConditionRule>) => {
    const updateGroup = (group: ConditionGroupData): ConditionGroupData => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.map(c => 
            c.id === conditionId ? { ...c, ...updates } : c
          )
        };
      }
      return {
        ...group,
        groups: group.groups.map(updateGroup)
      };
    };

    handleQueryChange(updateGroup(queryData));
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'conditional': return 'Conditional Logic Builder';
      case 'switch': return 'Switch Case Builder';
      case 'filter': return 'Filter Criteria Builder';
      default: return 'Query Builder';
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'conditional': return 'Create complex conditional logic with AND/OR operations';
      case 'switch': return 'Define multiple cases for routing decisions';
      case 'filter': return 'Set up filtering criteria to allow or block messages';
      default: return 'Build your query logic';
    }
  };

  return (
    <div className="h-[600px] flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{getModeTitle()}</h3>
            <p className="text-sm text-muted-foreground">{getModeDescription()}</p>
          </div>
          <Badge variant="outline" className="capitalize">
            {mode} Mode
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b">
        <Button
          variant={selectedPanel === 'fields' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setSelectedPanel('fields')}
          className="rounded-none border-r"
        >
          <Database className="w-4 h-4 mr-2" />
          Fields
        </Button>
        <Button
          variant={selectedPanel === 'builder' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setSelectedPanel('builder')}
          className="rounded-none border-r"
        >
          <Plus className="w-4 h-4 mr-2" />
          Builder
        </Button>
        <Button
          variant={selectedPanel === 'sql' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setSelectedPanel('sql')}
          className="rounded-none"
        >
          <Code className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex">
        {/* Field Library Panel */}
        {selectedPanel === 'fields' && (
          <div className="w-full p-4">
            <FieldLibrary onFieldSelect={(field) => console.log('Field selected:', field)} />
          </div>
        )}

        {/* Query Builder Panel */}
        {selectedPanel === 'builder' && (
          <div className="w-full p-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Conditions & Groups</h4>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => addCondition('root')}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add Condition
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addGroup('root')}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add Group
                    </Button>
                  </div>
                </div>
                
                <ConditionGroup
                  group={queryData}
                  onAddCondition={addCondition}
                  onAddGroup={addGroup}
                  onRemoveCondition={removeCondition}
                  onUpdateCondition={updateCondition}
                  onUpdateGroup={(groupId, updates) => {
                    if (groupId === 'root') {
                      handleQueryChange({ ...queryData, ...updates });
                    }
                  }}
                  isRoot={true}
                />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* SQL Preview Panel */}
        {selectedPanel === 'sql' && (
          <div className="w-full p-4">
            <PseudoSQLPreview query={queryData} mode={mode} />
          </div>
        )}
      </div>
    </div>
  );
};