/** Central list of social networks shown in the footer and contact page. */
export const SOCIAL_NETWORKS = [
  { id: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp', setting: 'whatsapp', build: (v) => `https://wa.me/${String(v).replace(/\D/g, '')}` },
  { id: 'instagram', icon: 'instagram', label: 'Instagram', setting: 'instagram', fallback: 'https://instagram.com/ciarvip' },
  { id: 'facebook', icon: 'facebook', label: 'Facebook', setting: 'facebook', fallback: 'https://facebook.com/ciarvip' },
  { id: 'twitter', icon: 'twitter', label: 'X', setting: 'twitter', fallback: 'https://x.com/ciarvip' },
  { id: 'tiktok', icon: 'tiktok', label: 'TikTok', setting: 'tiktok', fallback: 'https://tiktok.com/@ciarvip' },
  { id: 'youtube', icon: 'youtube', label: 'YouTube', setting: 'youtube', fallback: 'https://youtube.com/@ciarvip' },
  { id: 'linkedin', icon: 'linkedin', label: 'LinkedIn', setting: 'linkedin', fallback: 'https://linkedin.com/company/ciarvip' },
  { id: 'snapchat', icon: 'snapchat', label: 'Snapchat', setting: 'snapchat', fallback: 'https://www.snapchat.com/add/ciarvip' },
  { id: 'telegram', icon: 'telegram', label: 'Telegram', setting: 'telegram', fallback: 'https://t.me/ciarvip' },
  { id: 'pinterest', icon: 'pinterest', label: 'Pinterest', setting: 'pinterest', fallback: 'https://pinterest.com/ciarvip' },
  { id: 'threads', icon: 'threads', label: 'Threads', setting: 'threads', fallback: 'https://www.threads.net/@ciarvip' },
  { id: 'discord', icon: 'discord', label: 'Discord', setting: 'discord', fallback: 'https://discord.gg/ciarvip' }
]

export function getSocialLinks(settings = {}) {
  return SOCIAL_NETWORKS.map((n) => {
    const raw = settings[n.setting]
    const href = n.build ? n.build(raw || n.fallback || '') : raw || n.fallback
    return { id: n.id, icon: n.icon, label: n.label, href }
  }).filter((n) => n.href)
}
