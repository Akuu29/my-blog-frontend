import { useEffect, useState } from "react";

import PageLayout from "../components/layout/PageLayout";

import { HelloWorldApi } from "../services/helloworld-api";

function HelloWorld() {
  const [helloWorld, setHelloWorld] = useState<string>("");
  useEffect(() => {
    HelloWorldApi.getHelloWorld().then((helloWorld) => {
      setHelloWorld(helloWorld);
    });
  }, []);

  return (
    <PageLayout>
      <>{helloWorld}</>
    </PageLayout>
  );
}

export default HelloWorld;
