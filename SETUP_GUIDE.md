# R-Lab Portfolio Setup Guide

## Getting Started with Data

You have two options to start filling your portfolio with data:

---

## Option A: Use the Admin Dashboard (Recommended)

### Step 1: Create Your First Admin User

You need to create an admin account before you can access the dashboard at `/admin`.

**Method 1: Using Supabase Dashboard (Easiest)**

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter your email and password
5. Click **Create user**
6. Copy the user's UUID (you'll need it next)

7. Go to **SQL Editor** in Supabase
8. Run this SQL command (replace with your UUID and name):

```sql
INSERT INTO admins (user_id, full_name, role)
VALUES ('your-user-uuid-here', 'Rabih El Halabi', 'admin');
```

**Method 2: Using Service Role Key**

If you have the service role key, you can run:

```bash
# Install ts-node if needed
npm install -g ts-node

# Create admin user
ts-node scripts/create-admin.ts your-email@example.com your-password "Rabih El Halabi"
```

### Step 2: Login to Admin Dashboard

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/admin/login`
3. Login with your email and password
4. You'll be redirected to the admin dashboard

### Step 3: Fill in Your Data

Start with **Site Settings** to configure:
- Hero title and subtitle
- About me section
- Mission and vision
- Contact email and location
- Social media links

---

## Option B: Add Data Directly via Supabase SQL

If you prefer to add data directly, you can use the Supabase SQL Editor.

### 1. Site Settings (Start Here)

```sql
UPDATE site_settings
SET
  hero_title = 'Welcome to R-Lab',
  hero_subtitle = 'Digital Innovation & Business Intelligence Portfolio',
  about_me = 'Passionate digital innovator specializing in data analytics, AI automation, and business intelligence solutions. Founder of multiple ventures including Rabela Pastry, TrackLane, and KlickT.',
  mission = 'To deliver cutting-edge digital solutions that transform business operations through AI and data analytics.',
  vision = 'To be a leading force in AI-driven business innovation across the MENA region.',
  primary_email = 'rabih@rlab.com',
  location = 'Lebanon',
  linkedin_url = 'https://linkedin.com/in/your-profile',
  github_url = 'https://github.com/your-profile',
  updated_at = now()
WHERE id = (SELECT id FROM site_settings LIMIT 1);
```

### 2. Add Resume Items

**Experience:**
```sql
INSERT INTO resume_items (category, title, subtitle, location, start_date, end_date, is_current, description, order_index)
VALUES
  ('experience', 'Founder & CEO', 'Rabela Pastry', 'Lebanon', '2020-01-01', NULL, true, 'Leading a premium pastry business with focus on quality and innovation.', 1),
  ('experience', 'Data Analyst', 'TrackLane', 'Lebanon', '2021-06-01', NULL, true, 'Building data analytics and business intelligence solutions.', 2);
```

**Education:**
```sql
INSERT INTO resume_items (category, title, subtitle, location, start_date, end_date, description, order_index)
VALUES
  ('education', 'Bachelor of Computer Science', 'University Name', 'Lebanon', '2015-09-01', '2019-06-01', 'Specialized in data science and artificial intelligence.', 1);
```

**Skills:**
```sql
INSERT INTO resume_items (category, title, description, order_index)
VALUES
  ('skills', 'Data Analytics', 'Power BI, Tableau, SQL', 1),
  ('skills', 'AI Automation', 'Make.com, n8n, Zapier', 2),
  ('skills', 'Programming', 'Python, JavaScript, TypeScript', 3),
  ('skills', 'Business Intelligence', 'Dashboard design, KPI tracking', 4);
```

### 3. Add Businesses

```sql
INSERT INTO businesses (name, slug, short_description, long_description, website_url, status, main_modules, order_index)
VALUES
  (
    'Rabela Pastry',
    'rabela-pastry',
    'Premium artisan pastry business delivering excellence',
    'Rabela Pastry is a premium pastry business focused on delivering high-quality artisan products. We combine traditional techniques with modern innovation.',
    'https://rabelapastry.com',
    'live',
    '["Online Ordering System", "Inventory Management", "Customer Portal", "Delivery Tracking"]'::jsonb,
    1
  ),
  (
    'TrackLane',
    'tracklane',
    'Business intelligence and analytics platform',
    'TrackLane provides comprehensive business intelligence solutions helping companies make data-driven decisions.',
    'https://tracklane.com',
    'in-progress',
    '["Real-time Dashboards", "Custom Reports", "KPI Tracking", "Data Integration"]'::jsonb,
    2
  ),
  (
    'KlickT',
    'clickt',
    'Digital marketing and automation platform',
    'KlickT streamlines digital marketing workflows with powerful automation capabilities.',
    'https://klickt.com',
    'planned',
    '["Marketing Automation", "Campaign Management", "Analytics", "Social Media Integration"]'::jsonb,
    3
  );
```

### 4. Add Certificates

```sql
INSERT INTO certificates (title, issuer, issue_date, category, credential_id, credential_url, order_index)
VALUES
  ('Google Data Analytics Professional Certificate', 'Google', '2023-06-15', 'Data Analytics', 'CERT123456', 'https://coursera.org/verify/CERT123456', 1),
  ('Microsoft Power BI Data Analyst', 'Microsoft', '2023-03-20', 'Business Intelligence', 'MS-PBI-2023', '', 2),
  ('AWS Certified Cloud Practitioner', 'Amazon Web Services', '2022-11-10', 'Cloud Computing', 'AWS-CCP-2022', '', 3);
```

### 5. Add AI Automations

```sql
INSERT INTO ai_automations (title, platform, short_description, business_context, tags, status)
VALUES
  (
    'Automated Order Processing',
    'Make.com',
    'Fully automated order processing workflow that handles customer orders from submission to fulfillment.',
    'Reduced order processing time by 80% and eliminated manual data entry errors. Integrates with payment systems, inventory, and delivery platforms.',
    ARRAY['Make.com', 'Webhooks', 'API Integration', 'Automation'],
    'active'
  ),
  (
    'Customer Sentiment Analysis',
    'Make.com',
    'AI-powered sentiment analysis of customer feedback and reviews.',
    'Automatically analyzes customer feedback across multiple channels, categorizes sentiment, and alerts team to urgent issues.',
    ARRAY['AI', 'NLP', 'Customer Service', 'Analytics'],
    'active'
  );
```

### 6. Add Freelance Projects

```sql
INSERT INTO freelance_projects (client_name, project_title, status, project_type, industry, short_description, detailed_description, start_date, end_date, tags)
VALUES
  (
    'Tech Startup Inc',
    'Sales Analytics Dashboard',
    'completed',
    'Business Intelligence',
    'Technology',
    'Built comprehensive sales analytics dashboard with real-time KPI tracking.',
    'Developed a Power BI dashboard that provides real-time visibility into sales performance, customer acquisition costs, and revenue trends. Integrated multiple data sources and created automated reporting workflows.',
    '2023-08-01',
    '2023-10-15',
    ARRAY['Power BI', 'SQL', 'Data Modeling', 'ETL']
  ),
  (
    'Retail Company Ltd',
    'Inventory Optimization System',
    'in-progress',
    'Data Analytics',
    'Retail',
    'AI-powered inventory optimization and demand forecasting system.',
    'Building a machine learning model to predict demand and optimize inventory levels across multiple retail locations. Includes automated reordering and supplier management.',
    '2024-01-10',
    NULL,
    ARRAY['Python', 'Machine Learning', 'Forecasting', 'Data Science']
  );
```

---

## File Uploads (Images, PDFs, Screenshots)

For uploading files like:
- Resume PDFs
- Business screenshots
- Certificate images
- AI automation screenshots
- Project assets

You'll need to:

1. **Via Admin Dashboard:** Use the admin interface (when fully built) to upload files
2. **Via Supabase Dashboard:**
   - Go to **Storage** in your Supabase dashboard
   - Select the appropriate bucket (resume, business-screenshots, certificates, etc.)
   - Upload your files
   - Copy the file path
   - Update your database records with the file path

3. **Programmatically:**
   ```typescript
   import { supabase, uploadFile } from '@/lib/supabase';

   const { path, error } = await uploadFile('certificates', 'my-cert.pdf', file);
   ```

---

## Quick Start Checklist

- [ ] Create admin user account
- [ ] Login to admin dashboard at `/admin/login`
- [ ] Update site settings (hero, about, contact)
- [ ] Add resume items (experience, education, skills)
- [ ] Upload resume PDF
- [ ] Add your businesses with descriptions
- [ ] Upload business screenshots
- [ ] Add professional certificates
- [ ] Upload certificate images
- [ ] Document your AI automations
- [ ] Add freelance projects
- [ ] Test all public pages

---

## Need Help?

The admin dashboard currently has basic settings management. For full CRUD operations on other entities, you can either:

1. **Use SQL Editor** in Supabase (as shown above)
2. **Build out the admin CRUD pages** (placeholder pages are ready for expansion)
3. **Use Supabase Table Editor** directly in the dashboard for visual editing

The database structure is complete and ready to accept all your data!
