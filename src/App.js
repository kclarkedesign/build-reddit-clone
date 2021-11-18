import Header from "components/Header";
import { useAuthUser } from "lib/firebase";
import CreatePost from "pages/CreatePost";
import Home from "pages/Home";
import Login from "pages/Login";
import Signup from "pages/Signup";
import useStore from "store";
import { Route, Switch } from "react-router";

export default function App() {
  useAuthUser();
  const { user } = useStore();
  console.log(user);
  return (
    <>
      <Route component={Header} />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/createpost" component={CreatePost} />
        <Route path="/" component={Home} />
      </Switch>
    </>
  );
}
