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
import { createAdminUser, getAdminUsers } from '../../../store/slices/systemSlice'
import { toast } from 'react-toastify'

const AdminUsers = () => {
  const dispatch = useDispatch()
  const { adminUsers, loading } = useSelector((state) => state.system)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'OPERATIONS_ADMIN',
  })

  useEffect(() => {
    dispatch(getAdminUsers())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({ name: '', email: '', role: 'OPERATIONS_ADMIN' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createAdminUser(formData)).unwrap()
      toast.success('Admin user created successfully!')
      handleClose()
      dispatch(getAdminUsers()) // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to create admin user')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Admin Users</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Create Admin User
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
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
            ) : adminUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No admin users found
                </TableCell>
              </TableRow>
            ) : (
              adminUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status || 'ACTIVE'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create Admin User</DialogTitle>
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
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Role"
              name="role"
              fullWidth
              required
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="OPERATIONS_ADMIN">Operations Admin</MenuItem>
              <MenuItem value="FACULTY">Faculty</MenuItem>
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

export default AdminUsers
