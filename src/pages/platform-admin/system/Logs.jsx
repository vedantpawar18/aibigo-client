import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import {
  getLogFiles,
  getRecentLogs,
  getLogStatistics,
  readLogFile,
} from '../../../store/slices/logsSlice'

const Logs = () => {
  const dispatch = useDispatch()
  const { logFiles, recentLogs, logStatistics, currentLogFile, loading, error } = useSelector(
    (state) => state.logs
  )

  const [selectedFile, setSelectedFile] = useState(null)
  const [logDialogOpen, setLogDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    lines: 50,
    level: '',
    search: '',
  })

  useEffect(() => {
    dispatch(getLogFiles())
    dispatch(getRecentLogs({ lines: 50 }))
    dispatch(getLogStatistics())
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(getLogFiles())
    dispatch(getRecentLogs({ lines: filters.lines, level: filters.level || undefined, search: filters.search || undefined }))
    dispatch(getLogStatistics())
  }

  const handleViewFile = (filename) => {
    setSelectedFile(filename)
    dispatch(readLogFile({ filename, params: { lines: 100 } }))
    setLogDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setLogDialogOpen(false)
    setSelectedFile(null)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const parseLogLine = (logLine) => {
    try {
      return JSON.parse(logLine)
    } catch {
      return { message: logLine, level: 'info' }
    }
  }

  const getLogLevelColor = (level) => {
    const levelUpper = level?.toUpperCase()
    if (levelUpper === 'ERROR') return 'error'
    if (levelUpper === 'WARN') return 'warning'
    if (levelUpper === 'INFO') return 'info'
    return 'default'
  }

  if (loading && !logFiles.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Log Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* Statistics */}
      {logStatistics && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Log Statistics
          </Typography>
          <Box display="flex" gap={3} flexWrap="wrap">
            <Typography>
              <strong>Total Files:</strong> {logStatistics.totalFiles || 0}
            </Typography>
            <Typography>
              <strong>Total Size:</strong> {formatFileSize(logStatistics.totalSize || 0)}
            </Typography>
            {logStatistics.levels && (
              <>
                <Chip label={`Errors: ${logStatistics.levels.error || 0}`} color="error" size="small" />
                <Chip label={`Warnings: ${logStatistics.levels.warn || 0}`} color="warning" size="small" />
                <Chip label={`Info: ${logStatistics.levels.info || 0}`} color="info" size="small" />
                <Chip label={`Debug: ${logStatistics.levels.debug || 0}`} size="small" />
              </>
            )}
          </Box>
        </Paper>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Lines"
            type="number"
            value={filters.lines}
            onChange={(e) => setFilters({ ...filters, lines: parseInt(e.target.value) || 50 })}
            size="small"
            sx={{ minWidth: 100 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Log Level</InputLabel>
            <Select
              value={filters.level}
              label="Log Level"
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="error">Error</MenuItem>
              <MenuItem value="warn">Warning</MenuItem>
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="debug">Debug</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            size="small"
            sx={{ flexGrow: 1, maxWidth: 300 }}
          />
          <Button variant="outlined" onClick={handleRefresh} disabled={loading}>
            Apply Filters
          </Button>
        </Box>
      </Paper>

      {/* Log Files */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Log Files</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Filename</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Modified</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="textSecondary">No log files found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logFiles.map((file) => (
                  <TableRow key={file.filename}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <DescriptionIcon fontSize="small" />
                        {file.filename}
                      </Box>
                    </TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>{formatDate(file.created)}</TableCell>
                    <TableCell>{formatDate(file.modified)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewFile(file.filename)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Recent Logs */}
      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Recent Logs</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="textSecondary">No recent logs</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recentLogs.map((log, index) => {
                  const logData = parseLogLine(log.log)
                  return (
                    <TableRow key={index}>
                      <TableCell>{log.file}</TableCell>
                      <TableCell>
                        <Chip
                          label={logData.level || 'info'}
                          color={getLogLevelColor(logData.level)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 400 }}>
                          {logData.message || log.log}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {logData.timestamp ? formatDate(logData.timestamp) : '-'}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Log File Dialog */}
      <Dialog open={logDialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Log File: {selectedFile}</Typography>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : currentLogFile ? (
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Total Lines: {currentLogFile.totalLines} | Showing: {currentLogFile.returnedLines}
              </Typography>
              <Box
                sx={{
                  bgcolor: 'grey.900',
                  color: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  maxHeight: 500,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              >
                {currentLogFile.lines && currentLogFile.lines.length > 0 ? (
                  currentLogFile.lines.map((line, index) => {
                    const logData = parseLogLine(line)
                    return (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography
                          component="pre"
                          sx={{
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {JSON.stringify(logData, null, 2)}
                        </Typography>
                      </Box>
                    )
                  })
                ) : (
                  <Typography color="textSecondary">No log lines found</Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Typography color="textSecondary">No log data available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Logs
