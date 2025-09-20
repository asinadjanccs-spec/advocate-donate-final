import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  Package,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Truck,
  FileText,
  Eye,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { physicalDonationService } from '../lib/physicalDonationService';
import {
  PhysicalDonationWithItems,
  PhysicalDonationStatus,
  DonationItemStatus
} from '../types/donations';

interface PhysicalDonationStatusManagerProps {
  donation: PhysicalDonationWithItems;
  onStatusUpdate: (updatedDonation: PhysicalDonationWithItems) => void;
  canManage: boolean; // Whether the user can manage this donation
  className?: string;
}

const PhysicalDonationStatusManager: React.FC<PhysicalDonationStatusManagerProps> = ({
  donation,
  onStatusUpdate,
  canManage,
  className = ''
}) => {
  const [updating, setUpdating] = useState(false);
  const [statusNotes, setStatusNotes] = useState(donation.coordinator_notes || '');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedItemStatus, setSelectedItemStatus] = useState<{[key: string]: DonationItemStatus}>({});
  const [itemDeclineReasons, setItemDeclineReasons] = useState<{[key: string]: string}>({});

  const statusOptions: { value: PhysicalDonationStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_transit', label: 'In Transit', color: 'bg-purple-100 text-purple-800' },
    { value: 'received', label: 'Received', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'declined', label: 'Declined', color: 'bg-red-100 text-red-800' }
  ];

  const itemStatusOptions: { value: DonationItemStatus; label: string; icon: React.ComponentType<any> }[] = [
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'accepted', label: 'Accepted', icon: CheckCircle },
    { value: 'declined', label: 'Declined', icon: XCircle },
    { value: 'received', label: 'Received', icon: Package }
  ];

  const handleStatusUpdate = async (newStatus: PhysicalDonationStatus) => {
    setUpdating(true);
    try {
      const result = await physicalDonationService.updateDonationStatus(
        donation.id,
        newStatus,
        statusNotes
      );

      if (result.success) {
        // Update the local donation object
        const updatedDonation = {
          ...donation,
          donation_status: newStatus,
          coordinator_notes: statusNotes,
          ...(newStatus === 'confirmed' && { confirmed_at: new Date().toISOString() }),
          ...(newStatus === 'received' && { received_at: new Date().toISOString() })
        };
        onStatusUpdate(updatedDonation);
        setShowStatusUpdate(false);
      } else {
        alert(result.error || 'Failed to update status');
      }
    } catch (error) {
      alert('Failed to update donation status');
    } finally {
      setUpdating(false);
    }
  };

  const handleItemStatusUpdate = async (itemId: string, status: DonationItemStatus) => {
    setUpdating(true);
    try {
      const result = await physicalDonationService.updateDonationItemStatus(
        itemId,
        status,
        status === 'declined' ? itemDeclineReasons[itemId] : undefined
      );

      if (result.success) {
        // Update the local donation items
        const updatedItems = donation.donation_items?.map(item =>
          item.id === itemId
            ? { ...item, item_status: status, decline_reason: itemDeclineReasons[itemId] }
            : item
        );

        const updatedDonation = {
          ...donation,
          donation_items: updatedItems
        };
        onStatusUpdate(updatedDonation);
      } else {
        alert(result.error || 'Failed to update item status');
      }
    } catch (error) {
      alert('Failed to update item status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: PhysicalDonationStatus): string => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: PhysicalDonationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'received':
        return <Package className="h-4 w-4" />;
      case 'cancelled':
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getItemStatusIcon = (status: DonationItemStatus) => {
    const statusOption = itemStatusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.icon : Clock;
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Physical Donation Details</span>
            <Badge className={`${getStatusColor(donation.donation_status)}`}>
              {getStatusIcon(donation.donation_status)}
              <span className="ml-1">{donation.donation_status}</span>
            </Badge>
          </CardTitle>
          {canManage && (
            <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Donation Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>New Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {statusOptions.map((status) => (
                        <Button
                          key={status.value}
                          variant="outline"
                          className="justify-start"
                          onClick={() => handleStatusUpdate(status.value)}
                          disabled={updating}
                        >
                          {getStatusIcon(status.value)}
                          <span className="ml-2">{status.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status-notes">Coordinator Notes</Label>
                    <Textarea
                      id="status-notes"
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                      placeholder="Add notes about this status update..."
                      rows={3}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Donation Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Donor Information</span>
            </h4>
            <div className="space-y-2 pl-6">
              <div>
                <span className="text-sm text-muted-foreground">Name:</span>
                <p className="font-medium">{donation.donor_name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="text-sm">{donation.donor_email}</p>
              </div>
              {donation.donor_phone && (
                <div>
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <p className="text-sm">{donation.donor_phone}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Timeline</span>
            </h4>
            <div className="space-y-2 pl-6">
              <div>
                <span className="text-sm text-muted-foreground">Created:</span>
                <p className="text-sm">{formatDate(donation.created_at)}</p>
              </div>
              {donation.confirmed_at && (
                <div>
                  <span className="text-sm text-muted-foreground">Confirmed:</span>
                  <p className="text-sm">{formatDate(donation.confirmed_at)}</p>
                </div>
              )}
              {donation.received_at && (
                <div>
                  <span className="text-sm text-muted-foreground">Received:</span>
                  <p className="text-sm">{formatDate(donation.received_at)}</p>
                </div>
              )}
              {donation.preferred_pickup_date && (
                <div>
                  <span className="text-sm text-muted-foreground">Preferred Date:</span>
                  <p className="text-sm">{formatDate(donation.preferred_pickup_date)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pickup Information */}
        {(donation.pickup_address || donation.pickup_instructions) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Pickup Details</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <div>
                  <span className="text-sm text-muted-foreground">Preference:</span>
                  <p className="font-medium capitalize">{donation.pickup_preference}</p>
                </div>
                {donation.pickup_address && (
                  <div>
                    <span className="text-sm text-muted-foreground">Address:</span>
                    <p className="text-sm">{donation.pickup_address}</p>
                  </div>
                )}
                {donation.preferred_time_slot && (
                  <div>
                    <span className="text-sm text-muted-foreground">Time Slot:</span>
                    <p className="text-sm capitalize">{donation.preferred_time_slot}</p>
                  </div>
                )}
                {donation.pickup_instructions && (
                  <div className="md:col-span-2">
                    <span className="text-sm text-muted-foreground">Instructions:</span>
                    <p className="text-sm">{donation.pickup_instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Message */}
        {donation.message && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Donor Message</span>
              </h4>
              <div className="pl-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm italic">"{donation.message}"</p>
              </div>
            </div>
          </>
        )}

        {/* Donation Items */}
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Donated Items ({donation.donation_items?.length || 0})</span>
            </h4>
            <div className="text-sm text-muted-foreground">
              Est. Value: {formatCurrency(donation.estimated_value || 0)}
            </div>
          </div>

          {donation.donation_items && donation.donation_items.length > 0 ? (
            <div className="space-y-3">
              {donation.donation_items.map((item) => {
                const ItemStatusIcon = getItemStatusIcon(item.item_status);
                
                return (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <ItemStatusIcon className="h-4 w-4" />
                          <h5 className="font-medium">{item.item_name}</h5>
                          <Badge variant="outline" className="text-xs">
                            {item.category.replace('_', ' ')}
                          </Badge>
                          {item.subcategory && (
                            <Badge variant="outline" className="text-xs">
                              {item.subcategory}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground pl-7">
                          <div>
                            <span className="font-medium">Quantity:</span><br />
                            {item.quantity} {item.unit}
                          </div>
                          <div>
                            <span className="font-medium">Condition:</span><br />
                            {item.condition}
                          </div>
                          {item.estimated_value_per_unit && (
                            <div>
                              <span className="font-medium">Value:</span><br />
                              {formatCurrency(item.estimated_value_per_unit)} each
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Status:</span><br />
                            <Badge className={`text-xs ${
                              item.item_status === 'accepted' ? 'bg-green-100 text-green-800' :
                              item.item_status === 'declined' ? 'bg-red-100 text-red-800' :
                              item.item_status === 'received' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.item_status}
                            </Badge>
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-sm text-muted-foreground pl-7">
                            {item.description}
                          </p>
                        )}

                        {item.special_handling_notes && (
                          <Alert className="ml-7">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              <strong>Special handling:</strong> {item.special_handling_notes}
                            </AlertDescription>
                          </Alert>
                        )}

                        {item.decline_reason && (
                          <Alert variant="destructive" className="ml-7">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              <strong>Decline reason:</strong> {item.decline_reason}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {canManage && item.item_status === 'pending' && (
                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600"
                            onClick={() => handleItemStatusUpdate(item.id, 'accepted')}
                            disabled={updating}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600"
                                disabled={updating}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Decline Item: {item.item_name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="decline-reason">Decline Reason</Label>
                                  <Textarea
                                    id="decline-reason"
                                    value={itemDeclineReasons[item.id] || ''}
                                    onChange={(e) => setItemDeclineReasons(prev => ({
                                      ...prev,
                                      [item.id]: e.target.value
                                    }))}
                                    placeholder="Please explain why this item is being declined..."
                                    rows={3}
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => {}}>
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleItemStatusUpdate(item.id, 'declined')}
                                    disabled={!itemDeclineReasons[item.id]?.trim()}
                                  >
                                    Decline Item
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p>No items listed for this donation.</p>
            </div>
          )}
        </div>

        {/* Coordinator Notes */}
        {donation.coordinator_notes && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Coordinator Notes</span>
              </h4>
              <div className="pl-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">{donation.coordinator_notes}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PhysicalDonationStatusManager;
