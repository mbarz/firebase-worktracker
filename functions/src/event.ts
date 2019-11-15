export interface AppEvent {
  type: string;
}

export declare interface TypedAppEvent<T extends string> extends AppEvent {
  readonly type: T;
}
export declare const typePropertyIsNotAllowedMsg =
  'type property is not allowed in action creators';
declare type TypePropertyIsNotAllowed = typeof typePropertyIsNotAllowedMsg;
export declare type DisallowTypeProperty<T> = T extends {
  type: any;
}
  ? TypePropertyIsNotAllowed
  : T;

export declare type Creator<
  P extends any[] = any[],
  R extends object = object
> = R extends {
  type: any;
}
  ? TypePropertyIsNotAllowed
  : FunctionWithParametersType<P, R>;

export declare type PropsReturnType<T extends object> = T extends {
  type: any;
}
  ? TypePropertyIsNotAllowed
  : {
      _as: 'props';
      _p: T;
    };

export declare type EventCreator<
  T extends string = string,
  C extends Creator = Creator
> = C & TypedAppEvent<T>;

export declare type FunctionWithParametersType<
  P extends unknown[],
  R = void
> = (...args: P) => R;

export function props<P extends object>(): PropsReturnType<P> {
  return {} as PropsReturnType<P>;
}

export function createEventFactory<T extends string, P extends object>(
  type: T,
  _config: {
    _as: 'props';
    _p: P;
  }
): EventCreator<T, (props: P) => P & TypedAppEvent<T>> {
  const fn = function(data: P) {
    return { type, ...data };
  };
  fn.type = type;
  return fn as any;
}

export class EventListener {
  constructor(
    public fn: (event: AppEvent) => void,
    public detach: () => void
  ) {}
}

export class AppEventProxy {
  private readonly listeners: EventListener[] = [];

  on<T extends string, P>(
    eventCreator: EventCreator<T, (props: P) => P & TypedAppEvent<T>>,
    callback: (
      e: ReturnType<EventCreator<T, (props: P) => P & TypedAppEvent<T>>>
    ) => void
  ) {
    const listener: EventListener = new EventListener(
      e => {
        if (e.type === eventCreator.type) {
          callback(e as any);
        }
      },
      () => this.detachListener(listener)
    );
    return this.attachListener(listener);
  }

  dispatch(event: AppEvent) {
    for (const listener of this.listeners) {
      listener.fn(event);
    }
    return event;
  }

  attachListener(listener: EventListener) {
    this.listeners.push(listener);
    return listener;
  }
  detachListener(listener: EventListener) {
    const index = this.listeners.indexOf(listener);
    this.listeners.splice(index, 1);
  }
}
