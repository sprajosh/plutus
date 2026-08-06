import { auth } from '@/lib/auth';
import { SettingsContent } from './SettingsContent';

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;

  return <SettingsContent user={user ?? null} />;
}
