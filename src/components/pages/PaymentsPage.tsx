import { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Check, X, Eye, IndianRupee, FileText, Calendar, Mail, Image as ImageIcon } from 'lucide-react';
import { Card } from '../ui/card';

interface Payment {
  id: string;
  orderId: string;
  buyerEmail: string;
  amount: number;
  screenshot: string;
  status: 'pending' | 'verified' | 'rejected';
  date: string;
  projectTitle: string;
}

export function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      orderId: 'ORD-2024-001',
      buyerEmail: 'student@example.com',
      amount: 2499,
      screenshot: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
      status: 'pending',
      date: '2024-11-15',
      projectTitle: 'E-commerce Dashboard'
    },
    {
      id: '2',
      orderId: 'ORD-2024-002',
      buyerEmail: 'learner@example.com',
      amount: 1999,
      screenshot: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
      status: 'verified',
      date: '2024-11-14',
      projectTitle: 'Social Media App UI'
    },
    {
      id: '3',
      orderId: 'ORD-2024-003',
      buyerEmail: 'user@example.com',
      amount: 3499,
      screenshot: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
      status: 'pending',
      date: '2024-11-14',
      projectTitle: 'Inventory System'
    },
    {
      id: '4',
      orderId: 'ORD-2024-004',
      buyerEmail: 'developer@example.com',
      amount: 999,
      screenshot: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
      status: 'rejected',
      date: '2024-11-13',
      projectTitle: 'Portfolio Template'
    },
  ]);

  const handleApprove = (paymentId: string) => {
    console.log('Approve payment:', paymentId);
    setSelectedPayment(null);
  };

  const handleReject = (paymentId: string) => {
    console.log('Reject payment:', paymentId);
    setSelectedPayment(null);
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-warning text-warning-foreground';
    }
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const verifiedCount = payments.filter(p => p.status === 'verified').length;
  const rejectedCount = payments.filter(p => p.status === 'rejected').length;

  return (
    <div>
      <PageHeader
        title="Payment Verification"
        description="Verify UPI payment screenshots and manage transactions"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-2 border-warning/20 bg-warning/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Pending Verification</p>
              <p className="text-3xl font-bold text-warning">{pendingCount}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-warning/10 flex items-center justify-center">
              <Eye className="h-7 w-7 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-success/20 bg-success/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Verified</p>
              <p className="text-3xl font-bold text-success">{verifiedCount}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-success/10 flex items-center justify-center">
              <Check className="h-7 w-7 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-destructive/20 bg-destructive/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Rejected</p>
              <p className="text-3xl font-bold text-destructive">{rejectedCount}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-destructive/10 flex items-center justify-center">
              <X className="h-7 w-7 text-destructive" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="border-2 border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="font-semibold text-primary">Order ID</TableHead>
              <TableHead className="font-semibold text-primary">Project</TableHead>
              <TableHead className="font-semibold text-primary">Buyer Email</TableHead>
              <TableHead className="font-semibold text-primary">Amount</TableHead>
              <TableHead className="font-semibold text-primary">Date</TableHead>
              <TableHead className="font-semibold text-primary">Status</TableHead>
              <TableHead className="font-semibold text-primary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="hover:bg-secondary/50">
                <TableCell className="font-medium text-primary">{payment.orderId}</TableCell>
                <TableCell>{payment.projectTitle}</TableCell>
                <TableCell className="text-muted-foreground">{payment.buyerEmail}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-semibold text-accent">
                    <IndianRupee className="h-4 w-4" />
                    {payment.amount}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPayment(payment)}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Payment Details Modal */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Payment Verification</DialogTitle>
            <DialogDescription>
              Review the payment screenshot and order details before approval
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6">
              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-secondary border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <p className="text-sm font-semibold text-primary">Order ID</p>
                  </div>
                  <p className="font-semibold">{selectedPayment.orderId}</p>
                </Card>

                <Card className="p-4 bg-secondary border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <p className="text-sm font-semibold text-primary">Buyer Email</p>
                  </div>
                  <p className="font-semibold">{selectedPayment.buyerEmail}</p>
                </Card>

                <Card className="p-4 bg-secondary border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <IndianRupee className="h-5 w-5 text-accent" />
                    <p className="text-sm font-semibold text-primary">Amount</p>
                  </div>
                  <p className="font-semibold text-xl text-accent">₹{selectedPayment.amount}</p>
                </Card>

                <Card className="p-4 bg-secondary border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <p className="text-sm font-semibold text-primary">Date</p>
                  </div>
                  <p className="font-semibold">{selectedPayment.date}</p>
                </Card>
              </div>

              {/* Project Details */}
              <Card className="p-4 bg-primary/5 border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Project Title</p>
                <p className="font-semibold text-lg text-primary">{selectedPayment.projectTitle}</p>
              </Card>

              {/* Screenshot Preview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-primary">UPI Payment Screenshot</h3>
                </div>
                <Card className="p-4 bg-black/5 border-2 border-border">
                  <Image src={selectedPayment.screenshot} alt="Payment Screenshot" width={1000} height={600} className="w-full h-auto rounded-lg shadow-lg max-h-[400px] object-contain bg-white" />
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button
                  onClick={() => handleApprove(selectedPayment.id)}
                  className="flex-1 bg-success hover:bg-success/90 h-12 text-lg"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Approve Payment
                </Button>
                <Button
                  onClick={() => handleReject(selectedPayment.id)}
                  variant="destructive"
                  className="flex-1 h-12 text-lg"
                >
                  <X className="h-5 w-5 mr-2" />
                  Reject Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
