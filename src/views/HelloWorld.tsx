import { useEffect, useState } from "react";

import PageLayout from "../components/layout/PageLayout";

import { helloWorldApi } from "../services/helloworld-api";

function HelloWorld() {
  const [helloWorld, setHelloWorld] = useState<string>("");

  useEffect(() => {
    const helloWorld = async () => {
      const result = await helloWorldApi.getHelloWorld();

      if (result.isOk()) {
        setHelloWorld(result.unwrap());
      } else if (result.isErr()) {
        setHelloWorld(result.unwrap().message);
      }
    };

    helloWorld();
  }, []);

  return (
    <PageLayout>
      <>{helloWorld}</>
    </PageLayout>
  );
}

export default HelloWorld;
