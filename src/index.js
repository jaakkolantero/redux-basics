import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import debounce from "lodash.debounce";

export const ADD_BACKEND = "ADD_BACKEND";
export const SELECT_BACKEND = "SELECT_BACKEND";
export const SET_BACKEND_URL = "SET_BACKEND_URL";

/* REDUCERS */
const backend = (state = {}, action) => {
  switch (action.type) {
    case ADD_BACKEND:
      return {
        id: action.id,
        name: action.name,
        url: action.url,
        selected: false,
        disabled: action.disabled || false,
        customized: action.customized || false
      };
    case SELECT_BACKEND:
      if (state.id === action.id) {
        return {
          ...state,
          selected: true
        };
      } else {
        return {
          ...state,
          selected: false
        };
      }
    case SET_BACKEND_URL:
      if (state.id === action.id) {
        return {
          ...state,
          url: action.url
        };
      }
      return state;
    default:
      return state;
  }
};

const settings = (state = [], action) => {
  switch (action.type) {
    case ADD_BACKEND:
      return [...state, backend(undefined, action)];
    case SELECT_BACKEND:
      return state.map(b => backend(b, action));
    case SET_BACKEND_URL:
      return state.map(b => backend(b, action));
    default:
      return state;
  }
};

/* ACTION CREATORS */

const addBackend = backend => ({
  type: ADD_BACKEND,
  ...backend
});

const selectBackend = id => ({
  type: SELECT_BACKEND,
  id
});

const setBackendUrl = (id, url) => ({
  type: SET_BACKEND_URL,
  id,
  url
});

/* REDUX */
const radioApp = combineReducers({ settings });
const store = createStore(radioApp, composeWithDevTools());

/* APP */

class RadioApp extends React.Component {
  constructor(props) {
    super(props);
    this.debounceText = debounce(this.debounceText, 500);
  }

  debounceText(id, value) {
    //https://janikvonrotz.ch/2017/04/20/debounce-a-redux-dispatch-method-in-a-react-component/
    store.dispatch(setBackendUrl(id, value));
  }

  render() {
    const { settings } = this.props;
    console.log(settings);
    let custom2Value = "";
    return (
      <React.Fragment>
        <form>
          {settings.map(backend => (
            <React.Fragment key={backend.id}>
              <input
                type="radio"
                checked={backend.selected}
                disabled={backend.disabled}
                onClick={() => store.dispatch(selectBackend(backend.id))}
              />
              {backend.name}
              <br />
              {backend.customized &&
                backend.selected &&
                backend.id === 3 && (
                  <React.Fragment>
                    <input
                      type="text"
                      placeholder={backend.url}
                      onChange={e => {
                        this.debounceText(backend.id, e.target.value);
                      }}
                    />
                    <br />
                  </React.Fragment>
                )}
              {backend.customized &&
                backend.selected &&
                backend.id === 4 && (
                  <React.Fragment>
                    <input
                      type="text"
                      placeholder={backend.url}
                      onChange={e => {
                        e.preventDefault();
                        //Do I have to use Reacts state for storing data?
                        custom2Value = e.target.value;
                      }}
                    />
                    <input
                      type="button"
                      value="Save"
                      onClick={e => {
                        e.preventDefault();
                        store.dispatch(setBackendUrl(backend.id, custom2Value));
                      }}
                    />
                    <br />
                  </React.Fragment>
                )}
            </React.Fragment>
          ))}
        </form>

        <h2>
          Selected API url:{" "}
          {settings.map(backend => (
            <React.Fragment key={backend.id}>
              {backend.selected && (
                <span>
                  {backend.name} - {backend.url}
                </span>
              )}
            </React.Fragment>
          ))}
        </h2>
      </React.Fragment>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <RadioApp {...store.getState()} />,
    document.getElementById("root")
  );
};

store.dispatch(
  addBackend({
    id: 0,
    name: "kvaak-backend",
    url: "http://localhost:8081"
  })
);
store.dispatch(
  addBackend({
    id: 1,
    name: "vincit-summer2018",
    url: "http://localhost:8081"
  })
);
store.dispatch(
  addBackend({
    id: 2,
    name: "mockaroo",
    url: "http://localhost:8081",
    disabled: true
  })
);
store.dispatch(
  addBackend({
    id: 3,
    name: "custom",
    url: "http://localhost:8081",
    customized: true
  })
);
store.dispatch(
  addBackend({
    id: 4,
    name: "custom2",
    url: "http://localhost:8081",
    customized: true
  })
);
store.subscribe(render);
render();
