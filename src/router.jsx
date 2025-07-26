import { createBrowserRouter } from 'react-router-dom';
import SignInPage from './auth/sign-in';

import App from './App';
import GoogleConnect from './Integratons/page';
import FlowsPage from './Pages/FlowPage';
import FlowBuilder from './Pages/FlowBuilder';
import LandingPage from './Pages/Home';
import TriggerDemoPage from './Pages/TriggerDemoPage';


const router = createBrowserRouter([
  {
    path: '/auth/sign-in',
    element: <SignInPage />,
  },
  {
    element: <App />,
    children: [
      { path: '/', element: <LandingPage/>},
      { path: '/flows', element: <FlowsPage/> },
      {path:'/integrations',element:<GoogleConnect/>},
      { path: '/flow-builder/:id', element: <FlowBuilder /> },
      { path: '/flow-builder', element: <FlowBuilder /> },
      {path:'/trigger-demo',element:<TriggerDemoPage/>},
      { path: '*', element: <div>404</div> },
    ],
  },
]);

export default router;
