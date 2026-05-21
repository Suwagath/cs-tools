// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
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

export interface LowerTopBannerConfig {
  enabled: boolean;
  html: string;
  closeable: boolean;
  storageKey: string;
}

export const lowerTopBannerConfig: LowerTopBannerConfig = {
  enabled: window.config?.CUSTOMER_PORTAL_LOWER_TOP_BANNER_ENABLED ?? false,
  html: window.config?.CUSTOMER_PORTAL_LOWER_TOP_BANNER_HTML ?? "",
  closeable: window.config?.CUSTOMER_PORTAL_LOWER_TOP_BANNER_CLOSEABLE ?? true,
  storageKey: window.config?.CUSTOMER_PORTAL_LOWER_TOP_BANNER_STORAGE_KEY ?? "lower_top_banner_v1",
};
