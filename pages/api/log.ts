import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { ApiResponse } from "../../types";
import { createError, logError } from "../../utils/errorHandler";
import { sanitizeString } from "../../utils/validation";

interface LegacyLogRequestBody {
  // Legacy format for backward compatibility
  seed_id?: string;
  timezone?: string;
  bug_report?: string;
  session_duration?: number | string;
  additional_info?: string;
  path_taken?: string;
  
  // New enhanced format
  userAgent?: string;
  url?: string;
  timestamp?: string;
  action?: string;
  type?: string;
  data?: any;
  sessionId?: string;
  userId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    const error = createError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
    logError(error, 'log API');
    return res.status(405).json({
      success: false,
      error: error.message,
    });
  }

  try {
    const body: LegacyLogRequestBody = req.body;
    
    // Enhanced logging entry with sanitization
    const baseLogEntry = {
      timestamp: body.timestamp || new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: body.userAgent || req.headers['user-agent'],
      receivedAt: new Date().toISOString(),
      sessionId: body.sessionId,
      userId: body.userId,
    };

    // Handle legacy format (existing Supabase structure)
    if (body.seed_id || body.bug_report) {
      const sessionDurationInt = Number(body.session_duration) || 0;
      
      const legacyEntry = {
        seed_id: body.seed_id ? sanitizeString(body.seed_id, 100) : null,
        timezone: body.timezone ? sanitizeString(body.timezone, 50) : null,
        bug_report: body.bug_report ? sanitizeString(body.bug_report, 2000) : null,
        session_duration: sessionDurationInt,
        additional_info: body.additional_info ? sanitizeString(body.additional_info, 1000) : null,
        path_taken: body.path_taken ? sanitizeString(body.path_taken, 500) : null,
        // Add enhanced fields
        user_agent: baseLogEntry.userAgent,
        ip_address: baseLogEntry.ip,
        session_id: baseLogEntry.sessionId,
        received_at: baseLogEntry.receivedAt,
      };

      const { data, error } = await supabase
        .from("seedfinder_logs")
        .insert([legacyEntry]);

      if (error) {
        const appError = createError(
          `Supabase insert error: ${error.message}`,
          'DATABASE_ERROR',
          500,
          error
        );
        logError(appError, 'log API - Supabase');
        return res.status(500).json({
          success: false,
          error: appError.message,
        });
      }

      return res.status(200).json({ 
        success: true, 
        data,
        message: 'Legacy log entry saved successfully'
      });
    }
    
    // Handle new enhanced format
    const enhancedEntry = {
      ...baseLogEntry,
      type: body.type || 'general',
      action: body.action ? sanitizeString(body.action, 200) : null,
      url: body.url ? sanitizeString(body.url, 500) : null,
      data: body.data || null,
    };

    // TODO: Store enhanced logs in a separate table or expand current schema
    console.log("Enhanced user action logged:", enhancedEntry);

    // For now, enhanced logs are just console logged
    // In the future, these will be stored in an enhanced table structure
    // const { data, error } = await supabase
    //   .from('enhanced_logs')
    //   .insert([enhancedEntry]);

    res.status(200).json({ 
      success: true,
      message: 'Enhanced log entry processed successfully'
    });
  } catch (err) {
    const appError = createError(
      'Failed to process log entry',
      'INTERNAL_ERROR',
      500,
      err
    );
    logError(appError, 'log API');
    
    res.status(500).json({
      success: false,
      error: appError.message,
    });
  }
}
