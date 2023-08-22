import React from "react";

export interface BaseProvider<T, R> {
  iniReducer(value: [T, React.Dispatch<R>]): void;

  sendDispatch(value: R): void;

  getState(): T;

  reducer(prevState: T, action: R): T;
}

export abstract class BaseProviderImpl<T, R> implements BaseProvider<T, R> {
  protected state: T;
  protected dispatch: React.Dispatch<R> | null = null;

  constructor(data: T) {
    this.state = data;
  }

  iniReducer(value: [T, React.Dispatch<R>]): void {
    if (!value || value.length < 0) {
      throw new Error("reduce not implemented.");
    }

    this.state = value[0];
    this.dispatch = value[1];
  }

  abstract reducer(prevState: T, action: R): T;

  sendDispatch(value: R) {
    if (!this.dispatch) {
      return;
    }

    this.dispatch(value);
  }

  getState(): T {
    return this.state as T;
  }
}
