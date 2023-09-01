import React, {useState, useEffect} from 'react';

import queryString from 'query-string';

const Home = ({ location }) => {
  const { code } = queryString.parse(location.search);

  const [greeting, setGreeting] = useState('none');
  
  return (
    <div>
      <h1>Home</h1>
      <h4>{greeting}</h4>
    </div>
  )
};

export default Home;


// This is where we are redirecting our login in to. We will have autho code called code and we need to get that from the params which is why we use queryString and location