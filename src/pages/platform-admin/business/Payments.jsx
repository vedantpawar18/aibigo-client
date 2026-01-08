import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Chip,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { createPayment, getPayments } from '../../../store/slices/businessSlice'
import { getInstitutes } from '../../../store/slices/institutesSlice'
import { getSubscriptionPlans } from '../../../store/slices/businessSlice'
import { toast } from 'react-toastify'

const Payments = () => {
  const dispatch = useDispatch()
  const { payments, subscriptionPlans, loading } = useSelector((state) => state.business)
  const { institutes } = useSelector((state) => state.institutes)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    instituteId: '',
    subscriptionPlanId: '',
    amount: 0,
    status: 'PENDING',
    startDate: '',
    endDate: '',
    invoiceRef: '',
    paymentMethod: 'BANK_TRANSFER',
    transactionId: '',
  })

  useEffect(() => {
    if (payments.length === 0) {
      dispatch(getPayments())
    }
    if (institutes.length === 0) {
      dispatch(getInstitutes())
    }
    if (subscriptionPlans.length === 0) {
      dispatch(getSubscriptionPlans())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({
      instituteId: '',
      subscriptionPlanId: '',
      amount: 0,
      status: 'PENDING',
      startDate: '',
      endDate: '',
      invoiceRef: '',
      paymentMethod: 'BANK_TRANSFER',
      transactionId: '',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createPayment(formData)).unwrap()
      toast.success('Payment recorded successfully!')
      handleClose()
      dispatch(getPayments()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to record payment')
    } finally {
      setCreating(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'FAILED':
        return 'error'
      case 'REFUNDED':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Payments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Record Payment
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Institute</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Invoice Ref</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>
                    {typeof payment.instituteId === 'object' && payment.instituteId
                      ? payment.instituteId.name
                      : 'N/A'}
                  </TableCell>
                  <TableCell>₹{payment.amount?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Chip label={payment.status} color={getStatusColor(payment.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    {payment.startDate ? new Date(payment.startDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {payment.endDate ? new Date(payment.endDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>{payment.invoiceRef || 'N/A'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Institute"
              name="instituteId"
              fullWidth
              required
              value={formData.instituteId}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {institutes.map((institute) => (
                <MenuItem key={institute._id} value={institute._id}>
                  {institute.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              margin="dense"
              label="Subscription Plan"
              name="subscriptionPlanId"
              fullWidth
              required
              value={formData.subscriptionPlanId}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {subscriptionPlans.map((plan) => (
                <MenuItem key={plan._id} value={plan._id}>
                  {plan.name} - ₹{plan.price?.toLocaleString()}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Amount"
              name="amount"
              type="number"
              fullWidth
              required
              value={formData.amount}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Status"
              name="status"
              fullWidth
              required
              value={formData.status}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
              <MenuItem value="REFUNDED">Refunded</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Start Date"
              name="startDate"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="End Date"
              name="endDate"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Invoice Reference"
              name="invoiceRef"
              fullWidth
              value={formData.invoiceRef}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Payment Method"
              name="paymentMethod"
              fullWidth
              value={formData.paymentMethod}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
              <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
              <MenuItem value="DEBIT_CARD">Debit Card</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="CHEQUE">Cheque</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Transaction ID"
              name="transactionId"
              fullWidth
              value={formData.transactionId}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={creating}>
              {creating ? <CircularProgress size={24} /> : 'Record'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default Payments
