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
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { createSubscriptionPlan, getSubscriptionPlans } from '../../../store/slices/businessSlice'
import { toast } from 'react-toastify'

const SubscriptionPlans = () => {
  const dispatch = useDispatch()
  const { subscriptionPlans, loading } = useSelector((state) => state.business)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: 'BASIC',
    price: 0,
    features: {
      aiSummary: false,
      industryAssessments: false,
    },
    limits: {
      students: 0,
      aiUsage: 0,
    },
  })

  useEffect(() => {
    if (subscriptionPlans.length === 0) {
      dispatch(getSubscriptionPlans())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({
      name: 'BASIC',
      price: 0,
      features: { aiSummary: false, industryAssessments: false },
      limits: { students: 0, aiUsage: 0 },
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('features.')) {
      const featureName = name.split('.')[1]
      setFormData({
        ...formData,
        features: { ...formData.features, [featureName]: checked },
      })
    } else if (name.startsWith('limits.')) {
      const limitName = name.split('.')[1]
      setFormData({
        ...formData,
        limits: { ...formData.limits, [limitName]: parseInt(value) || 0 },
      })
    } else {
      setFormData({ ...formData, [name]: type === 'number' ? parseFloat(value) : value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createSubscriptionPlan(formData)).unwrap()
      toast.success('Subscription plan created successfully!')
      handleClose()
      dispatch(getSubscriptionPlans()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to create subscription plan')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Subscription Plans</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Plan
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plan Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Max Students</TableCell>
              <TableCell>AI Usage Limit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : subscriptionPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No subscription plans found
                </TableCell>
              </TableRow>
            ) : (
              subscriptionPlans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>₹{plan.price?.toLocaleString() || 0}</TableCell>
                  <TableCell>{plan.limits?.students || 0}</TableCell>
                  <TableCell>{plan.limits?.aiUsage || 0}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Subscription Plan</DialogTitle>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Plan Name"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="BASIC">Basic</MenuItem>
              <MenuItem value="PREMIUM">Premium</MenuItem>
              <MenuItem value="ENTERPRISE">Enterprise</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Price"
              name="price"
              type="number"
              fullWidth
              required
              value={formData.price}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Features
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.features.aiSummary}
                  onChange={handleChange}
                  name="features.aiSummary"
                />
              }
              label="AI Summary"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.features.industryAssessments}
                  onChange={handleChange}
                  name="features.industryAssessments"
                />
              }
              label="Industry Assessments"
            />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Limits
            </Typography>
            <TextField
              margin="dense"
              label="Max Students"
              name="limits.students"
              type="number"
              fullWidth
              value={formData.limits.students}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="AI Usage Limit"
              name="limits.aiUsage"
              type="number"
              fullWidth
              value={formData.limits.aiUsage}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={creating}>
              {creating ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default SubscriptionPlans
