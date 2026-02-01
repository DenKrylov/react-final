import { useCallback, useEffect, useRef, useState } from 'react';

type Reducer<State, Action> = (state: State, action: Action) => State;
type OptimisticAction<State, Action> = Action | ((prev: State) => Action);

type UseOptimisticHook = <State, Action = State>(
	initialState: State,
	reducer?: Reducer<State, Action>
) => [State, (action: OptimisticAction<State, Action>) => void];

export const useOptimisticValue = <State, Action = State>(
	initialState: State,
	reducer?: Reducer<State, Action>
) => {
	const fallbackReducer = useCallback<Reducer<State, Action>>(
		(_, action: Action) => action as unknown as State,
		[]
	);

	const reducerRef = useRef<Reducer<State, Action>>(reducer ?? fallbackReducer);
	reducerRef.current = reducer ?? fallbackReducer;

	const [state, setState] = useState(initialState);
	const prevInitialRef = useRef(initialState);
	useEffect(() => {
		if (prevInitialRef.current === initialState) {
			return;
		}
		prevInitialRef.current = initialState;
		setState(initialState);
	}, [initialState]);

	const dispatch = useCallback(
		(action: OptimisticAction<State, Action>) => {
			setState((prev) => {
				const resolvedAction =
					typeof action === 'function'
						? (action as (value: State) => Action)(prev)
						: action;
				return reducerRef.current(prev, resolvedAction);
			});
		},
		[]
	);

	return [state, dispatch] as const;
};
