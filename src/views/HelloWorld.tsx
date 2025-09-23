import { useEffect, useState } from "react";

import PageLayout from "../components/layout/PageLayout";

import { HelloWorldApi } from "../services/helloworld-api";

function HelloWorld() {
  const [helloWorld, setHelloWorld] = useState<string>("");
  useEffect(() => {
    (async () => {
      const result = await HelloWorldApi.getHelloWorld();
      if (result.isOk()) {
        setHelloWorld(result.unwrap());
      } else if (result.isErr()) {
        setHelloWorld(result.unwrap().message);
      }
    });
  }, []);

  return (
    <PageLayout>
      <>{helloWorld}</>
    </PageLayout>
  );
}

export default HelloWorld;
