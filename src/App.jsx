import React, { useEffect, useState } from 'react';

const clientId = '7f30422fcf344285ba5f8efa37174388';
const redirectUri = 'http://localhost:3000/';
const scopes = ['user-read-private', 'user-read-email'];

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
      getAccessToken(authorizationCode).then((token) => {
        setAccessToken(token);
        fetchProfile(token).then((data) => setProfile(data));
      });
    }
  }, []);

  const getAccessToken = async (authorizationCode) => {
    const clientSecret = '3c369f894a604aa5885668c63bed3f6f';
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: redirectUri,
      }),
    });
    const data = await response.json();
    return data.access_token;
  };

  const fetchProfile = async (token) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  };

  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&response_type=code&show_dialog=true`;
    window.location.href = authUrl;
  };

  return (
    <div>
      {!accessToken ? (
        <button onClick={handleLogin}>Log in with Spotify</button>
      ) : (
        <div>
          <h1>Hello, {profile?.display_name}</h1>
          <p>Email: {profile?.email}</p>
          <img src={profile?.images[0]?.url} alt="Profile" />
        </div>
      )}
    </div>
  );
}

export default App;