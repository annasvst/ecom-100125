export default async function Admin() {
  const posts = await fetch(
    'https://jsonplaceholder.typicode.com/posts',
  ).then((response) => response.json());

  if (posts) {
    return (
      <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
        <h1>Admin page</h1>
        {posts.map((post) => (
          <p key={post.title}>{post.title}</p>
        ))}
      </div>
    );
  }
}
