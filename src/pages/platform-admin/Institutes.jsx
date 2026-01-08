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
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { createInstitute, getInstitutes } from '../../store/slices/institutesSlice'
import { getUniversities } from '../../store/slices/academicsSlice'
import { getSubscriptionPlans } from '../../store/slices/businessSlice'
import { toast } from 'react-toastify'

const Institutes = () => {
  const dispatch = useDispatch()
  const { institutes, loading, error } = useSelector((state) => state.institutes)
  const { universities } = useSelector((state) => state.academics)
  const { subscriptionPlans } = useSelector((state) => state.business)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    universityId: '',
    subscriptionPlanId: '',
  })

  useEffect(() => {
    if (institutes.length === 0) {
      dispatch(getInstitutes())
    }
    if (universities.length === 0) {
      dispatch(getUniversities())
    }
    if (subscriptionPlans.length === 0) {
      dispatch(getSubscriptionPlans())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({ name: '', state: '', universityId: '', subscriptionPlanId: '' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createInstitute(formData)).unwrap()
      toast.success('Institute created successfully!')
      handleClose()
      dispatch(getInstitutes()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to create institute')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Institutes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Institute
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell>University</TableCell>
              <TableCell>Subscription Plan</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : institutes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No institutes found
                </TableCell>
              </TableRow>
            ) : (
              institutes.map((institute) => (
                <TableRow key={institute._id}>
                  <TableCell>{institute.name}</TableCell>
                  <TableCell>{institute.state}</TableCell>
                  <TableCell>
                    {typeof institute.universityId === 'object' && institute.universityId
                      ? institute.universityId.name
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {typeof institute.subscriptionPlanId === 'object' && institute.subscriptionPlanId
                      ? `${institute.subscriptionPlanId.name} - ₹${institute.subscriptionPlanId.price?.toLocaleString()}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{institute.isActive ? 'Active' : 'Inactive'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Institute</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="State"
              name="state"
              fullWidth
              required
              value={formData.state}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="University"
              name="universityId"
              fullWidth
              required
              value={formData.universityId}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {universities.map((university) => (
                <MenuItem key={university._id} value={university._id}>
                  {university.name}
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
            >
              {subscriptionPlans.map((plan) => (
                <MenuItem key={plan._id} value={plan._id}>
                  {plan.name} - ₹{plan.price?.toLocaleString()}
                </MenuItem>
              ))}
            </TextField>
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

export default Institutes
