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
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { createCourse, getCourses } from '../../../store/slices/engagementSlice'
import { toast } from 'react-toastify'

const Courses = () => {
  const dispatch = useDispatch()
  const { courses, loading } = useSelector((state) => state.engagement)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    price: 0,
    registrationUrl: '',
    visibilityRules: {
      programs: [],
      plans: [],
    },
    isActive: true,
  })

  useEffect(() => {
    if (courses.length === 0) {
      dispatch(getCourses())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({
      title: '',
      description: '',
      duration: '',
      price: 0,
      registrationUrl: '',
      visibilityRules: { programs: [], plans: [] },
      isActive: true,
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('visibilityRules.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        visibilityRules: { ...formData.visibilityRules, [field]: value.split(',').filter(Boolean) },
      })
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createCourse(formData)).unwrap()
      toast.success('Course created successfully!')
      handleClose()
      dispatch(getCourses()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to create course')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Upskilling & AIBIGO Courses</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Course
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Title</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>₹{course.price?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={course.isActive ? 'Active' : 'Inactive'}
                      color={course.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Course</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Course Title"
              name="title"
              fullWidth
              required
              value={formData.title}
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
              rows={3}
              value={formData.description}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Duration"
              name="duration"
              fullWidth
              required
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 12 weeks"
              sx={{ mb: 2 }}
            />
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
            <TextField
              margin="dense"
              label="Registration URL"
              name="registrationUrl"
              type="url"
              fullWidth
              value={formData.registrationUrl}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Visible Plans (comma-separated)"
              name="visibilityRules.plans"
              fullWidth
              value={formData.visibilityRules.plans.join(',')}
              onChange={handleChange}
              placeholder="BASIC, PREMIUM, ENTERPRISE"
              helperText="Enter plan names separated by commas"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch checked={formData.isActive} onChange={handleChange} name="isActive" />
              }
              label="Active"
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

export default Courses
