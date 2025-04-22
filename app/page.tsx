import Link from 'next/link';

export default async function Home() {
  return (
    <div>
      <h1>Welcome to My Notes App</h1>
      <p>
        <Link href="/login">Log In</Link> to get started.
      </p>
    </div>
  );
}