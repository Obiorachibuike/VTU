export default function AdminSignupDisabled() {
  return (
    <main style={{ maxWidth: 640, margin: '10vh auto', padding: 28, fontFamily: 'sans-serif', lineHeight: 1.6 }}>
      <h1>Administrator accounts are provisioned securely</h1>
      <p>Public registration cannot grant administrator permissions. An operator must run the server’s secure admin-provisioning command after setting up the database.</p>
      <p>See <code>Server/README.md</code> for setup steps.</p>
      <a href="/admin_login">Go to administrator sign in</a>
    </main>
  );
}
