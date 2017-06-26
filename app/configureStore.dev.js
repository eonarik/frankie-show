import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import DevTools from './components/devtools/devTools.jsx';
import rootReducer from './reducers';

// import createLogger from 'redux-logger';


export default function (initialState = {}) {
  // const logger = createLogger();
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(thunk),
    // applyMiddleware(thunk, logger),
    DevTools.instrument()
    // ,applyMiddleware(logger,)
    )
  );

  if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers').default)
    );
  }

  return store;
}
