import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm }  from './components/auth/LoginForm.tsx';
import { RegisterForm } from './components/auth/RegisterForm.tsx';
import { NewOrderForm } from './components/order/NewOrderForm.tsx';
import { OrdersList } from './components/order/OrdersList.tsx';
import { OrderDetails } from './components/order/OrderDetails.tsx';

function App() {

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/orders" element={<OrdersList />} />
                    <Route path="/create" element={<NewOrderForm />} />
                    <Route path="/order/:id" element={<OrderDetails />} />
                    <Route path="/" element={<Navigate to="/orders" />} />
                </Routes>
            </Router>
        </div>
        
    );
}

export default App;