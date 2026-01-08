import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { createUniversity, getUniversities } from '../../../store/slices/academicsSlice'
import { toast } from 'react-toastify'

const Universities = () => {
  const dispatch = useDispatch()
  const { universities, loading } = useSelector((state) => state.academics)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    state: '',
    country: '',
    isActive: true,
  })

  useEffect(() => {
    // Only fetch if universities array is empty and not currently loading
    if (universities.length === 0 && !loading) {
      dispatch(getUniversities())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({ name: '', code: '', state: '', country: '', isActive: true })
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(createUniversity(formData)).unwrap()
      toast.success('University created successfully!')
      handleClose()
      dispatch(getUniversities())
    } catch (error) {
      toast.error(error || 'Failed to create university')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Universities</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add University
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
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
            ) : universities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No universities found
                </TableCell>
              </TableRow>
            ) : (
              universities.map((university) => (
                <TableRow key={university._id}>
                  <TableCell>{university.name}</TableCell>
                  <TableCell>{university.code}</TableCell>
                  <TableCell>{university.state}</TableCell>
                  <TableCell>{university.country}</TableCell>
                  <TableCell>{university.isActive ? 'Active' : 'Inactive'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add University</DialogTitle>
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
              label="Code"
              name="code"
              fullWidth
              required
              value={formData.code}
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
              margin="dense"
              label="Country"
              name="country"
              fullWidth
              required
              value={formData.country}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange}
                  name="isActive"
                />
              }
              label="Active"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default Universities
