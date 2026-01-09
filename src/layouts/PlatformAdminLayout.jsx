import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon,
  AccountTree as AccountTreeIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  ExpandLess,
  ExpandMore,
  Article as ArticleIcon,
} from '@mui/icons-material'
import { logout } from '../store/slices/authSlice'
import { toast } from 'react-toastify'

const drawerWidth = 280

const menuItems = [
  { label: 'Dashboard', path: '/platform-admin/dashboard', icon: <DashboardIcon /> },
  {
    label: 'Academic Setup',
    icon: <SchoolIcon />,
    children: [
      { label: 'Universities', path: '/platform-admin/academics/universities' },
      { label: 'Programs', path: '/platform-admin/academics/programs' },
      { label: 'Subjects', path: '/platform-admin/academics/subjects' },
      { label: 'Chapters', path: '/platform-admin/academics/chapters' },
    ],
  },
  {
    label: 'Engagement',
    icon: <WorkIcon />,
    children: [
      { label: 'Opportunities', path: '/platform-admin/engagement/opportunities' },
      { label: 'Industry Partners', path: '/platform-admin/engagement/industry-partners' },
      { label: 'Assessments', path: '/platform-admin/engagement/assessments' },
      { label: 'Courses', path: '/platform-admin/engagement/courses' },
    ],
  },
  { label: 'Institutes', path: '/platform-admin/institutes', icon: <AccountTreeIcon /> },
  {
    label: 'Business',
    icon: <BusinessIcon />,
    children: [
      { label: 'Subscription Plans', path: '/platform-admin/business/subscription-plans' },
      { label: 'Payments', path: '/platform-admin/business/payments' },
    ],
  },
  {
    label: 'System',
    icon: <SettingsIcon />,
    children: [
      { label: 'Admin Users', path: '/platform-admin/system/admin-users' },
      { label: 'Platform Settings', path: '/platform-admin/system/platform-settings' },
      { label: 'Analytics', path: '/platform-admin/system/analytics' },
      { label: 'Audit Logs', path: '/platform-admin/system/audit-logs' },
      { label: 'Application Logs', path: '/platform-admin/system/logs', icon: <ArticleIcon /> },
    ],
  },
]

const PlatformAdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState({})
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuToggle = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          AiBigo Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleMenuToggle(item.label)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    {openMenus[item.label] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                {openMenus[item.label] && (
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        sx={{ pl: 4 }}
                        selected={location.pathname === child.path}
                        onClick={() => navigate(child.path)}
                      >
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            )}
          </div>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Platform Administration
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">{user?.email}</Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default PlatformAdminLayout
