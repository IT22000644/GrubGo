export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary dark:border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-dark_text dark:text-text_white">
          Loading restaurants...
        </p>
      </div>
    </div>
  );
};
