const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Logo / Brand */}
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-black shadow-xl">
          <span className="text-2xl font-bold text-white">M</span>
        </div>

        {/* Loading animation */}
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black" />
        </div>

        <p className="mt-5 text-sm font-medium tracking-wide text-gray-500">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;