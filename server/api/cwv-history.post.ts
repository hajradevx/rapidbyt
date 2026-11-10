/**
 * POST /api/cwv-history
 *
 * Queries the Chrome UX Report (CrUX) History API for a given origin or URL
 * and returns 40 weeks of p75 time-series data for LCP, CLS, INP, FCP, and TTFB.
 *
 * API docs: https://developer.chrome.com/docs/crux/history-api
 *
 * The same NUXT_PAGESPEED_API_KEY used for PageSpeed Insights also works for CrUX.
 */

import { createError } from "h3";

// ── Types ──────────────────────────────────────────────────────────────

interface CruxDate {
  year: number;
  month: number;
  day: number;
}

interface CruxCollectionPeriod {
  firstDate: CruxDate;
  lastDate: CruxDate;
}

interface CruxPercentilesTimeseries {
  p75s: (number | string | null)[];
}

interface CruxHistogramBin {
  start: number;
  end?: number;
  densities: (number | "NaN" | null)[];
}

interface CruxMetric {
  histogramTimeseries: CruxHistogramBin[];
  percentilesTimeseries: CruxPercentilesTimeseries;
}

interface CruxRecord {
  key: { origin?: string; url?: string };
  metrics: Partial<{
    largest_contentful_paint: CruxMetric;
    cumulative_layout_shift: CruxMetric;
    interaction_to_next_paint: CruxMetric;
    first_contentful_paint: CruxMetric;
    experimental_time_to_first_byte: CruxMetric;
  }>;
  collectionPeriods: CruxCollectionPeriod[];
}

interface CruxApiResponse {
  record?: CruxRecord;
  error?: { code: number; message: string; status: string };
}

// ── Exported result type (used by frontend) ────────────────────────────

export interface CwvDataPoint {
  date: string; // "2024-MM-DD" — lastDate of collection period
  lcp: number | null; // ms
  cls: number | null; // score ×1000 stored as number, display ÷1000
  inp: number | null; // ms
  fcp: number | null; // ms
  ttfb: number | null; // ms
}

export interface CwvGrade {
  good: number; // 0-100 % of weeks with good score
  needsImprovement: number;
  poor: number;
}

export interface CwvHistoryResult {
  url: string;
  domain: string;
  granularity: "origin" | "url";
  dataPoints: CwvDataPoint[];
  latest: CwvDataPoint | null;
  grades: {
    lcp: CwvGrade | null;
    cls: CwvGrade | null;
    inp: CwvGrade | null;
    fcp: CwvGrade | null;
    ttfb: CwvGrade | null;
  };
  // Thresholds (for frontend reference)
  thresholds: typeof THRESHOLDS;
}

// ── Good / Needs Improvement / Poor thresholds ─────────────────────────
// Source: https://web.dev/vitals/
export const THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 }, // ms
  cls: { good: 0.1, poor: 0.25 }, // score
  inp: { good: 200, poor: 500 }, // ms
  fcp: { good: 1800, poor: 3000 }, // ms
  ttfb: { good: 800, poor: 1800 }, // ms
} as const;

// ── Helpers ────────────────────────────────────────────────────────────

const PRIVATE_HOSTNAME_RE =
  /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|0\.0\.0\.0)/i;

function assertPublicUrl(hostname: string): void {
  if (PRIVATE_HOSTNAME_RE.test(hostname)) {
    throw createError({
      statusCode: 400,
      message: "Private or loopback addresses are not allowed.",
    });
  }
}

function cruxDateToString(d: CruxDate): string {
  const mm = String(d.month).padStart(2, "0");
  const dd = String(d.day).padStart(2, "0");
  return `${d.year}-${mm}-${dd}`;
}

/**
 * CLS is stored by CrUX as a string like "0.10" in p75s.
 * Convert to a number. Returns null if not parseable.
 */
function parseP75(v: number | string | null): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : parseFloat(v as string);
  return Number.isFinite(n) ? n : null;
}

/**
 * From a histogramTimeseries compute per-week good/NI/poor percentages.
 * The CrUX histogram always has 3 bins: [0, good), [good, poor), [poor, ∞).
 */
function computeGrade(metric: CruxMetric, periodCount: number): CwvGrade {
  // Sum densities per week across all 3 bins
  const bins = metric.histogramTimeseries;
  if (bins.length < 3) return { good: 0, needsImprovement: 0, poor: 0 };

  let goodSum = 0;
  let niSum = 0;
  let poorSum = 0;
  let counted = 0;

  for (let i = 0; i < periodCount; i++) {
    const g = bins[0]?.densities[i];
    const ni = bins[1]?.densities[i];
    const p = bins[2]?.densities[i];
    if (g == null || g === "NaN" || ni == null || ni === "NaN" || p == null || p === "NaN")
      continue;
    goodSum += Number(g);
    niSum += Number(ni);
    poorSum += Number(p);
    counted++;
  }

  if (counted === 0) return { good: 0, needsImprovement: 0, poor: 0 };

  return {
    good: Math.round((goodSum / counted) * 100),
    needsImprovement: Math.round((niSum / counted) * 100),
    poor: Math.round((poorSum / counted) * 100),
  };
}

// ── Handler ────────────────────────────────────────────────────────────

export default defineEventHandler(async (event) => {
  const body = await readBody<{ url?: string; mode?: "origin" | "url" }>(event);
  const rawUrl = (body?.url ?? "").trim();
  const mode = body?.mode ?? "origin";

  if (!rawUrl) throw createError({ statusCode: 400, message: "URL is required." });

  const normalized = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw createError({ statusCode: 400, message: "Please enter a valid website URL." });
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw createError({ statusCode: 400, message: "Only http and https URLs are allowed." });
  }
  assertPublicUrl(parsed.hostname);

  const domain = parsed.hostname.replace(/^www\./, "");

  // For origin mode use scheme + hostname only
  const originUrl = `${parsed.protocol}//${parsed.hostname}`;
  const queryUrl = mode === "origin" ? originUrl : parsed.href;
  const granularity = mode === "origin" ? "origin" : "url";

  // ── CrUX History API call ──────────────────────────────────────────
  const apiKey = (useRuntimeConfig().pagespeedApiKey as string | undefined) ?? "";

  if (!apiKey || apiKey.trim() === "") {
    throw createError({
      statusCode: 503,
      message:
        "CrUX API key is not configured. Add NUXT_PAGESPEED_API_KEY to your environment. Free key: developers.google.com/speed/docs/insights/v5/get-started",
    });
  }

  const cruxEndpoint = `https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord?key=${apiKey.trim()}`;

  let cruxData: CruxApiResponse;
  try {
    cruxData = await $fetch<CruxApiResponse>(cruxEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        [granularity === "origin" ? "origin" : "url"]: queryUrl,
        collectionPeriodCount: 40,
        metrics: [
          "largest_contentful_paint",
          "cumulative_layout_shift",
          "interaction_to_next_paint",
          "first_contentful_paint",
          "experimental_time_to_first_byte",
        ],
      },
    });
  } catch (err: unknown) {
    // $fetch throws on non-2xx — extract the nested error
    const fe = err as { data?: CruxApiResponse; status?: number };
    const apiErr = fe?.data?.error;
    const httpStatus = fe?.status ?? apiErr?.code;

    if (httpStatus === 404 || apiErr?.code === 404) {
      throw createError({
        statusCode: 404,
        message:
          "No CrUX data found for this site. It may not have enough Chrome user traffic in Google's dataset yet.",
      });
    }

    // 400 from CrUX without a key still works on public quota — retry without key param
    // 403 = key is set but invalid
    if ((httpStatus === 403 || apiErr?.code === 403) && apiKey) {
      throw createError({
        statusCode: 403,
        message: "CrUX API key is invalid. Please check NUXT_PAGESPEED_API_KEY.",
      });
    }

    throw createError({
      statusCode: 502,
      message: `CrUX API error: ${apiErr?.message ?? String(err)}`.slice(0, 200),
    });
  }

  const record = cruxData.record;
  if (!record) {
    throw createError({ statusCode: 404, message: "No CrUX data found for this origin." });
  }

  const periods = record.collectionPeriods ?? [];
  const n = periods.length;
  const metrics = record.metrics;

  // ── Build data points ──────────────────────────────────────────────
  const dataPoints: CwvDataPoint[] = periods.map((period, i) => {
    const lcp = metrics.largest_contentful_paint?.percentilesTimeseries.p75s[i] ?? null;
    const cls = metrics.cumulative_layout_shift?.percentilesTimeseries.p75s[i] ?? null;
    const inp = metrics.interaction_to_next_paint?.percentilesTimeseries.p75s[i] ?? null;
    const fcp = metrics.first_contentful_paint?.percentilesTimeseries.p75s[i] ?? null;
    const ttfb = metrics.experimental_time_to_first_byte?.percentilesTimeseries.p75s[i] ?? null;

    return {
      date: cruxDateToString(period.lastDate),
      lcp: parseP75(lcp),
      cls: parseP75(cls),
      inp: parseP75(inp),
      fcp: parseP75(fcp),
      ttfb: parseP75(ttfb),
    };
  });

  // ── Latest data point ──────────────────────────────────────────────
  const latest = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1]! : null;

  // ── Compute grades (average over all weeks) ────────────────────────
  const grades: CwvHistoryResult["grades"] = {
    lcp: metrics.largest_contentful_paint
      ? computeGrade(metrics.largest_contentful_paint, n)
      : null,
    cls: metrics.cumulative_layout_shift ? computeGrade(metrics.cumulative_layout_shift, n) : null,
    inp: metrics.interaction_to_next_paint
      ? computeGrade(metrics.interaction_to_next_paint, n)
      : null,
    fcp: metrics.first_contentful_paint ? computeGrade(metrics.first_contentful_paint, n) : null,
    ttfb: metrics.experimental_time_to_first_byte
      ? computeGrade(metrics.experimental_time_to_first_byte, n)
      : null,
  };

  return {
    url: queryUrl,
    domain,
    granularity,
    dataPoints,
    latest,
    grades,
    thresholds: THRESHOLDS,
  } satisfies CwvHistoryResult;
});
