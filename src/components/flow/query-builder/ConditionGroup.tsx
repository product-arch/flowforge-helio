import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Type, Hash, Calendar, ToggleLeft } from 'lucide-react';
import type { ConditionRule, ConditionGroupData } from './QueryBuilder';

interface ConditionGroupProps {
  group: ConditionGroupData;
  onAddCondition: (groupId: string) => void;
  onAddGroup: (groupId: string) => void;
  onRemoveCondition: (groupId: string, conditionId: string) => void;
  onUpdateCondition: (groupId: string, conditionId: string, updates: Partial<ConditionRule>) => void;
  onUpdateGroup: (groupId: string, updates: Partial<ConditionGroupData>) => void;
  isRoot?: boolean;
  level?: number;
}

const OPERATORS = {
  text: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'is_empty', label: 'Is Empty' },
    { value: 'is_not_empty', label: 'Is Not Empty' },
    { value: 'regex', label: 'Matches Regex' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'greater_than_or_equal', label: 'Greater Than or Equal' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'less_than_or_equal', label: 'Less Than or Equal' },
    { value: 'between', label: 'Between' },
    { value: 'not_between', label: 'Not Between' },
  ],
  date: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
    { value: 'between', label: 'Between' },
    { value: 'today', label: 'Is Today' },
    { value: 'yesterday', label: 'Is Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
  ],
  boolean: [
    { value: 'is_true', label: 'Is True' },
    { value: 'is_false', label: 'Is False' },
  ],
  array: [
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'is_empty', label: 'Is Empty' },
    { value: 'is_not_empty', label: 'Is Not Empty' },
    { value: 'length_equals', label: 'Length Equals' },
    { value: 'length_greater_than', label: 'Length Greater Than' },
    { value: 'length_less_than', label: 'Length Less Than' },
  ]
};

export const ConditionGroup: React.FC<ConditionGroupProps> = ({
  group,
  onAddCondition,
  onAddGroup,
  onRemoveCondition,
  onUpdateCondition,
  onUpdateGroup,
  isRoot = false,
  level = 0
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'number': return Hash;
      case 'date': return Calendar;
      case 'boolean': return ToggleLeft;
      default: return Type;
    }
  };

  const renderValueInput = (condition: ConditionRule) => {
    switch (condition.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={condition.value === true}
              onCheckedChange={(checked) => 
                onUpdateCondition(group.id, condition.id, { value: checked })
              }
            />
            <span className="text-sm">{condition.value ? 'True' : 'False'}</span>
          </div>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={condition.value || ''}
            onChange={(e) => 
              onUpdateCondition(group.id, condition.id, { value: parseFloat(e.target.value) || 0 })
            }
            placeholder="Enter number..."
            className="w-32"
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={condition.value || ''}
            onChange={(e) => 
              onUpdateCondition(group.id, condition.id, { value: e.target.value })
            }
            className="w-40"
          />
        );
      default:
        return (
          <Input
            value={condition.value || ''}
            onChange={(e) => 
              onUpdateCondition(group.id, condition.id, { value: e.target.value })
            }
            placeholder="Enter value..."
            className="w-48"
          />
        );
    }
  };

  const needsValueInput = (operator: string) => {
    return !['is_empty', 'is_not_empty', 'is_true', 'is_false', 'today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month'].includes(operator);
  };

  return (
    <Card className={`${level > 0 ? 'ml-4 border-l-4 border-l-primary/30' : ''}`}>
      <CardContent className="p-4 space-y-4">
        {/* Group Header */}
        {!isRoot && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Group {level + 1}
              </Badge>
              <Select
                value={group.operator}
                onValueChange={(value: 'AND' | 'OR') => 
                  onUpdateGroup(group.id, { operator: value })
                }
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onAddCondition(group.id)}>
                <Plus className="w-3 h-3 mr-1" />
                Condition
              </Button>
              <Button size="sm" variant="outline" onClick={() => onAddGroup(group.id)}>
                <Plus className="w-3 h-3 mr-1" />
                Group
              </Button>
            </div>
          </div>
        )}

        {/* Root Group Controls */}
        {isRoot && (
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Root Logic:</span>
              <Select
                value={group.operator}
                onValueChange={(value: 'AND' | 'OR') => 
                  onUpdateGroup(group.id, { operator: value })
                }
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Conditions */}
        {group.conditions.map((condition, index) => {
          const TypeIcon = getTypeIcon(condition.type);
          const availableOperators = OPERATORS[condition.type as keyof typeof OPERATORS] || OPERATORS.text;
          
          return (
            <div key={condition.id} className="flex items-center gap-2 p-3 bg-accent/30 rounded-lg">
              {index > 0 && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {group.operator}
                </Badge>
              )}
              
              {/* Field Input */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <TypeIcon className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={condition.field}
                  onChange={(e) => 
                    onUpdateCondition(group.id, condition.id, { field: e.target.value })
                  }
                  placeholder="Select field..."
                  className="min-w-32"
                />
              </div>

              {/* Type Selector */}
              <Select
                value={condition.type}
                onValueChange={(value: any) => 
                  onUpdateCondition(group.id, condition.id, { type: value, operator: 'equals', value: '' })
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="array">Array</SelectItem>
                </SelectContent>
              </Select>

              {/* Operator Selector */}
              <Select
                value={condition.operator}
                onValueChange={(value) => 
                  onUpdateCondition(group.id, condition.id, { operator: value })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableOperators.map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Value Input */}
              {needsValueInput(condition.operator) && renderValueInput(condition)}

              {/* Remove Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveCondition(group.id, condition.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          );
        })}

        {/* Nested Groups */}
        {group.groups.map(nestedGroup => (
          <ConditionGroup
            key={nestedGroup.id}
            group={nestedGroup}
            onAddCondition={onAddCondition}
            onAddGroup={onAddGroup}
            onRemoveCondition={onRemoveCondition}
            onUpdateCondition={onUpdateCondition}
            onUpdateGroup={onUpdateGroup}
            level={level + 1}
          />
        ))}

        {/* Empty State */}
        {group.conditions.length === 0 && group.groups.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm mb-2">No conditions or groups yet</p>
            <div className="flex justify-center gap-2">
              <Button size="sm" variant="outline" onClick={() => onAddCondition(group.id)}>
                <Plus className="w-3 h-3 mr-1" />
                Add Condition
              </Button>
              <Button size="sm" variant="outline" onClick={() => onAddGroup(group.id)}>
                <Plus className="w-3 h-3 mr-1" />
                Add Group
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};