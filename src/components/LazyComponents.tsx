import dynamic from "next/dynamic";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8 min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium text-slate-700">Loading...</p>
    </div>
  </div>
);

export const LazyInvoicePDFPreview = dynamic(
  () => import("./organisms/InvoicePDFPreview"),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const LazyInvoicePDFDocument = dynamic(
  () => import("./molecules/InvoicePDFDocument"),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const LazyInvoiceForm = dynamic(
  () => import("./organisms/InvoiceForm"),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const LazyPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    loading: () => (
      <div className="w-full h-[1000px] bg-slate-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">
            Loading PDF viewer...
          </p>
        </div>
      </div>
    ),
    ssr: false,
  }
);
