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
import { createAssessment, getAssessments, getIndustryPartners } from '../../../store/slices/engagementSlice'
import { toast } from 'react-toastify'

const Assessments = () => {
  const dispatch = useDispatch()
  const { assessments, industryPartners, loading } = useSelector((state) => state.engagement)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    partnerId: '',
    name: '',
    skillCategory: '',
    timeLimit: 60,
  })

  useEffect(() => {
    if (assessments.length === 0) {
      dispatch(getAssessments())
    }
    if (industryPartners.length === 0) {
      dispatch(getIndustryPartners())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({ partnerId: '', name: '', skillCategory: '', timeLimit: 60 })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createAssessment(formData)).unwrap()
      toast.success('Assessment created successfully!')
      handleClose()
      dispatch(getAssessments()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to create assessment')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Industry Assessments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Assessment
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Skill Category</TableCell>
              <TableCell>Time Limit (min)</TableCell>
              <TableCell>Industry Partner</TableCell>
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
            ) : assessments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No assessments found
                </TableCell>
              </TableRow>
            ) : (
              assessments.map((assessment) => (
                <TableRow key={assessment._id}>
                  <TableCell>{assessment.name}</TableCell>
                  <TableCell>{assessment.skillCategory}</TableCell>
                  <TableCell>{assessment.timeLimit}</TableCell>
                  <TableCell>
                    {typeof assessment.partnerId === 'object' && assessment.partnerId
                      ? assessment.partnerId.name
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{assessment.isActive ? 'Active' : 'Inactive'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Assessment</DialogTitle>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Industry Partner"
              name="partnerId"
              fullWidth
              required
              value={formData.partnerId}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {industryPartners.map((partner) => (
                <MenuItem key={partner._id} value={partner._id}>
                  {partner.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Assessment Name"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Skill Category"
              name="skillCategory"
              fullWidth
              required
              value={formData.skillCategory}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Time Limit (minutes)"
              name="timeLimit"
              type="number"
              fullWidth
              required
              value={formData.timeLimit}
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

export default Assessments
