// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/**
 * Format bytes to human-readable size
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Convert segment to URL-friendly format (spaces -> hyphens, preserve real hyphens)
 * Uses a marker to distinguish real hyphens from space-hyphens
 * @param segment - Original segment (e.g., "August Special" or "August-Special")
 * @returns URL-friendly segment (e.g., "August-Special" or "August--Special")
 */
export const toUrlFriendly = (segment: string): string => {
  // First, escape existing hyphens by doubling them
  const escapedHyphens = segment.replace(/-/g, '--');
  // Then replace spaces with single hyphens
  return escapedHyphens.replace(/ /g, '-');
};

/**
 * Convert URL-friendly segment back to original format
 * @param segment - URL segment (e.g., "August-Special" or "August--Special")
 * @returns Original segment (e.g., "August Special" or "August-Special")
 */
export const fromUrlFriendly = (segment: string): string => {
  // First, replace single hyphens (from spaces) with spaces
  const withSpaces = segment.replace(/-/g, ' ');
  // Then, restore double spaces (from real hyphens) back to single hyphens
  return withSpaces.replace(/ {2}/g, '-');
};

/**
 * Parse path segments from URL path
 * @param path - URL path (e.g., "August-Special/file.pdf")
 * @returns Array of path segments with original names restored
 */
export const parsePathSegments = (path: string): string[] => {
  if (!path) return [];
  const segments = path.split('/').filter((segment) => segment.length > 0);
  return segments.map((segment) => fromUrlFriendly(segment));
};

/**
 * Build API path from path segments
 * @param segments - Array of path segments with original names
 * @returns Path string with trailing slash for API calls
 */
export const buildPath = (segments: string[]): string => {
  if (segments.length === 0) return '';
  return segments.join('/') + '/';
};

/**
 * Build URL path from path segments (spaces -> hyphens)
 * @param segments - Array of path segments
 * @param fileName - Optional file name to append
 * @returns URL-friendly path string
 */
export const buildUrlPath = (segments: string[], fileName?: string): string => {
  if (segments.length === 0 && !fileName) return '/';
  
  const pathSegments = segments.map((segment) => toUrlFriendly(segment));
  let urlPath = '/' + pathSegments.join('/');
  
  if (fileName) {
    urlPath += (pathSegments.length > 0 ? '/' : '') + toUrlFriendly(fileName);
  }
  
  return urlPath;
};