import { NextApiRequest, NextApiResponse } from 'next';
import { BugReportData, ApiResponse } from '../../types';
import { createError, logError } from '../../utils/errorHandler';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    const error = createError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
    logError(error, 'bug-report API');
    return res.status(405).json({
      success: false,
      error: error.message,
    });
  }

  try {
    const bugReport: BugReportData = req.body;

    // Validate required fields
    if (!bugReport.userAgent || !bugReport.url || !bugReport.timestamp) {
      const error = createError('Missing required fields', 'VALIDATION_ERROR', 400);
      logError(error, 'bug-report API');
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Enhanced logging structure for bug reports
    const enhancedReport = {
      ...bugReport,
      receivedAt: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    // TODO: Store in database (Supabase integration will be added here)
    console.log('Bug Report Received:', JSON.stringify(enhancedReport, null, 2));

    // For now, we'll just log it. In the future, this will be stored in Supabase
    // const { data, error } = await supabase
    //   .from('bug_reports')
    //   .insert([enhancedReport]);

    res.status(200).json({
      success: true,
      message: 'Bug report submitted successfully',
      data: { reportId: `report_${Date.now()}` },
    });
  } catch (error) {
    const appError = createError(
      'Failed to process bug report',
      'INTERNAL_ERROR',
      500,
      error
    );
    logError(appError, 'bug-report API');
    
    res.status(500).json({
      success: false,
      error: appError.message,
    });
  }
}