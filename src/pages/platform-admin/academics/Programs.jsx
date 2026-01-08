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
  FormControlLabel,
  Switch,
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { createProgram, getPrograms, getUniversities } from '../../../store/slices/academicsSlice'
import { toast } from 'react-toastify'

const Programs = () => {
  const dispatch = useDispatch()
  const { universities, programs, loading: universitiesLoading } = useSelector((state) => state.academics)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    universityId: null,
    isActive: null,
  })
  const [formData, setFormData] = useState({
    universityId: '',
    name: '',
    code: '',
    durationYears: 4,
    isActive: true,
  })

  useEffect(() => {
    // Only fetch if universities array is empty and not currently loading
    if (universities.length === 0 && !universitiesLoading) {
      dispatch(getUniversities())
    }
    // Fetch programs on mount
    if (programs.length === 0) {
      dispatch(getPrograms())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({ universityId: '', name: '', code: '', durationYears: 4, isActive: true })
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await dispatch(createProgram(formData)).unwrap()
      toast.success('Program created successfully!')
      handleClose()
      dispatch(getPrograms()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to create program')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Degree Programs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Program
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Filter by University"
          size="small"
          sx={{ minWidth: 200 }}
          value={filters.universityId || ''}
          onChange={(e) => {
            const newFilters = { ...filters, universityId: e.target.value || null }
            setFilters(newFilters)
            dispatch(getPrograms({ universityId: e.target.value || undefined }))
          }}
        >
          <MenuItem value="">All Universities</MenuItem>
          {universities.map((university) => (
            <MenuItem key={university._id} value={university._id}>
              {university.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Filter by Status"
          size="small"
          sx={{ minWidth: 150 }}
          value={filters.isActive === null ? '' : filters.isActive ? 'true' : 'false'}
          onChange={(e) => {
            const isActive = e.target.value === '' ? null : e.target.value === 'true'
            const newFilters = { ...filters, isActive }
            setFilters(newFilters)
            dispatch(getPrograms({ isActive: e.target.value || undefined }))
          }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="true">Active</MenuItem>
          <MenuItem value="false">Inactive</MenuItem>
        </TextField>
        <Button
          variant="outlined"
          onClick={() => {
            setFilters({ universityId: null, isActive: null })
            dispatch(getPrograms())
          }}
        >
          Clear Filters
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Program Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>University</TableCell>
              <TableCell>Duration (Years)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(() => {
              // Filter programs based on filters
              const filteredPrograms = programs.filter((program) => {
                if (filters.universityId) {
                  const programUniversityId =
                    typeof program.universityId === 'object' && program.universityId
                      ? program.universityId._id
                      : program.universityId
                  if (programUniversityId !== filters.universityId) return false
                }
                if (filters.isActive !== null) {
                  if (program.isActive !== filters.isActive) return false
                }
                return true
              })

              if (filteredPrograms.length === 0) {
                return (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No programs found
                    </TableCell>
                  </TableRow>
                )
              }

              return filteredPrograms.map((program) => (
                <TableRow key={program._id}>
                  <TableCell>{program.name}</TableCell>
                  <TableCell>{program.code}</TableCell>
                  <TableCell>
                    {typeof program.universityId === 'object' && program.universityId
                      ? program.universityId.name
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{program.durationYears}</TableCell>
                  <TableCell>{program.isActive ? 'Active' : 'Inactive'}</TableCell>
                </TableRow>
              ))
            })()}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Degree Program</DialogTitle>
          <DialogContent>
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
              margin="dense"
              label="Program Name"
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
              label="Duration (Years)"
              name="durationYears"
              type="number"
              fullWidth
              required
              value={formData.durationYears}
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

export default Programs
