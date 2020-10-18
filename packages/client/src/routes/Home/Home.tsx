import React, { useEffect, useState } from "react";
import { SkeletonText } from "carbon-components-react";

import { AuthApi, UserApi } from "api";

const Home = () => {
  const { id: _id, token } = AuthApi.authentication();

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await UserApi.readUser({ _id, token });
      setIsLoading(false);
      setName(user.name);
    };

    fetchUser();
  }, [_id, token, setIsLoading, setName]);

  return (
    <div>
      {isLoading ? (
        <SkeletonText heading width="200px" />
      ) : (
        <h1>Welcome, {name}</h1>
      )}
    </div>
  );
};

export default Home;
