import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material'
import { forgotPassword, clearError } from '../../store/slices/authSlice'

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    setSuccess(false)

    try {
      await dispatch(forgotPassword(email)).unwrap()
      setSuccess(true)
      toast.success('Password reset email sent!')
    } catch (err) {
      toast.error(err || 'Failed to send reset email')
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            AiBigo
          </Typography>
          <Typography component="h2" variant="h6" align="center" color="text.secondary" gutterBottom>
            Forgot Password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
              Password reset email sent! Please check your inbox.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default ForgotPassword
