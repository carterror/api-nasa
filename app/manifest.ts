import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Invitacion de boda | Carlos y Ana',
    short_name: 'Invitacion de boda',
    description: 'Invitacion de boda de Carlos y Ana',
    start_url: '/',
    display: 'standalone',
    background_color: '#c5e2ff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}