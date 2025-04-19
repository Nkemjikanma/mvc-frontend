import { Home } from "./components/Home";
import { useMiniApp } from "./components/providers/MiniAppProvider";

function App() {
    const { context } = useMiniApp();

    return (
        <>
            <Home context={context} />
        </>
    );
}

export default App;
