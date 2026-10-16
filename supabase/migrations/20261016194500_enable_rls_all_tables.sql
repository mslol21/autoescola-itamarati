-- Enable Row Level Security (RLS) on all public tables and restrict access to service_role only.
begin;

alter table public.admin_users enable row level security;
alter table public.contact_leads enable row level security;
alter table public.courses enable row level security;
alter table public.faqs enable row level security;
alter table public.hero_config enable row level security;
alter table public.news enable row level security;
alter table public.services enable row level security;
alter table public.site_settings enable row level security;
alter table public.testimonials enable row level security;

revoke all on table
  public.admin_users,
  public.contact_leads,
  public.courses,
  public.faqs,
  public.hero_config,
  public.news,
  public.services,
  public.site_settings,
  public.testimonials
from anon, authenticated;

grant select, insert, update, delete on table
  public.admin_users,
  public.contact_leads,
  public.courses,
  public.faqs,
  public.hero_config,
  public.news,
  public.services,
  public.site_settings,
  public.testimonials
to service_role;

commit;
