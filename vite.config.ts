import { defineConfig, Plugin, ViteDevServer } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { Browser, chromium } from 'playwright';
import type { ServerResponse } from 'http';
import type { Connect } from 'vite'

function pdfGeneratorPlugin(): Plugin {
  return {
    name: 'vite-plugin-pdf-generator',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        if (req.url === '/generate-pdf') {
          console.log('Received request for /generate-pdf');
          let browser: Browser | undefined;
          try {
            const address = server.httpServer?.address();
            let serverUrl = '';
            if (typeof address === 'object' && address !== null) {
              const host = address.address === '::' || address.address === '0.0.0.0' ? 'localhost' : address.address;
              serverUrl = `http://${host}:${address.port}`;
              console.log(`Target URL for PDF generation: ${serverUrl}`);
            } else {
              throw new Error('Could not determine Vite server address.');
            }

            console.log('Launching headless browser for PDF...');
            browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();

            console.log(`Navigating to ${serverUrl}...`);
            await page.goto(serverUrl, { waitUntil: 'networkidle' }); 

            console.log('Waiting for fonts to be ready...');
            await page.evaluate(async () => {
              await document.fonts.ready;
            });
            
            await page.waitForTimeout(500); 

            console.log('Injecting page break styles for PDF...');
            await page.addStyleTag({
              content: `
                /* Base A4 page styles */
                .page-a4 {
                  width: 210mm;
                  height: 297mm;
                  overflow: hidden;
                }
                @media print {
                  #pdf-button { display: none !important; } /* Hide button in PDF */
                  #page1 {
                    page-break-after: always;
                    overflow: hidden !important; 
                  }
                  #page2 {
                    page-break-before: always;
                    overflow: hidden !important;
                  }
                  .page-a4 {
                      height: 297mm !important;
                      width: 210mm !important;
                      box-shadow: none !important;
                      margin: 0 !important;
                      padding: 0mm !important;
                      box-sizing: border-box !important;
                  }
                  body {
                      background-color: white !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      display: block !important;
                  }
                  @page {
                    size: A4;
                    margin: 0;
                  }
                }
                /* Apply some styles always, not just for print */
                body > div.page-a4 {
                   box-shadow: none !important; /* Hide shadow when generating PDF */
                }
              `
            });

            console.log('Generating PDF buffer...');
            const pdfBuffer = await page.pdf({
              format: 'A4',
              printBackground: true,
              margin: { top: '0', right: '0', bottom: '0', left: '0' },
              displayHeaderFooter: false,
            });
            console.log('PDF buffer generated.');

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="CV.pdf"');
            res.setHeader('Content-Length', pdfBuffer.length);

            res.end(pdfBuffer);
            console.log('PDF sent to client.');

          } catch (error) {
            console.error('Error generating PDF:', error);
            res.statusCode = 500;
            res.end('Internal Server Error: Could not generate PDF');
          } finally {
            if (browser) {
              await browser.close();
              console.log('Playwright browser closed.');
            }
          }
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    pdfGeneratorPlugin()
  ],
})