import { useEffect, useState } from "react";
import { HelloWorldApi } from "../services/helloworld-api";

function HelloWorld() {
  const [helloWorld, setHelloWorld] = useState<string>("");
  useEffect(() => {
    HelloWorldApi.getHelloWorld().then((helloWorld) => {
      setHelloWorld(helloWorld);
    });
  }, []);

  return <div>{helloWorld}</div>;
}

export default HelloWorld;
