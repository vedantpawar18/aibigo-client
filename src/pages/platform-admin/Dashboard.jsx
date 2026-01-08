import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Grid, Paper, Typography, CircularProgress, Card, CardContent } from '@mui/material'
import { getDashboardOverview } from '../../store/slices/platformAdminSlice'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { dashboardOverview, loading, error } = useSelector((state) => state.platformAdmin)

  useEffect(() => {
    dispatch(getDashboardOverview())
  }, [dispatch])

  // Debug: Log the data when it changes
  useEffect(() => {
    if (dashboardOverview) {
      console.log('Dashboard Overview Data:', dashboardOverview)
    }
  }, [dashboardOverview])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  // Show empty state if no data
  if (!loading && !dashboardOverview) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No data available. Please try refreshing the page.
        </Typography>
      </Box>
    )
  }

  const stats = dashboardOverview
    ? [
        {
          title: 'Total Institutes',
          value: dashboardOverview.institutes?.total ?? 0,
          subtitle: `${dashboardOverview.institutes?.active ?? 0} active`,
        },
        {
          title: 'Active Subscriptions',
          value: dashboardOverview.subscriptionsExpiring ?? 0,
        },
        {
          title: 'Total Students',
          value: dashboardOverview.studentsCount ?? 0,
        },
        {
          title: 'Active Opportunities',
          value: dashboardOverview.activeOpportunities ?? 0,
        },
        {
          title: 'Active Assessments',
          value: dashboardOverview.activeAssessments ?? 0,
        },
        {
          title: 'Monthly Revenue',
          value: `₹${((dashboardOverview.monthlyRevenue ?? 0)).toLocaleString()}`,
        },
      ]
    : []

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h4" component="div">
                  {stat.value}
                </Typography>
                {stat.subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {stat.subtitle}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Dashboard
