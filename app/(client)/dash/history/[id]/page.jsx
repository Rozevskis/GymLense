export default async function HistoryItem({ params }) {
    const { id } = params;
  
    try {
      const response = await fetch("/api/user/update", {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
      }
  
      const user = await response.json();
      console.log('Fetched user:', user);
  
      return (
        <section>
          <h1>jebal</h1>
        </section>
      );
  
    } catch (error) {
      console.error('Error fetching user:', error.message);
  
      return (
        <section>
          <h1>Failed to load user</h1>
        </section>
      );
    }
  }