import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Button,
  MenuItem,
  Pagination,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { getAuditLogs } from '../../../store/slices/systemSlice'
import { toast } from 'react-toastify'

const AuditLogs = () => {
  const dispatch = useDispatch()
  const { auditLogs, pagination, loading } = useSelector((state) => state.system)
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50,
  })

  useEffect(() => {
    dispatch(getAuditLogs(filters))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only fetch on mount

  useEffect(() => {
    // Refetch when filters change (but not on initial mount)
    const timeoutId = setTimeout(() => {
      dispatch(getAuditLogs(filters))
    }, 300) // Debounce filter changes
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.userId, filters.action, filters.startDate, filters.endDate, filters.page])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 })
  }

  const handlePageChange = (event, value) => {
    setFilters({ ...filters, page: value })
  }

  const handleSearch = () => {
    dispatch(getAuditLogs(filters))
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Audit Logs
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="User ID"
          name="userId"
          value={filters.userId}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          select
          label="Action"
          name="action"
          value={filters.action}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="LOGIN_SUCCESS">Login Success</MenuItem>
          <MenuItem value="LOGIN_FAILURE">Login Failure</MenuItem>
          <MenuItem value="PASSWORD_RESET">Password Reset</MenuItem>
          <MenuItem value="ROLE_ASSIGNMENT">Role Assignment</MenuItem>
          <MenuItem value="ADMIN_CREATION">Admin Creation</MenuItem>
          <MenuItem value="ACCOUNT_SUSPENSION">Account Suspension</MenuItem>
        </TextField>
        <TextField
          label="Start Date"
          name="startDate"
          type="datetime-local"
          value={filters.startDate}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="End Date"
          name="endDate"
          type="datetime-local"
          value={filters.endDate}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : auditLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              auditLogs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>
                    {typeof log.userId === 'object' && log.userId !== null
                      ? log.userId.email || log.userId._id || 'N/A'
                      : log.userId || 'N/A'}
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.ip || 'N/A'}</TableCell>
                  <TableCell>{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  )
}

export default AuditLogs
