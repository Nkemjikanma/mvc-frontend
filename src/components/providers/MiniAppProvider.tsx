import sdk, { type Context } from "@farcaster/frame-sdk";
import {
    type ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export type MiniAppContextType = {
    context: Context.FrameContext | undefined;
    isLoaded: boolean;
};

const MiniAppContext = createContext<MiniAppContextType | undefined>(undefined);

export function MiniAppProvider({ children }: { children: ReactNode }) {
    const [context, setContext] = useState<MiniAppContextType["context"]>();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            const context = await sdk.context;

            if (context) {
                setContext(context);
            }

            await sdk.actions.ready();
            setIsLoaded(true);
        };

        if (sdk && !isLoaded) {
            setIsLoaded(true);
            load();
        }
        return () => {
            sdk.removeAllListeners();
        };
    }, []);

    const value = useMemo(
        () => ({
            context,
            isLoaded,
        }),
        [context, isLoaded],
    );

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400" />
            </div>
        );
    }

    return (
        <MiniAppContext.Provider value={value}>
            {children}
        </MiniAppContext.Provider>
    );
}

export function useMiniApp() {
    const context = useContext(MiniAppContext);

    if (context === undefined) {
        throw new Error("useMiniApp must be used within the provider");
    }

    return context;
}
