import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

export const flagBodaInvitation = flag<boolean>({
  key: 'flag-boda-invitation',
  defaultValue: false,
  decide: () => false,
  adapter: process.env.FLAGS ? vercelAdapter() : undefined,
});