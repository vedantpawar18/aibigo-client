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
import { createChapter, getChapters, getSubjects, getPrograms, getUniversities } from '../../../store/slices/academicsSlice'
import { toast } from 'react-toastify'

const Chapters = () => {
  const dispatch = useDispatch()
  const { chapters, subjects, programs, universities, loading } = useSelector((state) => state.academics)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [filters, setFilters] = useState({
    universityId: null,
    programId: null,
    subjectId: null,
  })
  const [formData, setFormData] = useState({
    subjectId: '',
    programId: '',
    universityId: '',
    chapterNumber: 1,
    chapterTitle: '',
  })

  useEffect(() => {
    if (chapters.length === 0) {
      dispatch(getChapters())
    }
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
    setFormData({ subjectId: '', programId: '', universityId: '', chapterNumber: 1, chapterTitle: '' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // If subject is selected, auto-populate programId and universityId
    if (name === 'subjectId') {
      const selectedSubject = subjects.find(s => s._id === value)
      const subjectProgramId =
        typeof selectedSubject?.programId === 'object' && selectedSubject.programId
          ? selectedSubject.programId._id
          : selectedSubject?.programId
      const subjectUniversityId =
        typeof selectedSubject?.universityId === 'object' && selectedSubject.universityId
          ? selectedSubject.universityId._id
          : selectedSubject?.universityId ||
            (typeof selectedSubject?.programId === 'object' &&
            selectedSubject.programId &&
            typeof selectedSubject.programId.universityId === 'object' &&
            selectedSubject.programId.universityId
              ? selectedSubject.programId.universityId._id
              : selectedSubject?.programId?.universityId)
      setFormData({
        ...formData,
        subjectId: value,
        programId: subjectProgramId || '',
        universityId: subjectUniversityId || ''
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createChapter(formData)).unwrap()
      toast.success('Chapter created successfully!')
      handleClose()
      dispatch(getChapters()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to create chapter')
    } finally {
      setCreating(false)
    }
  }

  // Filter subjects based on selected filters
  const filteredSubjects = subjects.filter((subject) => {
    if (filters.universityId) {
      const subjectUniversityId =
        typeof subject.universityId === 'object' && subject.universityId
          ? subject.universityId._id
          : subject.universityId ||
            (typeof subject.programId === 'object' &&
            subject.programId &&
            typeof subject.programId.universityId === 'object' &&
            subject.programId.universityId
              ? subject.programId.universityId._id
              : subject.programId?.universityId)
      if (subjectUniversityId !== filters.universityId) return false
    }
    if (filters.programId) {
      const subjectProgramId =
        typeof subject.programId === 'object' && subject.programId
          ? subject.programId._id
          : subject.programId
      if (subjectProgramId !== filters.programId) return false
    }
    return true
  })

  // Filter chapters for display
  const filteredChapters = chapters.filter((chapter) => {
    if (filters.universityId) {
      const chapterUniversityId =
        typeof chapter.universityId === 'object' && chapter.universityId
          ? chapter.universityId._id
          : chapter.universityId ||
            (typeof chapter.programId === 'object' &&
            chapter.programId &&
            typeof chapter.programId.universityId === 'object' &&
            chapter.programId.universityId
              ? chapter.programId.universityId._id
              : chapter.programId?.universityId) ||
            (typeof chapter.subjectId === 'object' &&
            chapter.subjectId &&
            typeof chapter.subjectId.universityId === 'object' &&
            chapter.subjectId.universityId
              ? chapter.subjectId.universityId._id
              : chapter.subjectId?.universityId)
      if (chapterUniversityId !== filters.universityId) return false
    }
    if (filters.programId) {
      const chapterProgramId =
        typeof chapter.programId === 'object' && chapter.programId
          ? chapter.programId._id
          : chapter.programId ||
            (typeof chapter.subjectId === 'object' &&
            chapter.subjectId &&
            typeof chapter.subjectId.programId === 'object' &&
            chapter.subjectId.programId
              ? chapter.subjectId.programId._id
              : chapter.subjectId?.programId)
      if (chapterProgramId !== filters.programId) return false
    }
    if (filters.subjectId) {
      const chapterSubjectId =
        typeof chapter.subjectId === 'object' && chapter.subjectId
          ? chapter.subjectId._id
          : chapter.subjectId
      if (chapterSubjectId !== filters.subjectId) return false
    }
    return true
  })

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Chapters</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Chapter
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
            const newFilters = {
              ...filters,
              universityId: e.target.value || null,
              programId: e.target.value ? filters.programId : null, // Clear program if university cleared
              subjectId: e.target.value ? filters.subjectId : null, // Clear subject if university cleared
            }
            setFilters(newFilters)
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
            const newFilters = {
              ...filters,
              programId: e.target.value || null,
              subjectId: e.target.value ? filters.subjectId : null, // Clear subject if program cleared
            }
            setFilters(newFilters)
          }}
          disabled={!filters.universityId}
        >
          <MenuItem value="">All Programs</MenuItem>
          {programs
            .filter((program) => {
              if (!filters.universityId) return false
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
        <TextField
          select
          label="Filter by Subject"
          size="small"
          sx={{ minWidth: 200 }}
          value={filters.subjectId || ''}
          onChange={(e) => {
            setFilters({ ...filters, subjectId: e.target.value || null })
          }}
          disabled={!filters.programId}
        >
          <MenuItem value="">All Subjects</MenuItem>
          {subjects
            .filter((subject) => {
              if (!filters.programId) return false
              const subjectProgramId =
                typeof subject.programId === 'object' && subject.programId
                  ? subject.programId._id
                  : subject.programId
              return subjectProgramId === filters.programId
            })
            .map((subject) => (
              <MenuItem key={subject._id} value={subject._id}>
                {subject.subjectName} ({subject.subjectCode})
              </MenuItem>
            ))}
        </TextField>
        <Button
          variant="outlined"
          onClick={() => {
            setFilters({ universityId: null, programId: null, subjectId: null })
          }}
        >
          Clear Filters
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Chapter Number</TableCell>
              <TableCell>Chapter Title</TableCell>
              <TableCell>Subject</TableCell>
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
            ) : filteredChapters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No chapters found
                </TableCell>
              </TableRow>
            ) : (
              filteredChapters.map((chapter) => (
                <TableRow key={chapter._id}>
                  <TableCell>{chapter.chapterNumber}</TableCell>
                  <TableCell>{chapter.chapterTitle}</TableCell>
                  <TableCell>
                    {typeof chapter.subjectId === 'object' && chapter.subjectId
                      ? chapter.subjectId.subjectName
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {typeof chapter.programId === 'object' && chapter.programId
                      ? chapter.programId.name
                      : typeof chapter.subjectId === 'object' &&
                        chapter.subjectId &&
                        typeof chapter.subjectId.programId === 'object' &&
                        chapter.subjectId.programId
                      ? chapter.subjectId.programId.name
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {typeof chapter.universityId === 'object' && chapter.universityId
                      ? chapter.universityId.name
                      : typeof chapter.programId === 'object' &&
                        chapter.programId &&
                        typeof chapter.programId.universityId === 'object' &&
                        chapter.programId.universityId
                      ? chapter.programId.universityId.name
                      : typeof chapter.subjectId === 'object' &&
                        chapter.subjectId &&
                        typeof chapter.subjectId.universityId === 'object' &&
                        chapter.subjectId.universityId
                      ? chapter.subjectId.universityId.name
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
          <DialogTitle>Add Chapter</DialogTitle>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="University"
              name="universityId"
              fullWidth
              required
              value={formData.universityId}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  universityId: e.target.value,
                  programId: '', // Clear program when university changes
                  subjectId: '', // Clear subject when university changes
                })
              }}
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
              onChange={(e) => {
                setFormData({
                  ...formData,
                  programId: e.target.value,
                  subjectId: '', // Clear subject when program changes
                })
              }}
              disabled={!formData.universityId}
              sx={{ mb: 2 }}
              helperText={!formData.universityId ? 'Please select a university first' : ''}
            >
              {programs
                .filter((program) => {
                  if (!formData.universityId) return false
                  const programUniversityId =
                    typeof program.universityId === 'object' && program.universityId
                      ? program.universityId._id
                      : program.universityId
                  return programUniversityId === formData.universityId
                })
                .map((program) => (
                  <MenuItem key={program._id} value={program._id}>
                    {program.name} ({program.code})
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              margin="dense"
              label="Subject"
              name="subjectId"
              fullWidth
              required
              value={formData.subjectId}
              onChange={handleChange}
              disabled={!formData.programId}
              sx={{ mb: 2 }}
              helperText={!formData.programId ? 'Please select a program first' : ''}
            >
              {subjects
                .filter((subject) => {
                  if (!formData.programId) return false
                  const subjectProgramId =
                    typeof subject.programId === 'object' && subject.programId
                      ? subject.programId._id
                      : subject.programId
                  return subjectProgramId === formData.programId
                })
                .map((subject) => (
                  <MenuItem key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectCode})
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              margin="dense"
              label="Chapter Number"
              name="chapterNumber"
              type="number"
              fullWidth
              required
              value={formData.chapterNumber}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Chapter Title"
              name="chapterTitle"
              fullWidth
              required
              value={formData.chapterTitle}
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

export default Chapters
