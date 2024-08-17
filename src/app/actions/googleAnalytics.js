'use server'
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Replace with your Google Analytics 4 property ID
const propertyId = '440811286';

// Initialize the Analytics Data API client
const analyticsDataClient = new BetaAnalyticsDataClient();

export async function realTimeActiveUsersReport() {
  // Run the report
  const [response] = await analyticsDataClient.runRealtimeReport({
    property: `properties/${propertyId}`,
    dimensions: [
      {
        name: 'unifiedScreenName',
      },
      {
        name: 'minutesAgo',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'minutesAgo',
        stringFilter: {
          matchType: 'EXACT',
          value: '00', // Only include users active in the current minute
        },
      },
    },
  });


  let data = []
  response.rows.forEach(row => {
    data.push({ pagePath: row.dimensionValues[0].value, activeUsers: row.metricValues[0].value })
  })
  return data
}

export async function ActiveUsersReport() {
  // Run the report
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '7daysAgo',
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        name: 'pagePath',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
    ],
  });


  let data = []
  response.rows.forEach(row => {
    data.push({ pagePath: row.dimensionValues[0].value, activeUsers: row.metricValues[0].value })
  })
  return data
}



