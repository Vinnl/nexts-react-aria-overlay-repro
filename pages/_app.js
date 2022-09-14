import { SSRProvider } from "@react-aria/ssr";
import { OverlayProvider } from "@react-aria/overlays";
import '../styles/globals.css'
import { useReducer } from "react";

function MyApp({ Component, pageProps }) {
  const [renders, rerender] = useReducer((renders) => renders + 1, 0);

  return (
    <SSRProvider>
      <OverlayProvider id="overlayProvider">
        <Component {...pageProps} />
        <div style={{height: "50vh", background: "aquamarine"}} onClick={() => setTimeout(rerender, 2000)}>
          The popover should cover this element. Renders: {renders}. Click me to schedule a re-render in two seconds.
        </div>
      </OverlayProvider>
    </SSRProvider>
  )
}

export default MyApp
