import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

export const flagBodaInvitation = flag({
  key: 'flag-boda-invitation',
  adapter: vercelAdapter(),
});