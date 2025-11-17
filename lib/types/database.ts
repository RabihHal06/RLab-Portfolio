export interface Admin {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  about_me: string;
  mission: string;
  vision: string;
  primary_email: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  instagram_url: string;
  logo_path: string;
  small_logo_path: string;
  created_at: string;
  updated_at: string;
}

export type ResumeCategory = 'experience' | 'education' | 'skills' | 'awards';

export interface ResumeItem {
  id: string;
  category: ResumeCategory;
  title: string;
  subtitle: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ResumePDFFile {
  id: string;
  file_path: string;
  display_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type BusinessStatus = 'planned' | 'in-progress' | 'live';

export interface Business {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  website_url: string;
  status: BusinessStatus;
  main_modules: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessScreenshot {
  id: string;
  business_id: string;
  title: string;
  description: string;
  image_path: string;
  is_main: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type CertificateStatus = 'in_progress' | 'completed';

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string;
  credential_url: string;
  category: string;
  file_path: string;
  status: CertificateStatus;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type AutomationStatus = 'active' | 'archived';
export type ComplexityLevel = 'easy' | 'medium' | 'advanced';

export interface AIAutomation {
  id: string;
  title: string;
  platform: string;
  short_description: string;
  detailed_description: string;
  business_context: string;
  tags: string[];
  tools_used: string[];
  complexity_level: ComplexityLevel;
  time_saved: string;
  roi_description: string;
  screenshot_path: string;
  status: AutomationStatus;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 'planned' | 'in-progress' | 'completed';

export interface FreelanceProject {
  id: string;
  client_name: string;
  project_title: string;
  status: ProjectStatus;
  project_type: string;
  industry: string;
  short_description: string;
  detailed_description: string;
  start_date: string | null;
  end_date: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type AssetType = 'dashboard' | 'screenshot' | 'document';

export interface FreelanceAsset {
  id: string;
  project_id: string;
  asset_type: AssetType;
  title: string;
  description: string;
  file_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type MessageStatus = 'pending' | 'read' | 'archived';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
}
