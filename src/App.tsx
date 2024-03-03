import { SearchProvider } from './Components/Context';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Nav from './Components/Nav';
import Home from './Components/Home/Home';
import History from './Components/History/History';

function App() {
  return (
    <>
      <SearchProvider>
        <Router>
          <Nav />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/history">
              <History />
            </Route>
          </Switch>
        </Router>
      </SearchProvider>
    </>
  );
}

export default App;
