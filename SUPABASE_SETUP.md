# Supabase Setup Guide

## Overview
This application uses Supabase for collaborative photo storage and canvas state persistence. Each user's photos become the canvas base for the next user.

## Setup Steps

### 1. Create Supabase Project
- Go to [https://supabase.com](https://supabase.com)
- Sign up/login and create a new project
- Choose your region and set a password

### 2. Get API Keys
Once your project is created:
1. Go to **Settings** → **API**
2. Copy:
   - `Project URL` → This is your `VITE_SUPABASE_URL`
   - `anon` public key → This is your `VITE_SUPABASE_ANON_KEY`

### 3. Setup Environment Variables
Create or update `.env.local` in the project root:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### 4. Create Storage Bucket
1. In Supabase, go to **Storage**
2. Create a new bucket called **`art-together-photos`**
3. Make it **Public** (enable public access)
4. Under **Policies**, ensure public access is enabled for uploads

### 5. Create Database Table
1. Go to **SQL Editor** in Supabase
2. Run this SQL to create the `canvas_states` table:

```sql
CREATE TABLE canvas_states (
  id BIGSERIAL PRIMARY KEY,
  canvas_id TEXT NOT NULL UNIQUE,
  latest_photo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE canvas_states ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON canvas_states
  FOR SELECT USING (true);

-- Create policy for public insert/update access
CREATE POLICY "Enable insert and update for all users" ON canvas_states
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON canvas_states
  FOR UPDATE USING (true);
```

### 6. Verify Setup
- Try uploading a photo on a canvas
- Check the Supabase Storage console to see the uploaded file
- Check the Database to see the saved canvas state
- Refresh the page - you should see the uploaded photo as the new base

## How It Works

1. **Photo Upload**: When a user confirms a photo, it's uploaded to the `art-together-photos` bucket
2. **Canvas State Save**: The image URL is saved in the `canvas_states` table for that canvas ID
3. **Next User Load**: When the next user opens the canvas, the app fetches the latest photo URL and uses it as the canvas base instead of the original artwork
4. **Layering**: The original gray layer and character overlays still work, now applied over the user-submitted photo

## File Structure

- `src/lib/supabaseClient.ts` - Supabase client initialization and helper functions
- `src/pages/CanvasView.tsx` - Main canvas component with photo upload/retrieval logic
- `.env.local` - Environment variables (not committed to version control)

## Security Notes

- The setup uses public access for demonstration purposes
- For production, implement proper RLS (Row Level Security) policies
- Consider adding rate limiting and file size validation
- Implement authentication to track contributor information

## Troubleshooting

**Photos not uploading?**
- Check browser console for errors
- Verify Storage bucket is public
- Check CORS settings in Supabase

**Photos not loading on next visit?**
- Clear browser cache
- Check Database contains the canvas_state record
- Verify the image URL in the Storage console

**Environment variables not working?**
- Restart your dev server after updating .env.local
- Ensure variables start with `VITE_` prefix for Vite
