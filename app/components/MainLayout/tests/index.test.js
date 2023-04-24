import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { browserHistory, MemoryRouter } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import Emitter from 'utils/events';
import history from 'utils/history';
import { TOKEN_KEY, EMITTER_EVENTS } from 'utils/constants';
import StorageService from 'utils/StorageService';
import MainLayout from '../index';
import configureStore from '../../../configureStore';
import { ROUTES } from '../../../containers/constants';
import { render } from '../../../test-utils';

const { store } = configureStore({}, history);
const tokenValue = 'test token';
const componentWrapper = props => render(<MainLayout {...props} />);

const login = () => StorageService.set(TOKEN_KEY, tokenValue);
const logout = () => StorageService.clear();

describe('<MainLayout />', () => {
  beforeAll(() => {
    login();
  });

  it('should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = componentWrapper();
    expect(firstChild).toMatchSnapshot();
  });
  it('should render Div', () => {
    const { container } = componentWrapper();
    console.log(store.getState(), container, 'container');
    const element = container.firstElementChild;
    expect(element.tagName).toEqual('DIV');
  });
  it('should display MenuFoldOutlined icon', () => {
    const { getByTestId } = componentWrapper();
    const element = getByTestId('ToggleIcon');
    fireEvent.click(element);
    expect(element.tagName).toEqual('SPAN');
  });
  it('renders routes file without login', () => {
    logout();
    const { getByTestId } = componentWrapper();
    const element = getByTestId('AppRoutes');
    expect(element.tagName).toEqual('DIV');
  });
  it('emitter events', () => {
    const { container } = componentWrapper();
    Emitter.emit(EMITTER_EVENTS.LOG_IN);
    Emitter.emit(EMITTER_EVENTS.LOG_OUT);
    expect(container.firstChild.tagName).toEqual('DIV');
  });
});
