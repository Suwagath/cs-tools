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
 * Encode a path segment for shareable URLs: spaces become "-", literal "-" become "--",
 * then encodeURIComponent.
 */
export const toUrlFriendly = (segment: string): string => {
  const escapedHyphens = segment.replace(/-/g, '--');
  const spaced = escapedHyphens.replace(/\s+/g, '-');
  return encodeURIComponent(spaced);
};

const DASH_LITERAL_HOLD = '\uE000';

function unescapeDashSegment(raw: string): string {
  return raw
    .split('--')
    .map((chunk) => chunk.replace(/-/g, ' '))
    .join(DASH_LITERAL_HOLD)
    .replace(new RegExp(DASH_LITERAL_HOLD, 'g'), '-');
}

export const fromUrlFriendly = (segment: string): string => {
  if (segment.includes('%20')) {
    return decodeURIComponent(segment);
  }
  const raw = decodeURIComponent(segment);
  if (!raw.includes('-')) {
    return raw;
  }
  return unescapeDashSegment(raw);
};

/**
 * Map browser pathname to Azure file share path.
 * - Each URL segment is decoded with {@link fromUrlFriendly}.
 * - If the first segment is `patches`, it is stripped (legacy links).
 * - Last segment must be `.pdf`.
 */
export function pathnameToPdfStoragePath(pathname: string): string | null {
  const trimmed = pathname.trim().replace(/\/+$/, '');
  const rawSegments = trimmed.split('/').filter((s) => s.length > 0);
  if (rawSegments.length === 0) {
    return null;
  }
  const decoded = rawSegments.map((s) => fromUrlFriendly(s));
  const last = decoded[decoded.length - 1];
  if (!/\.pdf$/i.test(last)) {
    return null;
  }
  let rest = decoded;
  if (rest[0] === 'patches') {
    rest = rest.slice(1);
  }
  if (rest.length === 0) {
    return null;
  }
  return rest.join('/');
}
