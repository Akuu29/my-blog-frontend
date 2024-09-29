// Result like Rust
export abstract class Result<T, E> {
  public static ok<T, E>(value: T): Result<T, E> {
    return new Ok(value);
  }

  public static err<T, E>(err: E): Result<T, E> {
    return new Err(err);
  }

  abstract isOk(): this is Ok<T, E>;
  abstract isErr(): this is Err<T, E>;
}

export class Ok<T, E> extends Result<T, E> {
  constructor(public readonly value: T) {
    super();
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }
}

export class Err<T, E> extends Result<T, E> {
  constructor(public readonly err: E) {
    super();
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }
}