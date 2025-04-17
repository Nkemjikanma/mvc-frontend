import { useState } from "react";
import { useMiniApp } from "./components/providers/MiniAppProvider";
import { Button } from "./components/ui/button";
import { useTopCasts } from "./lib/hooks/useTopCasts";

function App() {
    const { context } = useMiniApp();
    const { data, isLoading, error } = useTopCasts(context?.user.fid);
    return <></>;
}

export default App;
