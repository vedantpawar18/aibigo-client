# Debugging Guide - API Response Issues

## Changes Made

1. **Platform Admin Slice**: Updated to handle both wrapped and unwrapped responses
2. **System Slice**: Updated audit logs handling to properly parse response structure
3. **Dashboard Component**: Added console logging and better error handling
4. **Audit Logs Component**: Fixed infinite loop issue with filter dependencies

## How to Debug

### 1. Check Browser Console

Open browser DevTools (F12) and check the Console tab. You should see:
- `Dashboard Overview Data: {...}` when dashboard data is loaded

### 2. Check Network Tab

1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Click on any API request
4. Check the "Response" tab to see the actual data structure

### 3. Check Redux DevTools (if installed)

If you have Redux DevTools extension:
1. Open Redux DevTools
2. Check the state after API calls
3. Verify `dashboardOverview`, `auditLogs`, etc. are populated

### 4. Common Issues

#### Issue: Data is fetched but not displayed

**Solution**: Check if the response structure matches what the component expects.

Example:
- Backend returns: `{ institutes: {...}, studentsCount: 123 }`
- Component expects: `dashboardOverview.institutes.total`

#### Issue: 304 Not Modified responses

**Solution**: This is normal! 304 means the browser is using cached data. Clear cache or do a hard refresh (Ctrl+Shift+R).

#### Issue: Empty arrays/objects

**Solution**: 
- Check if the backend is actually returning data
- Verify the API endpoint is correct
- Check if authentication token is valid

## Testing API Responses

You can test API responses directly using curl or Postman:

```bash
# Get dashboard overview
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/platform-admin/dashboard/overview

# Get universities
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/platform-admin/academics/universities

# Get audit logs
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/platform-admin/system/audit-logs?page=1&limit=50"
```

## Expected Response Structures

### Dashboard Overview
```json
{
  "institutes": {
    "total": 120,
    "active": 98,
    "inactive": 22
  },
  "subscriptionsExpiring": 14,
  "studentsCount": 24500,
  "activeOpportunities": 32,
  "activeAssessments": 11,
  "monthlyRevenue": 840000
}
```

### Universities (Array)
```json
[
  {
    "_id": "...",
    "name": "University Name",
    "code": "CODE",
    "state": "State",
    "country": "Country",
    "isActive": true
  }
]
```

### Audit Logs
```json
{
  "logs": [
    {
      "_id": "...",
      "userId": "...",
      "action": "LOGIN_SUCCESS",
      "ip": "192.168.1.1",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

## Next Steps

1. Check browser console for the logged dashboard data
2. Verify the response structure matches expectations
3. If data structure is different, update the Redux slices accordingly
4. Check for any JavaScript errors in the console
