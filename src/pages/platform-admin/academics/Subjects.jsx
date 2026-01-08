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
import { createSubject, getSubjects, getPrograms, getUniversities } from '../../../store/slices/academicsSlice'
import { toast } from 'react-toastify'

const Subjects = () => {
  const dispatch = useDispatch()
  const { subjects, programs, universities, loading } = useSelector((state) => state.academics)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [filters, setFilters] = useState({
    universityId: null,
    programId: null,
  })
  const [formData, setFormData] = useState({
    programId: '',
    universityId: '',
    academicYear: 1,
    subjectName: '',
    subjectCode: '',
  })

  useEffect(() => {
    if (subjects.length === 0) {
      dispatch(getSubjects())
    }
    if (programs.length === 0) {
      dispatch(getPrograms())
    }
    if (universities.length === 0) {
      dispatch(getUniversities())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({ programId: '', universityId: '', academicYear: 1, subjectName: '', subjectCode: '' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // If university is changed, clear program selection
    if (name === 'universityId') {
      setFormData({
        ...formData,
        universityId: value,
        programId: '' // Clear program when university changes
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Get filtered programs based on selected university
  const filteredPrograms = formData.universityId
    ? programs.filter((program) => {
        const programUniversityId =
          typeof program.universityId === 'object' && program.universityId
            ? program.universityId._id
            : program.universityId
        return programUniversityId === formData.universityId
      })
    : programs

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createSubject(formData)).unwrap()
      toast.success('Subject created successfully!')
      handleClose()
      dispatch(getSubjects()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to create subject')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Subjects</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Subject
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
            dispatch(getSubjects({ universityId: e.target.value || undefined }))
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
          label="Filter by Program"
          size="small"
          sx={{ minWidth: 200 }}
          value={filters.programId || ''}
          onChange={(e) => {
            const newFilters = { ...filters, programId: e.target.value || null }
            setFilters(newFilters)
            dispatch(getSubjects({ programId: e.target.value || undefined }))
          }}
        >
          <MenuItem value="">All Programs</MenuItem>
          {programs
            .filter((program) => {
              if (!filters.universityId) return true
              const programUniversityId =
                typeof program.universityId === 'object' && program.universityId
                  ? program.universityId._id
                  : program.universityId
              return programUniversityId === filters.universityId
            })
            .map((program) => (
              <MenuItem key={program._id} value={program._id}>
                {program.name} ({program.code})
              </MenuItem>
            ))}
        </TextField>
        <Button
          variant="outlined"
          onClick={() => {
            setFilters({ universityId: null, programId: null })
            dispatch(getSubjects())
          }}
        >
          Clear Filters
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject Name</TableCell>
              <TableCell>Subject Code</TableCell>
              <TableCell>Academic Year</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>University</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No subjects found
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((subject) => (
                <TableRow key={subject._id}>
                  <TableCell>{subject.subjectName}</TableCell>
                  <TableCell>{subject.subjectCode}</TableCell>
                  <TableCell>{subject.academicYear}</TableCell>
                  <TableCell>
                    {typeof subject.programId === 'object' && subject.programId
                      ? subject.programId.name
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {typeof subject.universityId === 'object' && subject.universityId
                      ? subject.universityId.name
                      : typeof subject.programId === 'object' &&
                        subject.programId &&
                        typeof subject.programId.universityId === 'object' &&
                        subject.programId.universityId
                      ? subject.programId.universityId.name
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Subject</DialogTitle>
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
              select
              margin="dense"
              label="Program"
              name="programId"
              fullWidth
              required
              value={formData.programId}
              onChange={handleChange}
              disabled={!formData.universityId}
              sx={{ mb: 2 }}
              helperText={!formData.universityId ? 'Please select a university first' : ''}
            >
              {filteredPrograms.map((program) => (
                <MenuItem key={program._id} value={program._id}>
                  {program.name} ({program.code})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Academic Year"
              name="academicYear"
              type="number"
              fullWidth
              required
              value={formData.academicYear}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Subject Name"
              name="subjectName"
              fullWidth
              required
              value={formData.subjectName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Subject Code"
              name="subjectCode"
              fullWidth
              required
              value={formData.subjectCode}
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

export default Subjects
