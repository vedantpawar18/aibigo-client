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
import { createAnalyticsTrigger, getAnalyticsTriggers } from '../../../store/slices/systemSlice'
import { toast } from 'react-toastify'

const Analytics = () => {
  const dispatch = useDispatch()
  const { analyticsTriggers, loading } = useSelector((state) => state.system)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    triggerType: 'DAILY',
    reportType: 'USAGE',
    config: '{}',
    isActive: true,
  })

  useEffect(() => {
    if (analyticsTriggers.length === 0) {
      dispatch(getAnalyticsTriggers())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({ triggerType: 'DAILY', reportType: 'USAGE', config: '{}', isActive: true })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      let parsedConfig = {}
      try {
        parsedConfig = JSON.parse(formData.config)
      } catch {
        toast.error('Invalid JSON in config field')
        setCreating(false)
        return
      }

      await dispatch(
        createAnalyticsTrigger({
          triggerType: formData.triggerType,
          reportType: formData.reportType,
          config: parsedConfig,
          isActive: formData.isActive,
        })
      ).unwrap()
      toast.success('Analytics trigger created successfully!')
      handleClose()
      dispatch(getAnalyticsTriggers()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to create analytics trigger')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Analytics Triggers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Trigger
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trigger Type</TableCell>
              <TableCell>Report Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Run</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : analyticsTriggers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No analytics triggers found
                </TableCell>
              </TableRow>
            ) : (
              analyticsTriggers.map((trigger) => (
                <TableRow key={trigger._id}>
                  <TableCell>{trigger.triggerType}</TableCell>
                  <TableCell>{trigger.reportType}</TableCell>
                  <TableCell>
                    <Chip
                      label={trigger.isActive ? 'Active' : 'Inactive'}
                      color={trigger.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {trigger.lastRunAt ? new Date(trigger.lastRunAt).toLocaleString() : 'Never'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Analytics Trigger</DialogTitle>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Trigger Type"
              name="triggerType"
              fullWidth
              required
              value={formData.triggerType}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="DAILY">Daily</MenuItem>
              <MenuItem value="WEEKLY">Weekly</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
              <MenuItem value="CUSTOM">Custom</MenuItem>
            </TextField>
            <TextField
              select
              margin="dense"
              label="Report Type"
              name="reportType"
              fullWidth
              required
              value={formData.reportType}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="USAGE">Usage</MenuItem>
              <MenuItem value="PERFORMANCE">Performance</MenuItem>
              <MenuItem value="REVENUE">Revenue</MenuItem>
              <MenuItem value="ENGAGEMENT">Engagement</MenuItem>
              <MenuItem value="CUSTOM">Custom</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Config (JSON)"
              name="config"
              fullWidth
              multiline
              rows={4}
              value={formData.config}
              onChange={handleChange}
              sx={{ mb: 2 }}
              helperText="Enter JSON configuration object"
            />
            <TextField
              select
              margin="dense"
              label="Status"
              name="isActive"
              fullWidth
              value={formData.isActive ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
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

export default Analytics
