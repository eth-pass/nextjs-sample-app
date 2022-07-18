export default function LoadingIndicator({ asPage = false }) {
  const Loader = () => (
    <div className="flex items-center justify-center space-x-2 animate-bounce">
      <div className="w-6 h-6 bg-indigo-300 rounded-full"></div>
      <div className="w-6 h-6 bg-indigo-400 rounded-full"></div>
      <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
    </div>
  );
  return asPage ? (
    <>
      <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <Loader />
          </main>
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
}
