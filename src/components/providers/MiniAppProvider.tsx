import sdk, { type Context } from "@farcaster/frame-sdk";
import {
    type ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export type MiniAppContextType = {
    context: Context.FrameContext | undefined;
    isLoaded: boolean;
    handleAddFrame: () => void;
    added: boolean;
};

const MiniAppContext = createContext<MiniAppContextType | undefined>(undefined);

export function MiniAppProvider({ children }: { children: ReactNode }) {
    const [context, setContext] = useState<MiniAppContextType["context"]>();
    const [isLoaded, setIsLoaded] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const load = async () => {
            const context = await sdk.context;

            if (context) {
                setContext(context);
                setAdded(context.client.added);
            }

            await sdk.actions.ready();
            setIsLoaded(true);

            sdk.on("frameAdded", ({ notificationDetails }) => {
                setAdded(true);
                console.log(notificationDetails);
            });

            sdk.on("frameRemoved", () => {
                setAdded(false);
            });
        };

        if (sdk && !isLoaded) {
            setIsLoaded(true);
            load();
        }
        return () => {
            sdk.removeAllListeners();
        };
    }, []);

    const handleAddFrame = useCallback(() => {
        if (context?.client.added) {
            return;
        }
        sdk.actions.addFrame();
    }, [context?.client.added]);

    const value = useMemo(
        () => ({
            context,
            isLoaded,
            handleAddFrame,
            added,
        }),
        [context, isLoaded, handleAddFrame, added],
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
