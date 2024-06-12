import { useEffect, useState } from "react";
import { HelloWorldApi } from "../services/hello_world_api";

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