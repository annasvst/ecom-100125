
export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/`);

  if (!res.ok) {
    return <div>No user details are found!</div>
  }
  const {user} = await res.json()
console.log( user)

  if (user) {
    return (
      <div className='font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
        <h1>User data</h1>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
    );
  }
}
