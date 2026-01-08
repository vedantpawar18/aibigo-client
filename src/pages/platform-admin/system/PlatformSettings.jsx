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
  Chip,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material'
import { upsertPlatformSetting, getPlatformSettings } from '../../../store/slices/systemSlice'
import { toast } from 'react-toastify'

const PlatformSettings = () => {
  const dispatch = useDispatch()
  const { platformSettings, loading } = useSelector((state) => state.system)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    targetPlans: ['ALL'],
    description: '',
  })

  useEffect(() => {
    if (platformSettings.length === 0) {
      dispatch(getPlatformSettings())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => {
    setFormData({ key: '', value: '', targetPlans: ['ALL'], description: '' })
    setOpen(true)
  }

  const handleEdit = (setting) => {
    setFormData({
      key: setting.key,
      value: typeof setting.value === 'object' ? JSON.stringify(setting.value) : String(setting.value),
      targetPlans: setting.targetPlans || ['ALL'],
      description: setting.description || '',
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({ key: '', value: '', targetPlans: ['ALL'], description: '' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'targetPlans') {
      setFormData({ ...formData, targetPlans: value.split(',').map((p) => p.trim()) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      // Try to parse value as JSON, if fails use as string
      let parsedValue = formData.value
      try {
        parsedValue = JSON.parse(formData.value)
      } catch {
        // If not JSON, try to parse as boolean or number
        if (formData.value === 'true' || formData.value === 'false') {
          parsedValue = formData.value === 'true'
        } else if (!isNaN(formData.value) && formData.value !== '') {
          parsedValue = Number(formData.value)
        }
      }

      await dispatch(
        upsertPlatformSetting({
          key: formData.key,
          value: parsedValue,
          targetPlans: formData.targetPlans,
          description: formData.description,
        })
      ).unwrap()
      toast.success('Platform setting saved successfully!')
      handleClose()
      dispatch(getPlatformSettings()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to save platform setting')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Platform Settings</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Setting
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Target Plans</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : platformSettings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No platform settings found
                </TableCell>
              </TableRow>
            ) : (
              platformSettings.map((setting) => (
                <TableRow key={setting._id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {setting.key}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {typeof setting.value === 'object'
                      ? JSON.stringify(setting.value)
                      : String(setting.value)}
                  </TableCell>
                  <TableCell>
                    {setting.targetPlans?.map((plan) => (
                      <Chip key={plan} label={plan} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>{setting.description || 'N/A'}</TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(setting)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{formData.key ? 'Edit Platform Setting' : 'Add Platform Setting'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Setting Key"
              name="key"
              fullWidth
              required
              value={formData.key}
              onChange={handleChange}
              disabled={!!formData.key}
              sx={{ mb: 2 }}
              helperText="Uppercase, underscore-separated (e.g., FEATURE_AI_SUMMARY)"
            />
            <TextField
              margin="dense"
              label="Value"
              name="value"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.value}
              onChange={handleChange}
              sx={{ mb: 2 }}
              helperText="Enter value (boolean: true/false, number, string, or JSON object)"
            />
            <TextField
              margin="dense"
              label="Target Plans (comma-separated)"
              name="targetPlans"
              fullWidth
              value={formData.targetPlans.join(',')}
              onChange={handleChange}
              sx={{ mb: 2 }}
              placeholder="BASIC, PREMIUM, ENTERPRISE, or ALL"
              helperText="Plans this setting applies to"
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={creating}>
              {creating ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default PlatformSettings
