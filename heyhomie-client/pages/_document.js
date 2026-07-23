import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

// Import Facebook pixel ID
import { FB_PIXEL_ID } from '../lib/fpixel';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;
        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
                });
            const initialProps = await Document.getInitialProps(ctx);

            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
            <Html translate='no'>
                <Head>
                    <link rel='preconnect' href='https://fonts.gstatic.com' />
                    <link href='https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap' rel='stylesheet' />
                    <link href='https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap' rel='stylesheet'></link>
                    <link rel='manifest' href='/manifest.json' />
                    <link rel='icon' href='/favicon-32x32-svg.svg' type='image/svg+xml' />
                    <link rel='alternate icon' href='/favicon-16x16.png' type='image/png' sizes='16x16' />
                    <link rel='alternate icon' href='/favicon-32x32.png' type='image/png' sizes='32x32' />
                    <link rel='alternate icon' href='/favicon-96x96.png' type='image/png' sizes='96x96' />
                    <link rel='apple-touch-icon' href='/apple-icon-180x180.png'></link>
                    {/* Open Graph tags */}
                    <meta property='og:image' content='https://www.heyhomie.io/homie-meta.jpg' />
                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    {process.env.NEXT_PUBLIC_NODE_ENV === 'production' && (
                        <>
                            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`} />
                            <script
                                dangerouslySetInnerHTML={{
                                    __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
                                        page_path: window.location.pathname,
                                    });
                                    `,
                                }}
                            />
                        </>
                    )}
                    {/* Global Site Code Pixel - Facebook Pixel */}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', ${FB_PIXEL_ID});
                `,
                        }}
                    />
                    <noscript>
                        <img height='1' width='1' style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`} />
                    </noscript>
                    <meta name='facebook-domain-verification' content='imnqg9t9gscyxvc65a9yxra8dp44oy' />
                    <meta name='facebook-domain-verification' content='itw83idbbhj42kk3f1rtceshl14p18' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;

/*
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
*/
