import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Plus,
  Trash2,
  Edit3,
  Package,
  AlertTriangle,
  Snowflake,
  Calendar,
  DollarSign,
  Info
} from 'lucide-react';
import {
  DonationItemFormData,
  DonationItemCategory,
  ItemCondition,
  DONATION_ITEM_CATEGORIES
} from '../types/donations';

interface DonationItemsManagerProps {
  items: DonationItemFormData[];
  onItemsChange: (items: DonationItemFormData[]) => void;
  acceptedCategories?: DonationItemCategory[];
  className?: string;
  readOnly?: boolean;
}

const DonationItemsManager: React.FC<DonationItemsManagerProps> = ({
  items,
  onItemsChange,
  acceptedCategories,
  className = '',
  readOnly = false
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const availableCategories = acceptedCategories || DONATION_ITEM_CATEGORIES;
  const conditionOptions: ItemCondition[] = ['new', 'excellent', 'good', 'fair', 'poor'];

  const getEmptyItem = (): DonationItemFormData => ({
    category: availableCategories[0],
    subcategory: '',
    itemName: '',
    description: '',
    quantity: 1,
    unit: 'pieces',
    condition: 'good',
    estimatedValuePerUnit: undefined,
    specialHandlingNotes: '',
    expiryDate: '',
    isFragile: false,
    requiresRefrigeration: false
  });

  const [currentItem, setCurrentItem] = useState<DonationItemFormData>(getEmptyItem());

  const handleAddItem = () => {
    if (validateItem(currentItem)) {
      onItemsChange([...items, currentItem]);
      setCurrentItem(getEmptyItem());
      setShowAddForm(false);
    }
  };

  const handleEditItem = (index: number) => {
    setCurrentItem({ ...items[index] });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleUpdateItem = () => {
    if (editingIndex !== null && validateItem(currentItem)) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = currentItem;
      onItemsChange(updatedItems);
      setEditingIndex(null);
      setCurrentItem(getEmptyItem());
      setShowAddForm(false);
    }
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onItemsChange(updatedItems);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setCurrentItem(getEmptyItem());
    setShowAddForm(false);
  };

  const validateItem = (item: DonationItemFormData): boolean => {
    return !!(
      item.itemName.trim() &&
      item.category &&
      item.quantity > 0 &&
      item.unit.trim()
    );
  };

  const getTotalEstimatedValue = (): number => {
    return items.reduce(
      (total, item) => total + (item.quantity * (item.estimatedValuePerUnit || 0)),
      0
    );
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const getConditionColor = (condition: ItemCondition): string => {
    const colors: Record<ItemCondition, string> = {
      new: 'bg-green-100 text-green-800',
      excellent: 'bg-blue-100 text-blue-800',
      good: 'bg-yellow-100 text-yellow-800',
      fair: 'bg-orange-100 text-orange-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[condition];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Donation Items</h3>
          <p className="text-sm text-muted-foreground">
            Add the items you'd like to donate
          </p>
        </div>
        {!readOnly && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
            disabled={showAddForm}
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        )}
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">{item.itemName}</h4>
                      <Badge className={getConditionColor(item.condition)}>
                        {item.condition}
                      </Badge>
                      {item.isFragile && (
                        <Badge variant="outline">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Fragile
                        </Badge>
                      )}
                      {item.requiresRefrigeration && (
                        <Badge variant="outline">
                          <Snowflake className="h-3 w-3 mr-1" />
                          Refrigeration
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Category:</span><br />
                        {item.category.replace('_', ' ')}
                        {item.subcategory && ` • ${item.subcategory}`}
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span><br />
                        {item.quantity} {item.unit}
                      </div>
                      {item.estimatedValuePerUnit && (
                        <div>
                          <span className="font-medium">Value:</span><br />
                          {formatCurrency(item.estimatedValuePerUnit)} each
                        </div>
                      )}
                      {item.expiryDate && (
                        <div>
                          <span className="font-medium">Expires:</span><br />
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}

                    {item.specialHandlingNotes && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>Special handling:</strong> {item.specialHandlingNotes}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {!readOnly && (
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItem(index)}
                        disabled={showAddForm}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(index)}
                        disabled={showAddForm}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          <Separator />

          {/* Summary */}
          <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Total items: <span className="font-medium">{items.length}</span>
            </div>
            {getTotalEstimatedValue() > 0 && (
              <div className="text-sm text-muted-foreground">
                Estimated total value: 
                <span className="font-medium ml-1">
                  {formatCurrency(getTotalEstimatedValue())}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editingIndex !== null ? 'Edit Item' : 'Add New Item'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={currentItem.category}
                  onValueChange={(value: DonationItemCategory) =>
                    setCurrentItem({ ...currentItem, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={currentItem.subcategory}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, subcategory: e.target.value })
                  }
                  placeholder="e.g., shirts, textbooks"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name *</Label>
              <Input
                id="itemName"
                value={currentItem.itemName}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, itemName: e.target.value })
                }
                placeholder="e.g., Adult T-Shirts, Math Textbooks"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentItem.description}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, description: e.target.value })
                }
                placeholder="Additional details about the items..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={currentItem.unit}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, unit: e.target.value })
                  }
                  placeholder="pieces, kg, boxes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={currentItem.condition}
                  onValueChange={(value: ItemCondition) =>
                    setCurrentItem({ ...currentItem, condition: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Estimated Value per Unit (₱)</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentItem.estimatedValuePerUnit || ''}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      estimatedValuePerUnit: e.target.value ? parseFloat(e.target.value) : undefined
                    })
                  }
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={currentItem.expiryDate}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialHandling">Special Handling Notes</Label>
              <Textarea
                id="specialHandling"
                value={currentItem.specialHandlingNotes}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, specialHandlingNotes: e.target.value })
                }
                placeholder="Any special instructions for handling these items..."
                rows={2}
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFragile"
                  checked={currentItem.isFragile}
                  onCheckedChange={(checked) =>
                    setCurrentItem({ ...currentItem, isFragile: checked as boolean })
                  }
                />
                <Label htmlFor="isFragile" className="text-sm">
                  Items are fragile
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresRefrigeration"
                  checked={currentItem.requiresRefrigeration}
                  onCheckedChange={(checked) =>
                    setCurrentItem({ ...currentItem, requiresRefrigeration: checked as boolean })
                  }
                />
                <Label htmlFor="requiresRefrigeration" className="text-sm">
                  Requires refrigeration
                </Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button
                onClick={editingIndex !== null ? handleUpdateItem : handleAddItem}
                disabled={!validateItem(currentItem)}
              >
                {editingIndex !== null ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {items.length === 0 && !showAddForm && (
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No items added yet</h3>
          <p className="text-muted-foreground mb-4">
            Start adding items you'd like to donate
          </p>
          {!readOnly && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default DonationItemsManager;
