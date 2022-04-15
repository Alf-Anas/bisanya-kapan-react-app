import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateEvent from "./views/CreateEvent";
import Event from "./views/Event";
import Home from "./views/Home";
import "./index.css";
import "antd/dist/antd.css";
import { INTERNAL_ROUTE } from "./constants/routes";
import { Button } from "antd";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={INTERNAL_ROUTE.HOME} element={<Home />} />
                <Route path={INTERNAL_ROUTE.CREATE_EVENT} element={<CreateEvent />} />
                <Route
                    path={INTERNAL_ROUTE.EVENT + "/:" + INTERNAL_ROUTE.EVENT_ID}
                    element={<Event />}
                />
                <Route
                    path="*"
                    element={
                        <div
                            style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                textAlign: "center",
                                verticalAlign: "middle",
                                paddingTop: "10rem",
                            }}
                        >
                            <h1>Not Found</h1>
                            <Button
                                type="danger"
                                onClick={() => {
                                    window.location.href = INTERNAL_ROUTE.HOME;
                                }}
                            >
                                Halaman Awal
                            </Button>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
