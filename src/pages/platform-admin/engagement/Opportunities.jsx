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
import { createOpportunity, getOpportunities } from '../../../store/slices/engagementSlice'
import { toast } from 'react-toastify'

const Opportunities = () => {
  const dispatch = useDispatch()
  const { opportunities, loading } = useSelector((state) => state.engagement)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    type: 'JOB',
    title: '',
    organization: '',
    description: '',
    applyUrl: '',
    expiryDate: '',
  })

  useEffect(() => {
    if (opportunities.length === 0) {
      dispatch(getOpportunities())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({
      type: 'JOB',
      title: '',
      organization: '',
      description: '',
      applyUrl: '',
      expiryDate: '',
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createOpportunity(formData)).unwrap()
      toast.success('Opportunity created successfully!')
      handleClose()
      dispatch(getOpportunities()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to create opportunity')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Opportunities</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Opportunity
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Expiry Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : opportunities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No opportunities found
                </TableCell>
              </TableRow>
            ) : (
              opportunities.map((opportunity) => (
                <TableRow key={opportunity._id}>
                  <TableCell>{opportunity.type}</TableCell>
                  <TableCell>{opportunity.title}</TableCell>
                  <TableCell>{opportunity.organization}</TableCell>
                  <TableCell>{new Date(opportunity.expiryDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Opportunity</DialogTitle>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Type"
              name="type"
              fullWidth
              required
              value={formData.type}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="JOB">Job</MenuItem>
              <MenuItem value="INTERNSHIP">Internship</MenuItem>
              <MenuItem value="WORKSHOP">Workshop</MenuItem>
              <MenuItem value="COMPETITION">Competition</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Title"
              name="title"
              fullWidth
              required
              value={formData.title}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Organization"
              name="organization"
              fullWidth
              required
              value={formData.organization}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              required
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Apply URL"
              name="applyUrl"
              fullWidth
              type="url"
              value={formData.applyUrl}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Expiry Date"
              name="expiryDate"
              fullWidth
              required
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.expiryDate}
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

export default Opportunities
